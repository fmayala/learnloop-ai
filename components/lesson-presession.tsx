import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { Lesson, User } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { IconSpinner } from './ui/icons'
import { useState } from 'react'
import toast from 'react-hot-toast'

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ')
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
}

export function LessonWelcome({
  setInput,
  lesson,
  user,
  startLesson
}: {
  setInput: UseChatHelpers['setInput']
  lesson: Lesson
  user: User
  startLesson: () => Promise<any>
}) {
  const lessonName = lesson?.name || 'Lesson'
  const lessonDescription =
    lesson?.description || 'This is a lesson description.'
  const userName = user?.name || 'User'
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  async function attemptStartLesson() {
    setIsStarting(true)
    try {
      await startLesson()
    } catch (error) {
      let err = error as Error
      toast.error(err.message)
      setIsStarting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <div>
          <h1 className="mb-2 text-lg font-semibold">{lessonName}</h1>
          <div className="flex flex-row my-4 items-center">
            <p className="mr-2 text-sm">Created by</p>
            {user?.image ? (
              <Image
                className="size-6 transition-opacity duration-300 rounded-full select-none ring-1 ring-zinc-100/10 hover:opacity-80"
                src={user?.image ? `${user.image}` : ''}
                alt={user.name ?? 'Avatar'}
                height={48}
                width={48}
              />
            ) : (
              <div className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none size-7 shrink-0 bg-muted/50 text-muted-foreground">
                {user?.name ? getUserInitials(user?.name) : null}
              </div>
            )}
            <div className="ml-2 text-sm">{userName}</div>
          </div>
        </div>
        <p className="leading-normal text-muted-foreground">
          {lessonDescription}
        </p>
        <Button className="mt-10" onClick={attemptStartLesson}>
          {isStarting ? (
            <>
              <IconSpinner className="animate-spin size-4 mr-2" /> Starting
              Lesson...
            </>
          ) : (
            'Start Lesson'
          )}
        </Button>
        {/* <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div> */}
      </div>
    </div>
  )
}
