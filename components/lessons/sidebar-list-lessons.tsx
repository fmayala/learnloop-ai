import { getLessons } from '@/app/actions/lessons/actions'
import { SidebarItemsLessons } from '@/components/lessons/sidebar-items-lessons'
import { cache } from 'react'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

const loadLessons = cache(async () => {
  return await getLessons()
})

export async function SidebarListLessons({ userId }: SidebarListProps) {
  const lessons = await loadLessons()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {lessons?.length ? (
          <div className="space-y-4 px-2">
            <SidebarItemsLessons lessons={lessons}  />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No lesson history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        {/* <ThemeToggle /> */}
        {/* <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} /> */}
      </div>
    </div>
  )
}
