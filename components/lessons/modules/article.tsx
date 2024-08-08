import React from 'react'
import { Module } from '@prisma/client'
import { ModuleIcon } from './icons'

interface ArticleProps {
  module: Module,
  // append: ()
}

export function Article({ module }: ArticleProps){
  return (
    <div className="rounded-lg border bg-background p-8">
      <div className="flex items-center mb-4">
        <ModuleIcon type={module.moduleType} />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Article Title'}
        </h2>
      </div>
      <p className="text-md mb-4 text-muted-foreground">
        {module.description ||
          'This is a short summary of the article, providing a glimpse into the topic discussed.'}
      </p>
      <div className="flex flex-col space-y-4">
        {/* <p className='text-muted-foreground'>
          The detailed content of the article will be displayed here. This
          content can include paragraphs, bullet points, images, and other
          relevant information to make the article informative and engaging.
        </p> */}
        {/* Additional content and dynamic elements */}
      </div>
    </div>
  )
}

export function ArticleDisplay({ module }: ArticleProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type={module.moduleType} />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Article Title'}
        </h2>
      </div>
      <p className="text-lg mb-4 text-muted-foreground/90 underline">
        {module.description ||
          'This is a short summary of the article, providing a glimpse into the topic discussed.'}
      </p>
      <div className="flex flex-col space-y-4">
        <p className='text-base leading-9 text-muted-foreground'>
          {module.text_content || 'The detailed content of the article will be displayed here. This content can include paragraphs, bullet points, images, and other relevant information to make the article informative and engaging.'}
        </p>
        {/* Additional content and dynamic elements */}
      </div>
    </div>
  )
}
