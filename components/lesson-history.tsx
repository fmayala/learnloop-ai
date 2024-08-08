import * as React from 'react'
import { SidebarListLessons } from './lessons/sidebar-list-lessons'

interface LessonHistoryProps {
  userId?: string
}

export async function LessonHistory({ userId }: LessonHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      <h1 className='ml-4 my-4'>Lessons</h1>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarListLessons userId={userId} />
      </React.Suspense>
    </div>
  )
}
