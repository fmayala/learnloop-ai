'use server'
import { auth } from '@/auth'
import { Chat } from '@/components/types/types'
import { kv } from '@vercel/kv'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getChats(userId?: string | null): Promise<Chat[]> {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chatIds: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chatId of chatIds) {
      pipeline.hgetall(chatId)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(
  chatId: string,
  userId: string
): Promise<Chat | null> {
  const chat = await kv.hgetall<Chat>(`chat:${chatId}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  const userId = String(await kv.hget(`chat:${id}`, 'userId'))

  if (userId !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chatIds: string[] = await kv.zrange(
    `user:chat:${session.user.id}`,
    0,
    -1
  )
  if (!chatIds.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chatId of chatIds) {
    pipeline.del(chatId)
    pipeline.zrem(`user:chat:${session.user.id}`, chatId)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(chatId: string): Promise<Chat | null> {
  const chat = await kv.hgetall<Chat>(`chat:${chatId}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(chatId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${chatId}`)

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}
