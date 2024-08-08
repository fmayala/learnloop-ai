'use server'
import { db } from '@/auth'
import { Account } from '@/lib/db/output_types'
// Create a function that unlinks an integration from the user's account
export const unlinkIntegration = async (
  userId: string,
  integrationName: string
): Promise<{ error?: string; success?: boolean }> => {
  // Get the user's account
  const account: Account = (await db
    .selectFrom('Account')
    .selectAll()
    .where('userId', '=', userId)
    .where('provider', '=', integrationName)
    .executeTakeFirst()) as unknown as Account

  if (!account) {
    return {
      error: 'Integration not found'
    }
  }

  try {
    // Delete the account
    await db.deleteFrom('Account').where('id', '=', account.id).execute()

    return {
      success: true
    }
  } catch (error) {
    console.error('Failed to unlink integration:', error)
    return {
      error: 'Failed to unlink integration'
    }
  }
}

export async function getAccount(userId: string): Promise<Account> {
  const account = await db
    .selectFrom('Account')
    .selectAll()
    .where('userId', '=', userId)
    .where('provider', '=', 'canvas')
    .executeTakeFirst();

  if (!account) {
    throw new Error('No Canvas account linked');
  }
  return account as Account;
}
