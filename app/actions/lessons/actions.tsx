'use server'
import { s3BucketName, s3Client } from '@/app/shared'
import { auth, db } from '@/auth'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'
import { streamToString } from '../utils'
import { Readable } from 'stream'
import { generateLessonContent } from '../ai/actions'
import { Message } from 'ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  Lesson,
  LessonMessage,
  LessonSession,
  Module,
  ModuleAttempt,
  User
} from '@/lib/db/output_types'
import { appendSelectedDocumentsToContext } from '../documents/actions-documents'
import { getUserRecord } from '../auth/actions-user'

// Helper function to check if the user can create a lesson
async function canCreateLesson(user: User): Promise<boolean> {
  try {
    const lessonCreations = await db
      .selectFrom('Lesson')
      .where('userId', '=', user.id)
      .select(eb => eb.fn.count<number>('id').as('count'))
      .executeTakeFirst()

    if (!lessonCreations) {
      return false
    }

    if (
      Number(user.max_lesson_creation) === lessonCreations.count ||
      lessonCreations.count + 1 > Number(user.max_lesson_creation)
    ) {
      return false
    }

    if (Number(user.net_spend) >= Number(user.max_net_spend)) {
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to get user:', error)
    return false
  }
}

export async function createLesson(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized' }
  }

  const modules = JSON.parse(formData.get('modules') as string)
  let context = formData.get('context') as string
  const extraContext = formData.get('selectedDocuments') as string
  const modelId = formData.get('model') as string || 'openai/gpt-4o'; // Get model ID from form data

  const user = await getUserRecord()
  if (!user) {
    return { error: 'Something went wrong' }
  }

  const canCreate = await canCreateLesson(user)
  if (!canCreate) {
    return { error: 'Usage limit reached' }
  }

  try {
    context = await appendSelectedDocumentsToContext(extraContext, context)
  } catch (e) {
    console.error('Failed to fetch documents:', e)
    return
  }

  try {
    const lessonContent = await generateLessonContent(context, modules, modelId)
    const lesson = await saveLesson(session.user.id, lessonContent)
    if (lesson) {
      await createModules(lesson.id, lessonContent.modules)
    }

    console.log('Lesson created:', lesson)
    return { status: 'success', id: lesson?.id, lesson }
  } catch (e) {
    console.error('Failed to create lesson:', e)
    return { status: 'error', error: e }
  }
}

async function saveLesson(
  userId: string,
  lessonContent: any
): Promise<Lesson | null> {
  const id = nanoid()
  const shortenedName = lessonContent.name.substring(0, 50)

  const query = await db
    .insertInto('Lesson')
    .values({
      id: id,
      userId: userId.toString(),
      name: shortenedName,
      description: lessonContent.description
    })
    .returningAll()
    .executeTakeFirst()

  return query ? query : null
}

async function createModules(lessonId: string, modules: any[]): Promise<void> {
  await Promise.all(
    modules.map(async (mod: any) => {
      const isInteractive =
        mod.type === 'article' ||
        mod.type === 'image' ||
        mod.type === 'video' ||
        mod.type === 'audio' ||
        mod.type === 'short-answer'

      await db
        .insertInto('Module')
        .values({
          lessonId: lessonId,
          moduleNumber: mod.moduleNumber,
          moduleType: mod.type,
          topic: mod.name,
          description: mod.description,
          question: mod.question,
          options: mod.options ? JSON.stringify(mod.options) : null,
          isInteractive: isInteractive,
          answer: mod.answer,
          answers: mod.answers ? JSON.stringify(mod.answers) : null
        })
        .execute()
    })
  )
}

export async function getLessons(): Promise<Lesson[] | null> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return []
  }

  try {
    const lessons = await db
      .selectFrom('Lesson')
      .selectAll()
      .where('userId', '=', userId)
      .execute()

    return lessons.map(lesson => ({
      ...lesson,
      path: `/lessons/${lesson.id}`
    }))
  } catch (error) {
    return []
  }
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  try {
    const lesson: Lesson | undefined = await db
      .selectFrom('Lesson')
      .selectAll()
      .where('id', '=', lessonId)
      .where('userId', '=', userId)
      .executeTakeFirst()

    return lesson
      ? {
          id: lesson.id,
          name: lesson.name,
          description: lesson.description,
          userId: lesson.userId
        }
      : null
  } catch (e) {
    console.error('Failed to get lesson:', e)
    return null
  }
}

export async function deleteLesson({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  let lesson
  try {
    lesson = await db
      .selectFrom('Lesson')
      .selectAll()
      .where('id', '=', id)
      .where('userId', '=', session.user.id)
      .executeTakeFirst()
  } catch (e) {
    console.error('Failed to get lesson:', e)
    return {
      error: 'Something went wrong'
    }
  }

  const userId = String(lesson?.userId)

  if (userId !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    await db.deleteFrom('Lesson').where('id', '=', id).execute()
  } catch (e) {
    console.error('Failed to delete lesson:', e)
    return {
      error: 'Something went wrong'
    }
  }

  revalidatePath('/')
  return revalidatePath(path)
}

export async function deleteAllLessons() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    await db.deleteFrom('Lesson').where('userId', '=', userId).execute()

    return redirect('/lessons')
  } catch (error) {
    return {
      error: 'Something went wrong'
    }
  }
}

export async function getPreviousModuleAttempts(
  moduleId: number,
  lessonSessionId: string
): Promise<ModuleAttempt[] | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  try {
    const attempts = await db
      .selectFrom('ModuleAttempt')
      .selectAll()
      .where('moduleId', '=', moduleId)
      .where('lessonSessionId', '=', lessonSessionId)
      .execute()

    return attempts
  } catch (e) {
    console.error('Failed to get previous module attempts:', e)
    return null
  }
}

// Session
export async function createModuleAttempt(
  moduleId: number,
  lessonSessionId: string,
  correct: boolean,
  response: string
): Promise<ModuleAttempt | null> {
  console.log(
    'Recording module attempt:',
    moduleId,
    lessonSessionId,
    correct,
    response
  )

  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  try {
    const previousAttempts = await getPreviousModuleAttempts(
      moduleId,
      lessonSessionId
    )
    if (!previousAttempts) {
      return null
    }

    // Create a new module attempt
    const moduleAttempt: ModuleAttempt | undefined = await db
      .insertInto('ModuleAttempt')
      .values({
        moduleId: moduleId,
        lessonSessionId: lessonSessionId,
        userId: session.user.id,
        success: correct,
        response: response,
        timestamp: new Date(),
        attemptNumber: previousAttempts.length + 1
      })
      .returningAll()
      .executeTakeFirst()

    if (!moduleAttempt) {
      return null
    }
    return {
      id: moduleAttempt.id,
      moduleId: moduleAttempt.moduleId,
      lessonSessionId: moduleAttempt.lessonSessionId,
      userId: moduleAttempt.userId,
      success: moduleAttempt.success,
      response: moduleAttempt.response,
      timestamp: moduleAttempt.timestamp,
      attemptNumber: moduleAttempt.attemptNumber
    }
  } catch (e) {
    console.error('Failed to record module attempt:', e)
    return null
  }
}

export async function appendMessage(
  message: Message,
  moduleId: number | null,
  lessonId: string | null,
  lessonSessionId: string | null
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    // Only store the message if there is not an existing lesson message with the same id
    const existingMessage = await db
      .selectFrom('LessonMessage')
      .selectAll()
      .where('id', '=', message.id)
      .executeTakeFirst()

    if (existingMessage) {
      // update the message
      const updatedMessage: LessonMessage | undefined = (await db
        .updateTable('LessonMessage')
        .set({
          content: message.content
        })
        .where('id', '=', message.id)
        .returningAll()
        .executeTakeFirst())

      if (!updatedMessage) {
        return null
      }

      return {
        id: updatedMessage.id,
        content: updatedMessage.content,
        role: updatedMessage.role,
        lessonId: updatedMessage.lessonId,
        moduleId: updatedMessage.moduleId,
        isSystem: updatedMessage.isSystem,
        createdAt: updatedMessage.createdAt,
        sessionId: updatedMessage.sessionId
      }
    }

    const lessonMessage = (await db
      .insertInto('LessonMessage')
      .values({
        id: message.id,
        content: message.content,
        role: message.role,
        lessonId: lessonId ? lessonId : '',
        moduleId: moduleId ? moduleId : -1,
        isSystem: message.role === 'system',
        createdAt: new Date(),
        sessionId: lessonSessionId ? lessonSessionId : ''
      })
      .returningAll()
      .executeTakeFirst()) as unknown as LessonMessage

    return {
      id: lessonMessage.id,
      content: lessonMessage.content,
      role: lessonMessage.role,
      lessonId: lessonMessage.lessonId,
      moduleId: lessonMessage.moduleId,
      isSystem: lessonMessage.isSystem,
      createdAt: lessonMessage.createdAt,
      sessionId: lessonMessage.sessionId
    }
  } catch (e) {
    console.error('Failed to append message:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

// Go back to the previous module
export async function previousModule(lessonId: string, sessionId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const lessonSession = await db
      .selectFrom('LessonSession')
      .selectAll()
      .where('id', '=', sessionId)
      .where('lessonId', '=', lessonId)
      .where('userId', '=', session.user.id)
      .executeTakeFirst()

    if (!lessonSession) {
      return {
        error: 'Unauthorized'
      }
    }

    if (!lessonSession.currentModuleId) {
      return {
        error: 'No current module'
      }
    }

    const previousModule = await db
      .selectFrom('Module')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('id', '=', lessonSession.currentModuleId - 1)
      .executeTakeFirst()

    if (!previousModule) {
      return {
        error: 'No more modules'
      }
    }

    const updatedLessonSession = await db
      .updateTable('LessonSession')
      .set({
        currentModuleId: previousModule.id,
        lastChangeTime: new Date()
      })
      .where('id', '=', lessonSession.id)
      .where('completed', '=', false)
      .execute()

    return {
      lessonSession: updatedLessonSession,
      previousModule: previousModule
    }
  } catch (e) {
    console.error('Failed to update current module:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

// End the lesson session
export async function endLessonSession(lessonId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const lessonSession = await db
      .selectFrom('LessonSession')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('userId', '=', userId)
      .where('completed', '=', false)
      .executeTakeFirst()

    if (!lessonSession) {
      return {
        error: 'Unauthorized'
      }
    }

    const updatedLessonSession = (await db
      .updateTable('LessonSession')
      .set({
        endTime: new Date(),
        completed: true
      })
      .where('id', '=', lessonSession.id)
      .execute()) as unknown as LessonSession

    return {
      id: updatedLessonSession.id,
      lessonId: updatedLessonSession.lessonId,
      userId: updatedLessonSession.userId,
      startTime: updatedLessonSession.startTime,
      endTime: updatedLessonSession.endTime,
      currentModuleId: updatedLessonSession.currentModuleId,
      completed: updatedLessonSession.completed
    }
  } catch (e) {
    console.error('Failed to end lesson session:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

export async function getCurrentModule(lessonId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  try {
    const lessonSession = await db
      .selectFrom('LessonSession')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('userId', '=', session.user.id)
      .where('completed', '=', false)
      .executeTakeFirst()

    if (!lessonSession) {
      return null
    }

    if (!lessonSession.currentModuleId) {
      return null
    }

    const currentModule = (await db
      .selectFrom('Module')
      .selectAll()
      .where('id', '=', lessonSession.currentModuleId)
      .executeTakeFirst()) as unknown as Module

    if (!currentModule) {
      return null
    }

    return {
      id: currentModule.id,
      lessonId: currentModule.lessonId,
      moduleNumber: currentModule.moduleNumber,
      moduleType: currentModule.moduleType,
      topic: currentModule.topic,
      description: currentModule.description,
      question: currentModule.question,
      options: currentModule.options,
      text_content: currentModule.text_content,
      answer: currentModule.answer,
      isInteractive: currentModule.isInteractive,
      answers: currentModule.answers
    }
  } catch (e) {
    console.error('Failed to get current module:', e)
    return null
  }
}

export async function getLessonSession(
  lessonId: string
): Promise<LessonSession | null> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  // Do a quick count to see if the user has any lesson sessions
  const lessonSessionCount = await db
    .selectFrom('LessonSession')
    .where('userId', '=', session.user.id)
    .select(eb => eb.fn.count<number>('id').as('count'))
    .executeTakeFirst()

  if (!lessonSessionCount) {
    return null
  }

  const count = (lessonSessionCount.count as number) || 0

  if (count == 0) {
    return null
  }

  try {
    console.log('hi')
    // Sort by most recent, using orderBy: { startTime: 'desc' }
    const lessonSession: LessonSession | undefined = await db
      .selectFrom('LessonSession')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('userId', '=', session.user.id)
      .where('completed', '=', false)
      .orderBy('startTime', 'desc')
      .executeTakeFirst()

    return lessonSession ? { ...lessonSession } : null
  } catch (e) {
    console.error('Failed to get lesson session:', e)
    return null
  }
}

export async function canStartLesson(user: User) {
  const session = await auth()

  if (!session?.user?.id) {
    return false
  }

  try {
    // Count lesson sessions
    const lessonSessions = await db
      .selectFrom('LessonSession')
      .select(eb => eb.fn.count<number>('id').as('count'))
      .where('userId', '=', user.id)
      .executeTakeFirst()

    if (!lessonSessions) {
      return false
    }

    if (
      Number(user.max_lesson_sessions) === lessonSessions?.count ||
      lessonSessions?.count + 1 >= Number(user.max_lesson_sessions)
    ) {
      return false
    }

    if (Number(user.net_spend) >= Number(user.max_net_spend)) {
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to get user:', error)
    return false
  }
}

export async function startLessonSession(lessonId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }
  const user = db
    .selectFrom('User')
    .selectAll()
    .where('id', '=', userId)
    .executeTakeFirst() as unknown as User

  const canStart = await canStartLesson(user)

  if (!canStart) {
    return {
      error: 'Session limit reached'
    }
  }

  try {
    // get modules of the lesson
    const modules = await db
      .selectFrom('Module')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .execute()

    // first module
    const firstModule = modules.filter(module => module.moduleNumber === 1)[0]

    // if no first module, return null
    if (!firstModule) {
      return null
    }

    // Find if there's an existing lesson session that is not completed
    const existingLessonSession = await db
      .selectFrom('LessonSession')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('userId', '=', userId)
      .where('completed', '=', false)
      .executeTakeFirst()

    if (existingLessonSession) {
      return {
        lessonSession: existingLessonSession,
        modules: modules,
        currentModule: firstModule
      }
    }

    // Create a new lesson session

    const lessonSession = await db
      .insertInto('LessonSession')
      .values({
        id: nanoid(),
        lessonId: lessonId,
        userId: userId,
        startTime: new Date(),
        currentModuleId: firstModule.id
      })
      .returningAll()
      .executeTakeFirst()

    return {
      lessonSession: lessonSession,
      modules: modules,
      currentModule: firstModule
    }
  } catch (e) {
    console.error('Failed to start lesson session:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

export async function getModules(lessonId?: string | null): Promise<Module[]> {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

  if (!lessonId) {
    return []
  }

  // TODO: ONLY ALLOW ACCESS TO MODULES THAT BELONG TO THE USER, ADD SHARE FUNCTIONALITY LATER
  try {
    const modules: Module[] = await db
      .selectFrom('Module')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .execute()

    return modules
  } catch (error) {
    return []
  }
}
