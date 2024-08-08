import { Sidebar } from '@/components/sidebar'
import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat/chat-history'
import { LinkButton } from './motion'
import Link from 'next/link'
import { LessonHistory } from './lesson-history'
import { QuizHistory } from './quiz-history'
import { SidebarMainAction } from './sidebar-main-action'

export async function SidebarDesktop() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  // console.log(session.user.id, "tes")

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <SidebarMainAction
        text="Explore"
        href="/"
        icon={'squares2x2'}
      />
      <SidebarMainAction
        text="New Chat"
        href="/chat"
        icon={'plus'}
      />
      <SidebarMainAction
        text="New Lesson"
        href="/lessons"
        icon={'plus'}
      />
      <SidebarMainAction
        text="New Quiz"
        href="/quizzes"
        icon={'plus'}
      />
      <LessonHistory userId={session?.user?.id} />
      {/* <QuizHistory userId={session?.user?.id} /> */}
    </Sidebar>
  )
}
