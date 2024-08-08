'use server';
import { auth, db } from "@/auth";
import { User } from "@prisma/client";
import { fetchDocumentsContent } from "../documents/actions-documents";
import { renderQuiz } from "../utils";

// Server-side to UI
export async function createQuiz(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      id: Date.now(),
      error: 'Unauthorized',
      display: null
    }
  }

  const context = formData.get('context') as string
  const extraContext = formData.get('selectedDocuments') as string
  const difficulty = formData.get('difficulty') as string
  const length = formData.get('length') as string
  const modelId = formData.get('model') as string || 'openai/gpt-4o'; // Get model ID from form data

  try {
    console.log('Extra context:', extraContext)
    const selectedDocuments = JSON.parse(extraContext)
    const documentsText = await fetchDocumentsContent(selectedDocuments)
    const fullContext = context + '\n\n' + documentsText

    const ui: any = await renderQuiz(difficulty, length, fullContext, modelId)

    let userRecord = await db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', session.user.id)
      .executeTakeFirst() as User

    if (userRecord === null) {
      return {
        id: Date.now(),
        error: 'User not found',
        display: null
      }
    }

    if (
      userRecord.quiz_usage === null ||
      userRecord.quiz_usage === undefined ||
      userRecord.max_quiz_previews === null ||
      userRecord.max_quiz_previews === undefined
    ) {
      return {
        id: Date.now(),
        error: 'User not found',
        display: null
      }
    }

    if (userRecord.quiz_usage > userRecord.max_quiz_previews) {
      return {
        id: Date.now(),
        error: 'Quiz preview generation limit reached',
        display: null
      }
    }


    // Update the user's quiz usage
    await db
      .updateTable('User')
      .set({
        quiz_usage: userRecord.quiz_usage + 1
      })
      .where('id', '=', session.user.id)
      .execute()

    return { id: Date.now(), error: null, display: ui }
  } catch (error) {
    console.error('Error in createQuiz:', error)
    return {
      id: Date.now(),
      display: null,
      error: 'Something went wrong'
    }
  }
}
