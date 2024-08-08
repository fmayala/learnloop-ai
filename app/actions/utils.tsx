'use server'

import { auth } from '@/auth'
import { Readable } from 'stream'
import { getMutableAIState, render } from 'ai/rsc'
import { AI, openai, openai_router } from '../shared'
import { QuizLoadComponent } from '@/components/quiz/quiz-questions-component'

// Helper function to convert a Readable stream to a string
export async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)))
    stream.on('error', err => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  })
}

export async function getSession() {
  const session = await auth()
  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  return session
}

export async function getRelevantVideos(context: string) {
  const url = 'https://youtube.googleapis.com/youtube/v3/search'
  const params = {
    key: process.env.GOOGLE_API_KEY as string,
    type: 'video',
    videoDuration: 'medium',
    q: context
  }

  // Construct the query string from the params object
  const queryString = new URLSearchParams(params).toString()
  const apiUrl = `${url}?${queryString}`
  let data

  try {
    const response = await fetch(apiUrl, {
      method: 'GET' // GET request to fetch data
    })

    if (!response.ok) {
      throw new Error('HTTP error!')
    }

    data = await response.json()
    console.log(data) // Process and use the data as needed
  } catch (error) {
    console.error('Error fetching data: ', error)
  }

  return data
}

export async function getRelevantImages(context: string) {
  const url = 'https://www.googleapis.com/customsearch/v1'
  const params = {
    key: process.env.GOOGLE_API_KEY as string,
    cx: '9070ccc0949354d84',
    searchType: 'image',
    q: context
  }

  // Construct the query string from the params object
  const queryString = new URLSearchParams(params).toString()
  const apiUrl = `${url}?${queryString}`
  let data

  try {
    const response = await fetch(apiUrl, {
      method: 'GET' // GET request to fetch data
    })

    if (!response.ok) {
      throw new Error('HTTP error!')
    }

    data = await response.json()
    console.log(data) // Process and use the data as needed
  } catch (error) {
    console.error('Error fetching data: ', error)
  }

  return data
}

// TODO: MIGRATE RENDER METHOD TO NEW VERCEL AI SDK 3.1
export async function renderQuiz(difficulty: string, length: string, context: string, modelId: string) {
  const aiState = getMutableAIState<typeof AI>() as any

  return render({
    model: modelId, // or any suitable model you intend to use
    provider: openai_router, // assuming 'openai' is correctly set up as your provider
    messages: [
      {
        role: 'system',
        content: `You are a master multiple-choice quiz generator who specializes in extracting important information from text, creating a ${difficulty} quiz with ${length} questions.
        Short length is defined as 5-10 questions, normal length is 10-15 questions, and long length is 15-20 questions.

        The quiz material context is as follows: ${context}

        Difficulty is defined below:
          Easy: Questions are simple and straightforward.
          Medium: Questions are a bit more challenging but reference material in a challenging way.
          Hard: Questions are difficult and require a deep understanding of the material.

        Your response should be formatted as follows:
        The output should be formatted as a string representing a JSON array of objects, each conforming to the schema below. The JSON string should be enclosed in a Markdown code block with JSON formatting. For example, the output should look like this:

                            json
                            [
                                {
                                    \"name\": \"Backlink Prospecting Tool\",
                                    ...
                                },
                                ...
                            ]
                            

                            Here is the output schema:
                            {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "integer", "description": "A unique identifier for each question."},
                                        "form": {"type": "string", "description": "The format of the question (e.g., multiple-choice, short-answer)"},
                                        "text": {"type": "string", "description": "The actual text of the question."},
                                        "options": {"type": "array", "items": {"type": "string"}, "description": "All question options. All generated questions are multiple-choice."},
                                        "answer": {"type": "string", "description": "The correct answer for the question."}
                                    },
                                    "required": ["id", "form", "text", "options", "answer"]
                                }
                            }
      `
      },
      ...aiState.get().messages
    ],
    text: ({ content, done }: { content: string; done: boolean }) => {
      // Check if reset is true, if so clear the prior text, otherwise append to it
      // let cleaned = aiState.get().reset
      //.   ? content.trim()
      //   : aiState.get().priorText + content.trim()

      let cleaned = content.trim()

      // Replace markdown json indicators
      cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '')

      const extractedObjects = extractJsonObjects(cleaned)
      const newQuestions = extractedObjects.map(obj => JSON.parse(obj))

      // If generation is complete, set reset to true, otherwise set to false and update priorText
      if (done) {
        aiState.done({ ...aiState.get(), questions: newQuestions})
      }

      return <QuizLoadComponent questions={newQuestions} isLoading={!done}/>
    }
  })
}

function extractJsonObjects(text: string) {
  let openBraceCount = 0
  let closeBraceCount = 0
  let currentObject = ''
  let objects = []
  let inObject = false

  for (let char of text) {
    if (char === '{') {
      inObject = true
      openBraceCount++
    }
    if (inObject) {
      currentObject += char
    }
    if (char === '}') {
      closeBraceCount++
      if (openBraceCount === closeBraceCount && openBraceCount !== 0) {
        objects.push(currentObject)
        currentObject = ''
        openBraceCount = 0
        closeBraceCount = 0
        inObject = false
      }
    }
  }

  return objects
}