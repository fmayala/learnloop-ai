import { Account } from '@/lib/db/output_types'
import { CQuizOptions, CQuizQuestionOptions, CQuizResponse } from './types'

export const CANVAS_API_URL = process.env.CANVAS_API_URL + '/api/v1'
export const CANVAS_QUIZ_API_URL = process.env.CANVAS_API_URL + '/api/quiz/v1'

export async function fetchCourses(
  accessToken: string,
  page: number,
  per_page: number
) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('per_page', per_page.toString())
  params.append('state[]', 'available')
  params.append('state[]', 'completed')
  params.append('state[]', 'unpublished')
  params.append('enrollment_type', 'teacher')

  const retrieveCoursesUrl = `${CANVAS_API_URL}/courses?${params.toString()}`
  console.log(retrieveCoursesUrl)

  const response = await fetch(retrieveCoursesUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`)
  }

  return await response.json()
}

// export async function createNewQuiz(
//   account: Account,
//   courseId: string,
//   options: CQuizOptions
// ): Promise<string> {
//   const response = await fetch(
//     `${CANVAS_API_URL}/courses/${courseId}/quizzes`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${account.access_token}`
//       },
//       body: JSON.stringify(options)
//     }
//   )

//   if (!response.ok) {
//     throw new Error(`Failed to create quiz: ${response.statusText}`)
//   }

//   const createQuizResponse = (await response.json()) as CQuizResponse
//   return createQuizResponse.id
// }

// export async function addNewQuizQuestions(
//   account: Account,
//   courseId: string,
//   quizId: string,
//   questions: CQuizItem[]
// ): Promise<void> {
//   for (const question of questions) {
//     const response = await fetch(
//       `${CANVAS_API_URL}/courses/${courseId}/quizzes/${quizId}/items`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${account.access_token}`
//         },
//         body: JSON.stringify(question)
//       }
//     )

//     if (!response.ok) {
//       throw new Error(`Failed to add question: ${response.statusText}`)
//     }
//   }
// }

// Modify the server action to use these types
export async function createClassicQuiz(
  account: Account,
  courseId: string,
  options: CQuizOptions
): Promise<string> {
  const response = await fetch(
    `${CANVAS_API_URL}/courses/${courseId}/quizzes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${account.access_token}`
      },
      body: JSON.stringify(options)
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to create quiz: ${response.statusText}`)
  }

  const createQuizResponse = (await response.json()) as CQuizResponse
  return createQuizResponse.id.toString()
}

// Modify the server action to use these types
export async function addQuizQuestions(
  account: Account,
  courseId: string,
  quizId: string,
  questions: CQuizQuestionOptions[]
): Promise<void> {
  for (const question of questions) {
    const response = await fetch(
      `${CANVAS_API_URL}/courses/${courseId}/quizzes/${quizId}/questions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${account.access_token}`
        },
        body: JSON.stringify(question)
      }
    )

    console.log(JSON.stringify(question))

    if (!response.ok) {
      throw new Error(`Failed to add question: ${response.statusText}`)
    }
  }
}
