'use server';
import { auth, db } from '@/auth'
import { LessonSession } from '@prisma/client';

export const logInteraction = async (
  lessonId: string,
  interactionType: string,
  details: string,
  data: string,
  moduleId?: number
) => {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    await db
      .insertInto('InteractionLog')
      .values({
        userId: session.user.id,
        lessonId: lessonId,
        moduleId: moduleId,
        interactionType: interactionType,
        details: details,
        data: data
      })
      .execute()
  } catch (e) {
    console.error('Failed to record interaction:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

export async function updateModule(lessonId: string, moduleId: number) {
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
      .where('lessonId', '=', lessonId)
      .where('userId', '=', session.user.id)
      .where('completed', '=', false)
      .executeTakeFirst() as unknown as LessonSession

    if (!lessonSession) {
      return {
        error: 'Unauthorized'
      }
    }

    const nextModule = await db
      .selectFrom('Module')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('id', '=', moduleId)
      .executeTakeFirst()

    if (!nextModule) {
      return {
        error: 'No more modules'
      }
    }

    const updatedLessonSession = await db
      .updateTable('LessonSession')
      .set({
        currentModuleId: nextModule.id
      })
      .where('id', '=', lessonSession.id)
      .where('completed', '=', false)
      .execute() as unknown as LessonSession

    return {
      lessonSession: {
        id: updatedLessonSession.id,
        lessonId: updatedLessonSession.lessonId,
        userId: updatedLessonSession.userId,
        startTime: updatedLessonSession.startTime,
        endTime: updatedLessonSession.endTime,
        currentModuleId: updatedLessonSession.currentModuleId,
        completed: updatedLessonSession.completed
      },
      nextModule: {
        id: nextModule.id,
        lessonId: nextModule.lessonId,
        moduleNumber: nextModule.moduleNumber,
        moduleType: nextModule.moduleType,
        topic: nextModule.topic,
        description: nextModule.description,
        question: nextModule.question,
        options: nextModule.options,
        text_content: nextModule.text_content,
        answer: nextModule.answer,
        isInteractive: nextModule.isInteractive,
        answers: nextModule.answers
      }
    }
  } catch (e) {
    console.error('Failed to update current module:', e)
    return {
      error: 'Something went wrong'
    }
  }
}

// Update the module to the next module
export async function moveToNextModule(lessonId: string, sessionId: string) {
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
      .where('completed', '=', false)
      .executeTakeFirst()

    console.log('Lesson session:', lessonSession)

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

    const nextModule = await db
      .selectFrom('Module')
      .selectAll()
      .where('lessonId', '=', lessonId)
      .where('id', '=', lessonSession.currentModuleId + 1)
      .executeTakeFirst()

    if (!nextModule) {
      console.log(lessonSession.currentModuleId + 1)
      return {
        error: 'No more modules'
      }
    }

    const updatedLessonSession = await db
      .updateTable('LessonSession')
      .set({
        currentModuleId: nextModule.id,
        lastChangeTime: new Date()
      })
      .where('id', '=', lessonSession.id)
      .where('completed', '=', false)
      .execute()

    return {
      lessonSession: updatedLessonSession,
      nextModule: nextModule
    }
  } catch (e) {
    console.error('Failed to update current module:', e)
    return {
      error: 'Something went wrong'
    }
  }
}
