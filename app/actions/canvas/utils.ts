import { db } from '@/auth'
import { Account, User } from '@/lib/db/output_types'

export const refreshToken = async (
  account: Account | null
): Promise<OAuth2TokenResponse> => {
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('client_id', process.env.CANVAS_CLIENT_ID as string)
  params.append('client_secret', process.env.CANVAS_CLIENT_SECRET as string)
  params.append('refresh_token', account?.refresh_token as string)

  const refresh_res = await fetch(
    `${process.env.CANVAS_API_URL}/login/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    }
  )

  if (!refresh_res.ok) {
    throw new Error(`Error refreshing token: ${refresh_res.statusText}`)
  }

  const refreshData: OAuth2TokenResponse = await refresh_res.json()

  console.log('Refreshed token:', refreshData)
  return refreshData
}

// Helper to refresh token if expired
export async function handleTokenRefresh(account: Account): Promise<Account> {
  if (!account) {
    throw new Error('Account is null')
  }

  if (account.expires_at && new Date(account.expires_at) < new Date()) {
    const refreshed_account = await refreshToken(account)
    if (refreshed_account) {
      let updated_account: Account | undefined = await db
        .updateTable('Account')
        .set({
          access_token: refreshed_account.access_token
        })
        .where('id', '=', account.id)
        .returningAll()
        .executeTakeFirst()

      if (!updated_account) {
        throw new Error('Failed to update account')
      }

      if (!updated_account.access_token) {
        throw new Error('Failed to update account')
      }

      return updated_account
    }
  }
  return account
}

export function checkQuizLimits(userRecord: User) {
  if (
    userRecord.published_quiz_usage === null ||
    userRecord.published_quiz_usage === undefined ||
    userRecord.max_quiz_creation === null ||
    userRecord.max_quiz_creation === undefined
  ) {
    throw new Error('User not found');
  }

  if (userRecord.published_quiz_usage >= userRecord.max_quiz_creation) {
    throw new Error('Quiz creation limit reached');
  }
}