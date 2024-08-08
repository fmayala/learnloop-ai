import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat/chat'
import { LinkButton } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { ToolButton } from '@/components/tool-button'
import { MdQuiz } from "react-icons/md";

export default function IndexPage() {
  const id = nanoid()

  return (
    <div className={'pb-[200px] pt-4 md:pt-6 mx-10'}>
      <h1 className="mb-2 text-lg font-semibold">
        Explore
      </h1>
      <ToolButton title='Quizify' description='AI-generate quizzes using textbook data or using a topic' href='/quizzes' iconName={'MdQuiz'} className='my-4' />
      <ToolButton title='AI-Powered Lessons' description='AI-generate exercise lessons using lesson material' href='/lessons' iconName={'MdQuiz'} />
    </div>
  )
}
