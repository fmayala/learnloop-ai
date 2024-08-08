'use server'
import { auth, db } from '@/auth'
import { Account, User } from '@/lib/db/output_types'

export async function getUserRecord(): Promise<User | null> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return null
  }

  try {
    const user: User | undefined = await db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', userId)
      .$castTo<User>()
      .executeTakeFirst()

    return user ? user : null
  } catch (error) {
    console.error('Failed to get user:', error)
    return null
  }
}

export async function updateQuizUsage(userId: string, published_quiz_usage: number) {
  await db
    .updateTable('User')
    .set({
      published_quiz_usage: published_quiz_usage + 1
    })
    .where('id', '=', userId)
    .execute();
}
