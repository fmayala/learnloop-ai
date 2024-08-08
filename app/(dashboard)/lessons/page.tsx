'use client'
import { MaterialSubmissionForm } from '@/components/lesson-form'

export default function LessonIndex() {
  return (
    <div className="flex flex-col mx-10 mt-8">
      <MaterialSubmissionForm isLoading={false} />
    </div>
  )
}
