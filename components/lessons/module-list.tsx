import { UseChatHelpers } from 'ai/react'
import { Module } from '@prisma/client'
import { Audio as AudioModule } from './modules/audio'
import { FITB as FillInTheBlankModule } from './modules/fitb'
import { Image as ImageModule } from './modules/image'
import { MCQ as MultipleChoiceModule } from './modules/multiple-choice'
import { Video as VideoModule } from './modules/video'
import { ShortAnswer as ShortAnswerModule } from './modules/short-answer'
import { Article as ArticleModule } from './modules/article'
import { TrueFalse as TrueFalseModule } from './modules/truefalse'

export function ModulesList({
  setInput,
  modules
}: {
  setInput: UseChatHelpers['setInput']
  modules: Module[]
}) {
  const determineComponent = (module: Module) => {
    switch (module.moduleType) {
      case 'video':
        return <VideoModule module={module} />
      case 'image':
        return <ImageModule module={module} />
      case 'article':
        return <ArticleModule module={module} />
      case 'multiple-choice':
        return <MultipleChoiceModule module={module} />
      case 'true/false':
        return <TrueFalseModule module={module} />
      case 'audio':
        return <AudioModule module={module} />
      case 'short-answer':
        return <ShortAnswerModule module={module} />
      case 'fill-in-the-blank':
        return <FillInTheBlankModule module={module} />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 space-y-4 mt-10">
      {/* <div className="rounded-lg border bg-background p-8"> */}
      <div className="flex flex-col space-y-4">
        {modules.map((module, index) => (
          <div key={index} className="flex flex-col space-y-4">
            {determineComponent(module)}
          </div>
        ))}
      </div>
      {/* </div> */}
    </div>
  )
}

/*
{modules.map((module, index) => (
            <div key={index} className="flex flex-col space-y-4">
              {determineComponent(module)}
            </div>
          ))}*/
