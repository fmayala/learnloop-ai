import React from 'react'
import { Module } from '@prisma/client'
import { ModuleIcon } from './icons'

interface ShortAnswerProps {
  module: Module
}

export function ShortAnswer({ module }: ShortAnswerProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="short-answer" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      <p className="text-base leading-9 text-muted-foreground">
        {module.description ||
          'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p>
      <div className="flex flex-col space-y-4">
        {/* Audio player element */}
        {/* <audio controls className="w-full">
          {<source src={module.content || 'path/to/your/audio/file.mp3'} type="audio/mpeg" /> }
          Your browser does not support the audio element.
        </audio> */}
      </div>
    </div>
  )
}
export function ShortAnswerDisplay({ module }: ShortAnswerProps) {
  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="short-answer" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      {/* <p className="text-base leading-9 text-muted-foreground">
        {module.description ||
          'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
      </p> */}
      <div className="flex flex-col space-y-4">
        <p className="text-base leading-9 text-white">
          {module.question ||
            'This is a short summary of the audio content, providing an overview of what listeners can expect.'}
        </p>
        {/* Audio player element */}
        {/* <audio controls className="w-full">
          {<source src={module.content || 'path/to/your/audio/file.mp3'} type="audio/mpeg" /> }
          Your browser does not support the audio element.
        </audio> */}
      </div>
    </div>
  )
}
