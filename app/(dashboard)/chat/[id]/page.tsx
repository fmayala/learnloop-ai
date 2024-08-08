import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions/chat/actions-chat'
import { Chat } from '@/components/chat/chat'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  // console.log(chat);

  if (!chat) {
    //console.log("dasawdwda")
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    //console.log("adwdawwda")
    notFound()
  }

  //console.log(chat?.userId !== session?.user?.id)
  // console.log(chat.messages)

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
