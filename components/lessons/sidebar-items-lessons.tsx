'use client'

import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { shareChat } from '@/app/actions/chat/actions-chat'
import { deleteLesson } from '@/app/actions/lessons/actions'

import { SidebarActions } from '@/components/chat/sidebar-actions'
import { SidebarItem } from '@/components/chat/sidebar-item'
import { SidebarItemLesson } from './sidebar-item-lessons'
import { Lesson } from '@/lib/types'
import { SidebarActionsLessons } from './sidebar-actions-lessons'

interface SidebarItemsLessonProps {
  lessons?: Lesson[]
}

interface LessonPath extends Lesson {
  path: string
}

export function SidebarItemsLessons({ lessons }: SidebarItemsLessonProps) {
  if (!lessons?.length) return null

  const rLesson = (lesson: Lesson): LessonPath => {
    return {
      ...lesson,
      path: `/lessons/${lesson.id}`
    }
  }

  return (
    <AnimatePresence>
      {lessons.map((lesson, index: number) => {
        const rLessonPath = rLesson(lesson)
        return (
          lesson && (
            <motion.div
              key={lesson?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItemLesson index={index} lesson={lesson}>
                <SidebarActionsLessons
                  lesson={rLessonPath}
                  removeLesson={deleteLesson}
                  shareLesson={shareChat}
                />
                <p></p>
              </SidebarItemLesson>
            </motion.div>
          )
        )
      })}
    </AnimatePresence>
  )
}
