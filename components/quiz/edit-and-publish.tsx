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
import { Calendar } from './ui/calendar'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { publishQuizToCanvas } from '@/app/actions/canvas/actions'
import CourseList from './course-list'
import { useRouter } from 'next/navigation'
import { IconSpinner } from './ui/icons'
import { CiCircleQuestion } from 'react-icons/ci'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@radix-ui/react-tooltip'
import { CQuizOptions, CQuizQuestionOptions, RCourse } from '@/app/actions/canvas/types'
import { QuizComponent } from './quiz/quiz-questions-component'

const schema = z.object({
  title: z.string().nullable(),
  assignment_group_id: z.number().nullable(),
  points_possible: z.number().nullable(),
  due_at: z.date().nullable(),
  lock_at: z.date().nullable(),
  unlock_at: z.date().nullable(),
  grading_type: z
    .enum(['pass_fail', 'percent', 'letter_grade', 'gpa_scale', 'points'])
    .nullable(),
  instructions: z.string().nullable(),
  quiz_settings: z.object({
    calculator_type: z.enum(['none', 'basic', 'scientific']).nullable(),
    filter_ip_address: z.boolean().nullable(),
    filters: z.object({
      ips: z.array(z.tuple([z.string(), z.string()])).nullable()
    }),
    multiple_attempts: z.object({
      multiple_attempts_enabled: z.boolean().nullable(),
      attempt_limit: z.boolean().nullable(),
      max_attempts: z.number().nullable(),
      score_to_keep: z
        .enum(['average', 'first', 'highest', 'latest'])
        .nullable(),
      cooling_period: z.boolean().nullable(),
      cooling_period_seconds: z.number().nullable()
    }),
    one_at_a_time_type: z.enum(['none', 'question']).nullable(),
    allow_backtracking: z.boolean().nullable(),
    result_view_settings: z.object({
      result_view_restricted: z.boolean().nullable(),
      display_points_awarded: z.boolean().nullable(),
      display_points_possible: z.boolean().nullable(),
      display_items: z.boolean().nullable(),
      display_item_response: z.boolean().nullable(),
      display_item_response_correctness: z.boolean().nullable(),
      display_item_correct_answer: z.boolean().nullable(),
      display_item_feedback: z.boolean().nullable()
    }),
    shuffle_answers: z.boolean().nullable(),
    shuffle_questions: z.boolean().nullable(),
    require_student_access_code: z.boolean().nullable(),
    student_access_code: z.string().nullable(),
    has_time_limit: z.boolean().nullable(),
    session_time_limit_in_seconds: z.number().nullable()
  })
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
      setParsed(Array.isArray(parsedData) ? parsedData : [])
    } catch (e) {
      console.error('Failed to parse quiz data:', e)
      setParsed([])
    }
  }, [quizData])

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      due_at: null,
      unlock_at: null,
      lock_at: null,
      points_possible: null,
      assignment_group_id: null,
      grading_type: null,
      instructions: '',
      quiz_settings: {
        calculator_type: 'none',
        filter_ip_address: false,
        filters: { ips: [] },
        multiple_attempts: {
          multiple_attempts_enabled: false,
          attempt_limit: false,
          max_attempts: null,
          score_to_keep: 'highest',
          cooling_period: false,
          cooling_period_seconds: null
        },
        one_at_a_time_type: 'none',
        allow_backtracking: false,
        result_view_settings: {
          result_view_restricted: false,
          display_points_awarded: false,
          display_points_possible: false,
          display_items: false,
          display_item_response: false,
          display_item_response_correctness: false,
          display_item_correct_answer: false,
          display_item_feedback: false
        },
        shuffle_answers: false,
        shuffle_questions: false,
        require_student_access_code: false,
        student_access_code: '',
        has_time_limit: false,
        session_time_limit_in_seconds: null
      }
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
        title: data.title || '',
        assignment_group_id: data.assignment_group_id || undefined,
        due_at: data.due_at ? data.due_at.toISOString() : undefined,
        lock_at: data.lock_at ? data.lock_at.toISOString() : undefined,
        unlock_at: data.unlock_at ? data.unlock_at.toISOString() : undefined
      }
    }
    console.log(payload)
    try {
      console.log(transformQuestions(parsed))
      // const res = await publishQuizToCanvas(
      //   JSON.stringify(selectedCourse),
      //   JSON.stringify(payload),
      //   JSON.stringify(transformQuestions(parsed))
      // )
      // if (res.error) {
      //   setSubmissionError(res.error)
      //   setIsLoading(false)
      // } else {
      //   setIsLoading(false)
      //   setSubmissionSuccess(true)
      //   setTimeout(() => {
      //     router.push('/quizzes')
      //   }, 2000) // Redirect delay to show success message
      // }
    } catch (error) {
      console.error('Submission failed:', error)
      setSubmissionError('Failed to submit the quiz.')
      setIsLoading(false)
    }
  }

  const selectCourse = (course: RCourse) => {
    // Change selected course to the one selected
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
        question_type: question.question_type,
        position: index + 1,
        points_possible: question.points_possible || 1,
        correct_comments: question.correct_comments,
        incorrect_comments: question.incorrect_comments,
        neutral_comments: question.neutral_comments,
        text_after_answers: question.text_after_answers,
        answers: question.options.map((option: any, idx: number) => ({
          answer_text: option.text,
          answer_weight: option.is_correct ? 100 : 0,
          answer_comments: option.comments,
          text_after_answers: option.text_after_answers,
          answer_match_left: option.answer_match_left,
          answer_match_right: option.answer_match_right,
          matching_answer_incorrect_matches:
            option.matching_answer_incorrect_matches,
          numerical_answer_type: option.numerical_answer_type,
          exact: option.exact,
          margin: option.margin,
          approximate: option.approximate,
          precision: option.precision,
          start: option.start,
          end: option.end,
          blank_id: option.blank_id
        }))
      }
    }))
  }
  return (
    <div className="flex flex-col md:flex-row md:space-x-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pb-10 md:w-full"
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
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Instructions/Description</FormLabel>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="Enter instructions or a description for your quiz"
                    className="min-h-[150px] w-full resize-none bg-transparent border-[1px] rounded-sm px-4 py-[1rem] focus-within:outline-none sm:text-sm"
                  />
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
              name="points_possible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Possible</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || 0} />
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
              name="grading_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grading Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grading Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pass_fail">Pass/Fail</SelectItem>
                      <SelectItem value="percent">Percent</SelectItem>
                      <SelectItem value="letter_grade">Letter Grade</SelectItem>
                      <SelectItem value="gpa_scale">GPA Scale</SelectItem>
                      <SelectItem value="points">Points</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.calculator_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculator Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Calculator Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="scientific">Scientific</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.filter_ip_address"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Filter IP Address</FormLabel>
                    <FormDescription>
                      Restrict quiz access to specific IP address ranges.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.filters.ips"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address Ranges</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ? field.value.join('\n') : ''}
                      placeholder="Enter IP ranges in format [start, end] (one per line)"
                      className="min-h-[50px] w-full resize-none bg-transparent border-[1px] rounded-sm px-4 py-[1rem] focus-within:outline-none sm:text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter each IP range on a new line in the format: [start,
                    end]
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.multiple_attempts.multiple_attempts_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div
                    className={`${field.value ? 'space-y-4' : 'space-y-1'} leading-none`}
                  >
                    <FormLabel>Allow Multiple Attempts</FormLabel>
                    <FormDescription className="space-y-3">
                      {field.value && (
                        <>
                          <FormField
                            control={form.control}
                            name="quiz_settings.multiple_attempts.score_to_keep"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Score to Keep</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || ''}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Highest" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="highest">
                                      Highest Score
                                    </SelectItem>
                                    <SelectItem value="latest">
                                      Latest Score
                                    </SelectItem>
                                    <SelectItem value="average">
                                      Average Score
                                    </SelectItem>
                                    <SelectItem value="first">
                                      First Score
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="quiz_settings.multiple_attempts.attempt_limit"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Attempt Limit</FormLabel>
                                  {field.value && (
                                    <FormField
                                      control={form.control}
                                      name="quiz_settings.multiple_attempts.max_attempts"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              {...field}
                                              value={field.value || ''}
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            Set maximum number of attempts.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="quiz_settings.multiple_attempts.cooling_period"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Cooling Period</FormLabel>
                                  {field.value && (
                                    <FormField
                                      control={form.control}
                                      name="quiz_settings.multiple_attempts.cooling_period_seconds"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              {...field}
                                              value={field.value || ''}
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            Set cooling period in seconds.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.one_at_a_time_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One at a Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.allow_backtracking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Allow Backtracking</FormLabel>
                    <FormDescription>
                      Allow users to return to previous questions when ‘one at a
                      time’ is enabled.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.result_view_restricted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Restrict Result View</FormLabel>
                    <FormDescription>
                      Restrict the result view for students.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_points_awarded"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Points Awarded</FormLabel>
                    <FormDescription>
                      Display the points awarded for each question.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_points_possible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Points Possible</FormLabel>
                    <FormDescription>
                      Display the possible points for each question.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_items"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Items</FormLabel>
                    <FormDescription>
                      Display the items in the result view.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_item_response"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Item Response</FormLabel>
                    <FormDescription>
                      Display the responses for each item.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_item_response_correctness"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Item Response Correctness</FormLabel>
                    <FormDescription>
                      Display the correctness of the responses for each item.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_item_correct_answer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Item Correct Answer</FormLabel>
                    <FormDescription>
                      Display the correct answers for each item.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.result_view_settings.display_item_feedback"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display Item Feedback</FormLabel>
                    <FormDescription>
                      Display feedback for each item.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.shuffle_answers"
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
              name="quiz_settings.shuffle_questions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Shuffle Questions</FormLabel>
                    <FormDescription>
                      Shuffle the order of questions for each quiz.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.require_student_access_code"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Require Student Access Code</FormLabel>
                    <FormDescription>
                      Require a code to access the quiz.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.student_access_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if no access code is required.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.has_time_limit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Has Time Limit</FormLabel>
                    <FormDescription>
                      Set a time limit for the quiz.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quiz_settings.session_time_limit_in_seconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Limit (in seconds)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Enter time limit in seconds.
                  </FormDescription>
                  <FormMessage />
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
        <section className="space-y-5 mb-10 md:w-full">
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
