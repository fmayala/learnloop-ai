'use server'
import { Readable } from 'stream'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { auth, db } from '@/auth'
import {
  Block,
  GetDocumentTextDetectionCommand,
  GetDocumentTextDetectionRequest,
  StartDocumentTextDetectionCommand
} from '@aws-sdk/client-textract'
import { tokenizeContent } from '@/lib/utils'
import { s3BucketName, s3Client, textractClient } from '@/app/shared'
import { streamToString } from '../utils'
import type { Document } from '@/lib/db/output_types'

export async function fetchDocumentsContent(documents: any) {
  return await Promise.all(
    documents.map(async (doc: any) => {
      const document = await db
        .selectFrom('Document')
        .selectAll()
        .where('id', '=', doc.id)
        .executeTakeFirst()

      if (!document) return ''

      const getObjectCommand = new GetObjectCommand({
        Bucket: s3BucketName,
        Key: document.path
      })

      const response = await s3Client.send(getObjectCommand)
      const body = await streamToString(response.Body as Readable)
      return body
    })
  ).then(texts => texts.join('\n\n'))
}

export async function readFileandTokenize(formData: FormData) {
  const file = formData.get('file') as File
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const fileName = file.name
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const putCommand = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: fileName,
      Body: fileBuffer
    })
    await s3Client.send(putCommand)

    const input = {
      DocumentLocation: {
        S3Object: {
          Bucket: s3BucketName,
          Name: fileName
        }
      }
    }
    const command = new StartDocumentTextDetectionCommand(input)
    const response = await textractClient.send(command)
    console.log(response)

    const inputGet = {
      JobId: response.JobId
    }

    let blocks: Block[] = []
    let jobComplete = false
    let nextToken: string | undefined = undefined

    while (!jobComplete) {
      const commandOptions: GetDocumentTextDetectionRequest = {
        JobId: response.JobId
      }
      if (nextToken) {
        commandOptions.NextToken = nextToken
      }

      const { JobStatus, Blocks, NextToken } = await textractClient.send(
        new GetDocumentTextDetectionCommand(commandOptions)
      )

      nextToken = NextToken

      console.log(Blocks)

      if (JobStatus === 'SUCCEEDED') {
        let bls = Blocks || []
        blocks = [...blocks, ...bls]
        jobComplete = !NextToken
      } else if (JobStatus === 'FAILED') {
        throw new Error('Job failed')
      } else {
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    let combinedText = ''
    for (const block of blocks) {
      if (block.BlockType === 'WORD') {
        combinedText += block.Text + ' '
      } else {
        combinedText += block.Text + '\n'
      }
    }

    const cleanedText = combinedText.replace(/\n{2,}/g, '\n')

    const tokenizedContent = await tokenizeContent(combinedText)

    const baseFileName = fileName.includes('.')
      ? fileName.substring(0, fileName.lastIndexOf('.'))
      : fileName

    const tokenizedFileName = `tokenized-${baseFileName}.txt`

    const putCommand2 = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: tokenizedFileName,
      Body: cleanedText,
      ContentType: 'text/plain'
    })

    await s3Client.send(putCommand2)

    let documentRecord = await db
      .insertInto('Document')
      .values({
        name: file.name,
        path: tokenizedFileName,
        type: 'text/plain',
        contextSize: tokenizedContent.length,
        userId: session.user.id
      })
      .returningAll()
      .executeTakeFirst()

    if (!documentRecord) {
      return {
        error: 'Failed to create document'
      }
    }

    return {
      tokenized: tokenizedContent,
      cleaned: cleanedText,
      document: documentRecord
    }
  } catch (e) {
    console.error('Failed to create lesson:', e)
    throw e
  }
}

export async function getDocuments(page: number, perPage: number) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  // Get paginated documents from the database, skipping and taking the specified number of documents and order by contextSize in descending order
  const documents = await db
    .selectFrom('Document')
    .selectAll()
    .orderBy('contextSize', 'desc')
    .limit(perPage)
    .offset((page - 1) * perPage)
    .execute()

  const totalDocuments = await db
    .selectFrom('Document')
    .select(eb => eb.fn.count<number>('id').as('count'))
    .executeTakeFirst()

  if (!totalDocuments) {
    return {
      error: 'Failed to fetch total documents'
    }
  }

  console.log('Documents:', documents, 'Total documents:', totalDocuments)

  return {
    documents,
    totalPages: Math.ceil(totalDocuments?.count / perPage)
  }
}

export async function appendSelectedDocumentsToContext(
  extraContext: string,
  context: string
): Promise<string> {
  const selectedDocuments = JSON.parse(extraContext)
  const documents = await Promise.all(
    selectedDocuments.map(async (doc: Document) => {
      const document = await db
        .selectFrom('Document')
        .selectAll()
        .where('id', '=', doc.id)
        .executeTakeFirst()

      if (!document) {
        return ''
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: s3BucketName,
        Key: document.path
      })

      console.log('Fetching document:', document.path)
      const response = await s3Client.send(getObjectCommand)
      const body = await streamToString(response.Body as Readable)

      return body
    })
  )

  return context + '\n\n' + documents.join('\n\n')
}
