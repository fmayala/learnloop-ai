'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ServerActionResult } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { IconSpinner, IconStop } from '@/components/ui/icons'

interface FinishLessonProps {
  endLesson: () => Promise<boolean>
}

export function FinishLesson({ endLesson }: FinishLessonProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          {isPending && <IconSpinner className="mr-2" />}
          <IconStop className="mr-2" />
          Complete Lesson
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will complete the lesson, close your progress and you will need
            to restart the lesson from the beginning if you re-attempt it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={async event => {
              event.preventDefault()
              let ended = await endLesson()

              console.log(ended, 'ended')

              if (ended) {
                setOpen(false)
                router.refresh()
              }
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            End
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
