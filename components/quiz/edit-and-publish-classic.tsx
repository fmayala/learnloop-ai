// Main page

'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import Textarea from 'react-textarea-autosize'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@radix-ui/react-popover'
import { CalendarIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { publishQuizToCanvas } from '@/app/actions/canvas/actions'
import { QuizComponent } from './quiz-questions-component'
import { useRouter } from 'next/navigation'
import { CiCircleQuestion } from 'react-icons/ci'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@radix-ui/react-tooltip'
import {
  CQuizOptions,
  RCourse,
  CQuizQuestionOptions
} from '@/app/actions/canvas/types'
import { Calendar } from '../ui/calendar'
import CourseList from '../course-list'
import { IconSpinner } from '../ui/icons'

const schema = z.object({
  title: z.string(), // Ensure title is not nullable
  description: z.string().optional(),
  quiz_type: z
    .enum(['practice_quiz', 'assignment', 'graded_survey', 'survey'])
    .optional(),
  assignment_group_id: z.number().optional(),
  time_limit: z.number().nullable(),
  shuffle_answers: z.boolean().optional(),
  hide_results: z.enum(['always', 'until_after_last_attempt']).nullable(),
  show_correct_answers: z.boolean().optional(),
  show_correct_answers_last_attempt: z.boolean().optional(),
  show_correct_answers_at: z.date().nullable(),
  hide_correct_answers_at: z.date().nullable(),
  allowed_attempts: z.number().optional(),
  scoring_policy: z.enum(['keep_highest', 'keep_latest']).optional(),
  one_question_at_a_time: z.boolean().optional(),
  cant_go_back: z.boolean().optional(),
  access_code: z.string().nullable(),
  ip_filter: z.string().nullable(),
  due_at: z.date().nullable(),
  lock_at: z.date().nullable(),
  unlock_at: z.date().nullable(),
  published: z.boolean().optional(),
  one_time_results: z.boolean().optional(),
  only_visible_to_overrides: z.boolean().optional()
})

export default function EditAndPublish({ session }: { session: any }) {
  const [quizData, setQuizData] = useLocalStorage<any>('quizPreviewData', [])
  const [parsed, setParsed] = React.useState<any>([])
  const [selectedCourse, setSelectedCourse] = React.useState<RCourse | null>(
    null
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const [submissionError, setSubmissionError] = React.useState('')
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    try {
      const parsedData = JSON.parse(quizData)
      console.log(parsedData)
      setParsed(Array.isArray(parsedData) ? parsedData : [])
    } catch (e) {
      console.error('Failed to parse quiz data:', e)
      setParsed([])
    }
  }, [quizData])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', // Title is the only required field
      description: '',
      quiz_type: undefined,
      assignment_group_id: undefined,
      time_limit: null,
      shuffle_answers: undefined,
      hide_results: null,
      show_correct_answers: undefined,
      show_correct_answers_last_attempt: undefined,
      show_correct_answers_at: null,
      hide_correct_answers_at: null,
      allowed_attempts: undefined,
      scoring_policy: undefined,
      one_question_at_a_time: undefined,
      cant_go_back: undefined,
      access_code: null,
      ip_filter: null,
      due_at: null,
      lock_at: null,
      unlock_at: null,
      published: undefined,
      one_time_results: undefined,
      only_visible_to_overrides: undefined
    }
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true) // Start loading
    setSubmissionError('') // Reset error message
    setSubmissionSuccess(false) // Reset success state

    // Convert show correct answers at to a date string
    const payload: CQuizOptions = {
      quiz: {
        ...data,
        show_correct_answers_at: data.show_correct_answers_at
          ? data.show_correct_answers_at.toISOString()
          : undefined,
        hide_correct_answers_at: data.hide_correct_answers_at
          ? data.hide_correct_answers_at.toISOString()
          : undefined,
        show_correct_answers: data.show_correct_answers,
        due_at: data.due_at ? data.due_at.toISOString() : undefined,
        lock_at: data.lock_at ? data.lock_at.toISOString() : undefined,
        unlock_at: data.unlock_at ? data.unlock_at.toISOString() : undefined
      }
    }
    //console.log(payload)
    try {
      const res = await publishQuizToCanvas(
        JSON.stringify(selectedCourse),
        JSON.stringify(payload),
        JSON.stringify(transformQuestions(parsed))
      )
      if (res.error) {
        setSubmissionError(res.error)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setSubmissionSuccess(true)
        setTimeout(() => {
          router.push('/quizzes')
        }, 2000) // Redirect delay to show success message
      }
    } catch (error) {
      console.error('Submission failed:', error)
      setSubmissionError('Failed to submit the quiz.')
      setIsLoading(false)
    }
  }

  const selectCourse = (course: RCourse) => {
    setSelectedCourse(course)
  }

  const updateQuestion = (id: string, key: string, value: string) => {
    const updatedQuestions = parsed.map((question: any) => {
      if (question.id === id) {
        if (key.startsWith('options.')) {
          const index = parseInt(key.split('.')[1], 10)
          const updatedOptions = [...question.options]
          updatedOptions[index] = value
          return { ...question, options: updatedOptions }
        }
        return { ...question, [key]: value }
      }
      return question
    })

    setParsed(updatedQuestions)
    setQuizData(JSON.stringify(updatedQuestions))
  }

  function onDragEnd(result: any) {
    console.log(result)
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    // Re-order the questions
    const items = JSON.parse(JSON.stringify(parsed))
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setParsed(items)
    setQuizData(JSON.stringify(items))
  }

  function transformQuestions(questions: any[]): CQuizQuestionOptions[] {
    return questions.map((question: any, index: number) => ({
      question: {
        question_name: question.question_name,
        question_text: question.text,
        quiz_group_id: question.quiz_group_id,
        question_type: 'multiple_choice_question',
        position: index + 1,
        points_possible: question.points_possible || 1,
        correct_comments: question.correct_comments,
        incorrect_comments: question.incorrect_comments,
        neutral_comments: question.neutral_comments,
        text_after_answers: question.text_after_answers,
        answers: question.options.map((option: any) => ({
          answer_text: option,
          answer_weight: option === question.answer ? 100 : 0,
          answer_comments: '',
          text_after_answers: '',
          answer_match_left: '',
          answer_match_right: '',
          matching_answer_incorrect_matches: [],
          numerical_answer_type: '',
          exact: 0,
          margin: 0,
          approximate: 0,
          precision: 0,
          start: 0,
          end: 0,
          blank_id: ''
        }))
      }
    }))
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pb-10 md:w-1/2 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide"
        >
          <CourseList
            selectedCourse={selectedCourse}
            selectCourse={selectCourse}
          />
          <label className="text-xl font-bold">Edit and Publish Quiz</label>
          <section className="space-y-5">
            <label className="text-lg font-bold">Quiz Options</label>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Name</FormLabel>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter a name for your quiz"
                    className="min-h-[50px] w-full resize-none bg-transparent border-[1px] rounded-sm px-4 py-[1rem] focus-within:outline-none sm:text-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Description</FormLabel>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter a description for your quiz"
                    className="min-h-[150px] w-full resize-none bg-transparent border-[1px] rounded-sm px-4 py-[1rem] focus-within:outline-none sm:text-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Quiz Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="practice_quiz">
                        Practice Quiz
                      </SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="graded_survey">
                        Graded Survey
                      </SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignment_group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Group ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shuffle_answers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Shuffle Answers</FormLabel>
                    <FormDescription>
                      Shuffle the order of answers for each question.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hide_results"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hide Results</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Hide Results Option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="until_after_last_attempt">
                        Until After Last Attempt
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="show_correct_answers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Correct Answers</FormLabel>
                    <FormDescription>
                      Show the correct answers to students after they submit the
                      quiz.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="show_correct_answers_last_attempt"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Show Correct Answers After Last Attempt
                    </FormLabel>
                    <FormDescription>
                      Show the correct answers only after the last attempt.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-row space-x-5">
              <FormField
                control={form.control}
                name="show_correct_answers_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pr-4">
                      Show Correct Answers At
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal rounded-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              `${field.value.toLocaleString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            ) : (
                              <span>Select Date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          className="bg-border rounded-sm p-2"
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                        <Input
                          type="time"
                          className="mt-2 bg-border"
                          value={field.value?.toLocaleTimeString([], {
                            hourCycle: 'h23',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          onChange={selectedTime => {
                            const currentTime = field.value
                            currentTime?.setHours(
                              parseInt(selectedTime.target.value.split(':')[0]),
                              parseInt(selectedTime.target.value.split(':')[1]),
                              0
                            )
                            field.onChange(currentTime)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hide_correct_answers_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pr-4">
                      Hide Correct Answers At
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal rounded-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              `${field.value.toLocaleString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            ) : (
                              <span>Select Date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          className="bg-border rounded-sm p-2"
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                        <Input
                          type="time"
                          className="mt-2 bg-border"
                          value={field.value?.toLocaleTimeString([], {
                            hourCycle: 'h23',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          onChange={selectedTime => {
                            const currentTime = field.value
                            currentTime?.setHours(
                              parseInt(selectedTime.target.value.split(':')[0]),
                              parseInt(selectedTime.target.value.split(':')[1]),
                              0
                            )
                            field.onChange(currentTime)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="allowed_attempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Attempts</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || 1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scoring_policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scoring Policy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Scoring Policy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="keep_highest">Keep Highest</SelectItem>
                      <SelectItem value="keep_latest">Keep Latest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="one_question_at_a_time"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>One Question at a Time</FormLabel>
                    <FormDescription>
                      Show one question at a time to the students.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cant_go_back"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Can&apos;t Go Back</FormLabel>
                    <FormDescription>
                      Prevent students from going back to previous questions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="access_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ip_filter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Filter</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row space-x-5">
              <FormField
                control={form.control}
                name="due_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pr-4">Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal rounded-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              `${field.value.toLocaleString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            ) : (
                              <span>Select Date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          className="bg-border rounded-sm p-2"
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                        <Input
                          type="time"
                          className="mt-2 bg-border"
                          value={field.value?.toLocaleTimeString([], {
                            hourCycle: 'h23',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          onChange={selectedTime => {
                            const currentTime = field.value
                            currentTime?.setHours(
                              parseInt(selectedTime.target.value.split(':')[0]),
                              parseInt(selectedTime.target.value.split(':')[1]),
                              0
                            )
                            field.onChange(currentTime)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unlock_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pr-4">Unlock Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal rounded-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              `${field.value.toLocaleString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            ) : (
                              <span>Select Date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          className="bg-border rounded-sm p-2"
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                        <Input
                          type="time"
                          className="mt-2 bg-border"
                          value={field.value?.toLocaleTimeString([], {
                            hourCycle: 'h23',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          onChange={selectedTime => {
                            const currentTime = field.value
                            currentTime?.setHours(
                              parseInt(selectedTime.target.value.split(':')[0]),
                              parseInt(selectedTime.target.value.split(':')[1]),
                              0
                            )
                            field.onChange(currentTime)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lock_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pr-4">Lock Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal rounded-md',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              `${field.value.toLocaleString([], {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}`
                            ) : (
                              <span>Select Date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          className="bg-border rounded-sm p-2"
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={date => date < new Date()}
                          initialFocus
                        />
                        <Input
                          type="time"
                          className="mt-2 bg-border"
                          value={field.value?.toLocaleTimeString([], {
                            hourCycle: 'h23',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          onChange={selectedTime => {
                            const currentTime = field.value
                            currentTime?.setHours(
                              parseInt(selectedTime.target.value.split(':')[0]),
                              parseInt(selectedTime.target.value.split(':')[1]),
                              0
                            )
                            field.onChange(currentTime)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      Publish the quiz so students can see it.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="one_time_results"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>One Time Results</FormLabel>
                    <FormDescription>
                      Restrict students to view their results only once after
                      submission.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="only_visible_to_overrides"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Only Visible to Overrides</FormLabel>
                    <FormDescription>
                      Make the quiz only visible to overrides.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </section>
          <Button
            type="submit"
            className="mt-4 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                Loading...
              </>
            ) : submissionSuccess ? (
              <>
                <Check className="mr-2 text-green-500" />
                Success
              </>
            ) : (
              'Save and Publish'
            )}
          </Button>
        </form>
      </Form>
      {parsed.length > 0 && (
        <section className="space-y-5 mb-10 md:w-1/2 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
          <label className="text-xl font-bold">Quiz Preview</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-row items-center space-x-2">
                <CiCircleQuestion className="size-6 text-neutral-400" />
                <h1 className="text-sm">Drag-n-drop and editable</h1>
              </div>
            </TooltipTrigger>
            <TooltipContent className="md:ml-60">
              <div className="flex flex-col space-y-2 w-[400px]">
                <p className="text-sm">
                  This section allows you to drag and drop questions to reorder
                  them. You can also edit the questions directly.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <QuizComponent
            questions={parsed}
            onDragEnd={onDragEnd}
            updateQuestion={updateQuestion}
          />
        </section>
      )}
    </div>
  )
}
