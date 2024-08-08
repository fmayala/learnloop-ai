import React, { useState } from 'react'
import { LessonSession, Module } from '@prisma/client'
import { FaMusic } from 'react-icons/fa' // Using music icon for audio
import { ModuleIcon } from './icons'
import { Button } from '@/components/ui/button'
import { createModuleAttempt } from '@/app/actions/lessons/actions'
import { ModuleResponses } from '@/lib/types'

interface FITBProps {
  module: Module
  session?: LessonSession | null
  record: (response: Array<string>) => Promise<void>
  responses?: ModuleResponses
}

export function FITB({ module }: FITBProps) {
  return (
    <div className="rounded-lg border  bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="fitb" />
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

// FITB
export function FITBDisplay({ module, session, record, responses }: FITBProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<{
    [key: number]: boolean
  }>({})
  const res = responses?.find(
    response => response.moduleNumber === module.moduleNumber
  )

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }))
    if (submitted) {
      checkAnswer(index, value)
    }
  }

  const checkAnswer = (index: number, value: string) => {
    const correct = module.answers ? JSON.parse(module.answers) : []
    setCorrectAnswers(prev => ({ ...prev, [index]: correct[index] === value }))
  }

  const handleSubmit = async () => {
    const correct = module.answers
      ? module.answers
          .split(',')
          .map(answer => answer.trim().replace(/["'`\s\n]/g, ''))
      : []
    const newCorrectAnswers = correct.map((answer: string, index: number) => {
      const ans = answer.replace(/["'`\s\n]/g, '')
      const input = (answers[index] || '').replace(/["'`\s\n]/g, '')
      return ans === input
    })
    setCorrectAnswers(
      newCorrectAnswers.reduce(
        (acc, isCorrect, index) => {
          acc[index] = isCorrect
          return acc
        },
        {} as { [key: number]: boolean }
      )
    )
    setSubmitted(true)
    record(Object.values(answers))

    if (!session) {
      console.error('No session found')
      return
    }

    try {
      await createModuleAttempt(
        module.id,
        session.id,
        newCorrectAnswers.every(Boolean),
        String(Object.values(answers))
      )
    } catch {
      console.error('Failed to record response')
    }
  }

  const renderQuestion = (question: string) => {
    if (!res && !module.answers) {
      return <div className="text-base">{question}</div>
    }

    const parts = question.split(/\_+/)
    const inputs = []
    for (let i = 0; i < parts.length - 1; i++) {
      const resResponse = res?.responses[i]?.response?.replace(/["'`\s\n]/g, '') ?? ''
      const moduleAnswer = module.answers?.split(',')[i].replace(/["'`\s\n]/g, '') || ''

      inputs.push(<span key={`text-${i}`}>{parts[i]}</span>)
      inputs.push(
        <input
          key={`input-${i}`}
          type="text"
          className={`resize-none bg-transparent border-2 rounded-sm px-2 py-1 focus-within:outline-none sm:text-sm ${
            resResponse
              ? resResponse === moduleAnswer
                ? 'border-green-800 text-green-100'
                : 'border-red-800 text-red-100'
              : submitted && correctAnswers[i] !== undefined
                ? correctAnswers[i]
                  ? 'border-green-800 text-green-100'
                  : 'border-red-800 text-red-100'
                : ''
          }`}
          value={
            (res && res.responses[i] && res.responses[i].response) ||
            answers[i] ||
            ''
          }
          onChange={e => handleAnswerChange(i, e.target.value)}
          aria-label={`Blank ${i + 1}`}
          disabled={!!res || submitted}
        />
      )
    }
    inputs.push(
      <span key={`text-${parts.length - 1}`}>{parts[parts.length - 1]}</span>
    )
    return <div className="text-base">{inputs}</div>
  }

  return (
    <div className="rounded-lg border bg-background p-8 w-full">
      <div className="flex items-center mb-4">
        <ModuleIcon type="fitb" />
        <h2 className="text-base font-bold ml-2">
          {module.topic || 'Fill in the Blanks'}
        </h2>
      </div>
      <div className="flex flex-col space-y-4">
        {renderQuestion(module.question || '')}
      </div>
      {!submitted && (
        <Button className="mt-4" onClick={handleSubmit}>
          Submit
        </Button>
      )}
    </div>
  )
}
