import { QuizCreateForm } from '@/components/quiz-form'

export default function QuizIndex() {
  return (
    <div className="flex flex-col mx-10 mt-8">
      <QuizCreateForm isLoading={false} />
    </div>
  )
}
