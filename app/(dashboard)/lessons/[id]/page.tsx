import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions/chat/actions-chat'
import {getCurrentModule, getLesson, getLessonSession, getModules} from '@/app/actions/lessons/actions'
import { cache } from 'react'
import { getUserRecord } from '@/app/actions/auth/actions-user'
import { LessonSession, Module, User } from '@prisma/client'
import { LessonChat } from '@/components/lesson-chat'
import { Lesson } from '@/components/types/types'

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

const loadLesson = cache(async (lesson_id: string) => {
  return await getLesson(lesson_id)
})

const loadUser = cache(async () => {
  return await getUserRecord()
})


export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()
  const lesson = await loadLesson(params.id) as Lesson | null
  let modules: Module[] = []
  let user: User | null = null
  let lsession: LessonSession | null = null
  let currentModule: Module | null = null

  let path: string | null = null
  if (lesson) {
    path = `/lessons/${lesson.id}`
  }
  
  if (lesson) {
    user = await loadUser() as User
    modules = await getModules(lesson.id) as Module[]
    lsession = await getLessonSession(lesson.id) as LessonSession
    currentModule = await getCurrentModule(lesson.id) as Module
    lesson.path = path as string
  }

  if (!user) {
    notFound()
  }

  if (!session?.user) {
    redirect(`/?next=/lessons/${params.id}`)
  }

  if (lesson === null || !lesson) {
    notFound()
  }

  if (lesson?.userId !== session?.user?.id) {
    notFound()
  }


  return <LessonChat id={params.id} lesson={lesson} user={user} session={lsession} modules={modules} currentModule={currentModule} />
}
