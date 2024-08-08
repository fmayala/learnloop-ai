import React, { useState } from 'react'
import { LessonSession, Module } from '@prisma/client'
import { ModuleIcon } from './icons'
import { Button } from '@/components/ui/button'
import { ModuleResponses } from '@/lib/types'
import { createModuleAttempt } from '@/app/actions/lessons/actions'

interface TrueFalseProps {
  module: Module
  session?: LessonSession | null
  record: (response: string) => Promise<void>
  responses?: ModuleResponses
}

export function TrueFalse({ module }: TrueFalseProps) {
  return (
    <div className="rounded-lg border bg-background p-8">
      <div className="flex items-center mb-4">
        <ModuleIcon type="true/false" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Multiple-Choice Title'}
        </h2>
      </div>
      <p className="text-md">
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

export function TrueFalseDisplay({ module, session, record, responses }: TrueFalseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const res = responses?.find((response) => response.moduleNumber === module.moduleNumber)

  const handleSelectOption = (option: string) => {
    setSelectedOption(option)
    if (submitted) setSubmitted(false)
  }

  const handleSubmit = async () => {
    // convert selectedOption to boolean 
    const selectedOptionBool = selectedOption === 'True'
    const moduleAnswerBool = module.answer?.toLowerCase() === 'true'

    const isAnswerCorrect = selectedOptionBool === moduleAnswerBool
    setIsCorrect(isAnswerCorrect)
    setSubmitted(true)
    
    // Record
    record(selectedOptionBool.toString() || '')

    if (!session) {
      console.error('No session found')
      return
    }

    try {
      await createModuleAttempt(module.id, session.id, isAnswerCorrect, selectedOption || '')
    } catch {
      console.error('Failed to record response')
    }
  }

  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="true/false" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'True/False Question'}
        </h2>
      </div>
      <div className="flex flex-col space-y-4 mt-10">
        <p className="text-lg font-semibold">{module.question}</p>
        <div className="flex flex-col space-y-2">
          {['True', 'False'].map((option, index) => (
            <button
              key={index}
              className={`my-2 flex items-center justify-between w-full border rounded-lg p-3 transition-colors duration-200 ease-in-out ${
                res
                  ? `cursor-default ${
                      res.responses[0].response === option
                        ? res.correct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'text-white'
                    }`
                  : `cursor-pointer ${
                      submitted
                        ? selectedOption === option
                          ? isCorrect
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          : 'text-white hover:text-muted hover:bg-gray-100'
                        : selectedOption === option
                          ? 'text-muted bg-gray-100'
                          : 'text-white hover:text-muted hover:bg-gray-100'
                    }`
              }`}
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {/* Feedback message */}
      {res ? (
        <div
          className={`mt-4 p-4 text-center rounded-lg ${
            res.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {res.correct ? 'Correct! Great job.' : 'Incorrect.'}
        </div>
      ) : (
        selectedOption &&
        submitted && (
          <div
            className={`mt-4 p-4 text-center rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? 'Correct! Great job.' : 'Incorrect.'}
          </div>
        )
      )}

      {res ? null : <Button className="mt-4" onClick={handleSubmit}>Submit</Button>}
    </div>
  )
}
