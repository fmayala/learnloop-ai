'use client'

import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import { Input } from '../ui/input';

function Question({ question, index, updateQuestion }: { question: any; index: number; updateQuestion: (id: string, key: string, value: string) => void }) {
  const handleTextChange = (e: React.FocusEvent<HTMLDivElement>, key: string) => {
    updateQuestion(question.id, key, e.currentTarget.textContent || '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    updateQuestion(question.id, key, e.target.value)
  }

  return (
    <Draggable key={question.id} draggableId={`${question.id}`} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="rounded-lg border bg-background p-8 w-full"
        >
          <h3 className="text-lg font-bold mb-5">
            {index + 1}. <span contentEditable onBlur={(e) => handleTextChange(e, 'text')}>{question.text}</span>
          </h3>
          <div className="flex flex-col space-y-2">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                className="my-2 flex items-center justify-between w-full border rounded-lg p-3 transition-colors duration-200 ease-in-out dark:text-white"
                disabled
              >
                <span contentEditable onBlur={(e) => handleTextChange(e, `options.${idx}`)}>{option}</span>
              </button>
            ))}
          </div>
          {question.answer && (
            <div className="mt-4">
              <p className="text-sm font-bold">
                Correct Answer: <span className="text-green-800">{question.answer}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export function QuizComponent({
  questions,
  onDragEnd,
  updateQuestion
}: {
  questions: any[]
  onDragEnd: (result: DropResult) => void
  updateQuestion: (id: string, key: string, value: string) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)
    onDragEnd(result)
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {provided => (
          <div
            className="space-y-10 w-full border-2 border-dashed p-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {questions.map((question, index) => (
              <Question key={question.id} question={question} index={index} updateQuestion={updateQuestion} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// SkeletonPlaceholder mimics the layout of a question but with placeholder styling
const SkeletonPlaceholder = () => (
  <div className="rounded-lg border bg-background p-8 w-full animate-pulse">
    <div className="h-6 bg-zinc-500 rounded-md mb-5"></div>{' '}
    {/* Title placeholder */}
    <div className="flex flex-col space-y-2">
      {[1, 2, 3].map((_, idx) => (
        <div key={idx} className="h-4 bg-zinc-500 rounded-lg"></div> // Option placeholders
      ))}
    </div>
  </div>
)

export function QuizLoadComponent({
  questions,
  isLoading
}: {
  questions: any[]
  isLoading: boolean
}) {
  return (
    <div className="space-y-10">
      {questions.map((question, index) => {
        return (
          <div
            key={question.id}
            className="rounded-lg border dark:bg-background p-8 w-full"
          >
            <h3 className="text-lg font-bold mb-5">
              {index + 1}. {question.text}
            </h3>
            <div className="flex flex-col space-y-2">
              {question.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  className={`my-2 flex items-center justify-between w-full border rounded-lg p-3 transition-colors duration-200 ease-in-out dark:text-white`}
                  disabled
                >
                  {option}
                </button>
              ))}
            </div>
            {/* Render correct answer if available */}
            {question.answer && (
              <div className="mt-4">
                <p className="text-sm font-bold">
                  Correct Answer:{' '}
                  <span className="text-green-800">{question.answer}</span>
                </p>
              </div>
            )}
          </div>
        )
      })}
      {isLoading && (
        <>
          <SkeletonPlaceholder />
        </>
      )}
    </div>
  )
}
