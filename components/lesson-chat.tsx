'use client'
import { useChat, type Message } from 'ai/react'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/lib/hooks/useBreakpoint'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LessonWelcome } from './lesson-presession'
import { LessonSession, Module } from '@prisma/client'
import { ModulesList } from './lessons/module-list'
import { TimeElapsed } from './lessons/time-elapsed'
import { VideoDisplay } from './lessons/modules/video'
import { ArticleDisplay } from './lessons/modules/article'
import { AudioDisplay } from './lessons/modules/audio'
import { LessonChatList } from './lessons/lesson-chat-list'
import { motion } from 'framer-motion'
import { LessonChatPanel } from './lessons/lesson-chat-panel'
import {
  appendMessage,
  endLessonSession,
  previousModule,
  startLessonSession,
} from '@/app/actions/lessons/actions'
import { set } from 'react-hook-form'
import { nanoid } from '@/lib/utils'
import { FITBDisplay } from './lessons/modules/fitb'
import { TrueFalseDisplay } from './lessons/modules/truefalse'
import { MCQDisplay } from './lessons/modules/multiple-choice'
import { ShortAnswerDisplay } from './lessons/modules/short-answer'
// import track, { useTracking } from 'react-tracking'
import { LessonSidebarDesktop } from './lesson-chat-sidebar'
import { ImageDisplay } from './lessons/modules/image'
import { CompletedModules, LessonChatProps, ModuleResponses } from '@/lib/types'
import { Button } from './ui/button'
import {
  CornerUpLeft,
  CornerUpRight
} from 'lucide-react'
import { FinishLesson } from './finish-lession'
import { logInteraction, moveToNextModule, updateModule } from '@/app/actions/tracking/actions'
import { getRelevantImages, getRelevantVideos } from '@/app/actions/utils'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
const logModuleInteraction = async (
  lessonId: string,
  moduleId: number,
  interactionType: string,
  completed: boolean,
  timeSpent: number,
  details?: string,
  data?: string
) => {
  try {
    await logInteraction(
      lessonId,
      interactionType,
      JSON.stringify({
        completed,
        timeSpent,
        ...JSON.parse(details || '{}')
      }),
      data || '',
      moduleId
    )
  } catch (error) {
    console.error('Error logging module interaction:', error)
  }
}
export function LessonChat({
  id,
  lesson,
  user,
  session,
  currentModule,
  modules,
  className
}: LessonChatProps) {
  const [realMessages, setRealMessages] = useState<Message[]>([])
  // State to track the initial AI response has been fetched
  // State to track the last module for which an AI response was fetched
  const [lessonSession, setSession] = useState<LessonSession | null>(
    session as LessonSession | null
  )
  const [displayModule, setDisplayModule] = useState<Module | null>(
    currentModule as Module | null
  )
  const [updatedModule, setUpdatedModule] = useState<Module>({
    id: 0,
    lessonId: '',
    moduleNumber: -1,
    moduleType: '',
    topic: '',
    description: '',
    question: '',
    options: '',
    text_content: '',
    answer: '',
    isInteractive: false,
    answers: ''
  })
  const [startTimeInInt, setStartTimeInInt] = useState(
    lessonSession?.startTime.getTime() ?? 0
  )
  const [moduleResponses, setModuleResponses] = useState<ModuleResponses>([])
  const [imageResults, setImageResults] = useState([] as string[])
  const [videoResults, setVideoResults] = useState([] as Video[])
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [isGeneratingTextArticle, setIsGeneratingTextArticle] = useState(false)
  const [moduleStates, setModuleStates] = useState<CompletedModules>(
    modules.map(module => ({
      moduleNumber: module.moduleNumber,
      moduleType: module.moduleType,
      responded: false
    }))
  )
  const [sidebarWidth, setSidebarWidth] = useState(268)
  const { isAboveSm, isBelowSm, sm } = useBreakpoint("sm");
  const { isAboveMd } = useBreakpoint("md");
  const { isAboveLg } = useBreakpoint("lg");

  useEffect(() => {
    console.log('sidebarWidth:', sidebarWidth)
    console.log('isAboveSm:', isAboveSm)
    console.log('isBelowSm:', isBelowSm)
    console.log('sm:', sm)
  }, [sidebarWidth])

  // useChat for normal messages
  const {
    append,
    isLoading,
    messages,
    stop,
    reload,
    input,
    setInput,
    setMessages
  } = useChat({
    api: '/api/chat',
    id,
    body: {
      id,
      copy: chatMessages
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    },
    async onFinish(message) {
      console.log(message, 'on finish')
      async function updateMessages(messages: Message[]) {
        // Go through each message and check if it has an associated id, if not assign a nanoid to it using setMessages
        messages.forEach(async message => {
          console.log(message.id, 'message id')
          await appendMessage(
            {
              id: message.id,
              content: message.content,
              role: message.role,
              createdAt: message.createdAt
            },
            displayModule?.id as number,
            lesson.id,
            lessonSession?.id as string
          )
        })
      }
      updateMessages(messages)
      //
      // if (!path.includes('chat')) {
      //   router.push(`/chat/${id}`, { shallow: true, scroll: false })
      //   router.refresh()
      // }
      // Check if theres not a chat id in the path, if not, push the chat id to the url
      // if (!path.includes(`lessons/${id}`)) {
      //   // @ts-ignore
      //   router.push(`/lessons/${id}`, { shallow: true, scroll: false })
      //   router.refresh()
      // }
    }
  })

  interface Video {
    kind: string
    etag: string
    id: {
      kind: string
      videoId: string
    }
  }

  const setCurrentModule = async (module: Module) => {
    // Update the module on server
    await updateModule(lesson.id, module.id)
    setDisplayModule(module)
    setUpdatedModule(module)
    // Additional logic to handle module change, like fetching new data or resetting states
  }

  const startLesson = async () => {
    let res = await startLessonSession(lesson.id)
    if (res) {
      await logInteraction(lesson.id, 'lesson-started', '', '')
      setSession(res.lessonSession as LessonSession | null)
      setDisplayModule(res.currentModule as Module | null)
      setStartTimeInInt(res.lessonSession?.startTime.getTime() ?? 0)
    }

    if (res?.error) {
      throw new Error(res.error)
    }
  }

  async function continueLesson() {
    if (lessonSession && lesson && session) {
      try {
        // move next module server side
        let res = await moveToNextModule(lesson.id, session.id)

        if (res) {
          // Check if the module we're on has been responded to
          const moduleState = moduleStates.find(
            moduleState =>
              moduleState.moduleNumber === displayModule?.moduleNumber
          )

          // if the module has not been responded to, log the interaction as a skipped module
          if (moduleState && !moduleState.responded) {
            await logInteraction(lesson.id, 'ModuleSkipped', '', '')
          }
          // Log interaction
          await logInteraction(
            lesson.id,
            'ModuleChange',
            '',
            '',
            displayModule?.moduleNumber as number
          )
          await logInteraction(
            lesson.id,
            'ModuleStarted',
            '',
            '',
            res.nextModule?.moduleNumber as number
          )

          // Update lesson session & current module
          // setSession(res.lessonSession as LessonSession | null)
          setDisplayModule(res.nextModule as Module | null)
          setUpdatedModule(res.nextModule as Module)
          console.log(res, 'res')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function endLesson() {
    console.log('outside')
    if (lessonSession && lesson) {
      console.log(lessonSession, 'lesson session')
      try {
        // move next module server side
        let res = await endLessonSession(lesson.id)

        if (res) {
          // Check if all modules have been responded to
          const allModulesResponded = moduleStates.every(
            moduleState => moduleState.responded
          )

          if (!allModulesResponded)
            await logInteraction(lesson.id, 'LessonAbandoned', '', '')

          await logInteraction(lesson.id, 'LessonEnded', '', '')
          // Update lesson session & current module
          setSession(null)
          setDisplayModule(null)

          console.log(res)

          return true
        }
      } catch (e) {
        console.error(e)
        return false
      }
    }

    console.log(lessonSession, 'lesson session')
    console.log(lesson, 'lesson')
    console.log(session, 'session')

    console.log('reached')

    return false
  }

  async function goBackInLesson() {
    if (lessonSession && lesson && session) {
      try {
        // move next module server side
        let res = await previousModule(lesson.id, session.id)

        if (res) {
          // Log interaction
          await logInteraction(
            lesson.id,
            'ModuleChange',
            '',
            '',
            displayModule?.moduleNumber as number
          )

          // Update lesson session & current module
          // setSession(res.lessonSession as LessonSession | null)
          setDisplayModule(res.previousModule as Module | null)
          setUpdatedModule(res.previousModule as Module)
          console.log(res, 'res')
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  useEffect(() => {
    // Log module start interaction when the lesson session is started
    async function initial() {
      if (lessonSession) {
        await logInteraction(lesson.id, 'module-started', '', '')
      }
    }
    initial()
  }, [lessonSession, lesson])

  const getContextPrompt = (module: Module) => {
    let prompt = ''
    if (module.moduleType === 'short-answer') {
      prompt = `
          OMIT: You are now an answer specialist in a lesson. You have been tasked with reviewing any subsequent responses from the student to ensure their accuracy. The question is as follows:
          ${displayModule?.question}
    
          Your response should validate the student's response to the question. If the student's response is correct, respond with "Correct". If the student's response is incorrect, respond with "Incorrect". If the student's response is partially correct, respond with "Partially Correct". If the student's response is not relevant to the question, just tell the student that it is not relevant to the question. You should also include a short explanation of why the response is correct or incorrect.
          
          END OMIT
          `
    }

    return prompt
  }

  useEffect(() => {
    setRealMessages([] as Message[])
    // console.log(displayModule, 'on display module change')
    async function generateResponse() {
      // console.log(displayModule, "on generate response")
      if (!displayModule || !lessonSession) {
        return
      }

      const prompt = `
        You are a master educational content creator. You have been tasked with creating a new module for a lesson. The lesson context is as follows in the following format:
        Given the following module:
        ${JSON.stringify(displayModule, null, 2)}
  
        Your response should be whatever is appropriate for the given module. But at the very beginning of the response, prefix it with the word: 
        "MODULECONTENT:" always.
  
        If the content type is an article, you should generate a relatively lengthy article using the description of the module as context. Do not describe the content at the end of your response, or in other words do not summarize the content. The content should be a minimum of 300 words. The content should be simply content that is relevant to what the module describes.
      `

      if (!prompt) {
        return
      }

      setIsGeneratingTextArticle(true)

      await append({
        id: nanoid(),
        content: prompt,
        role: 'system'
      })

      setIsGeneratingTextArticle(false)

      await append({
        id: nanoid(),
        content: `You are a lesson assistant. You have been tasked with assisting a student in a lesson. The lesson has just started.
  
        The context for the module is as follows:
        ${JSON.stringify(displayModule, null, 2)}
  
        Your response should be a greeting to the student, and instructions on how to proceed with the module. At the very beginning of the response, prefix it with the word: 
        "GREETING:" always.
  
        Any subsequent messages by the student should be responded to with relevant information based on the module contexpt, if it is not, simply reply that it is not relevant to the module context and if they would like help with the module, do not respond contextually to the message if it is not relevant to the module context.
        `,
        role: 'system'
      })
    }

    async function getImages() {
      let res = await getRelevantImages(displayModule?.description as string)
      if (res && res.items) {
        const images = res.items.slice(0, 5) // Take the first five images
        setImageResults(images) // Set the images in the state
      }
    }

    async function getVideos() {
      let res = await getRelevantVideos(displayModule?.topic as string)

      console.log(displayModule?.description, 'description')
      console.log(displayModule?.topic, 'topic')
      console.log(res, 'res')

      if (res && res.items) {
        const videos = res.items.slice(0, 5) // Take the first five videos
        setVideoResults(videos) // Set the videos in the state
      }
    }

    if (displayModule?.moduleType === 'image') {
      // test image generation
      getImages()

      // Set module state to responded, since it's an image
      const newModuleStates = moduleStates.map(moduleState => {
        if (moduleState.moduleNumber === displayModule.moduleNumber) {
          return {
            moduleNumber: moduleState.moduleNumber,
            moduleType: moduleState.moduleType,
            responded: true
          }
        }

        return moduleState
      })
      setModuleStates(newModuleStates)
      logModuleInteraction(
        lesson.id,
        displayModule.id,
        'ModuleCompleted',
        true,
        0
      )
    }

    if (displayModule?.moduleType === 'video') {
      // test video generation
      getVideos()

      // Set module state to responded, since it's a video
      const newModuleStates = moduleStates.map(moduleState => {
        if (moduleState.moduleNumber === displayModule.moduleNumber) {
          return {
            moduleNumber: moduleState.moduleNumber,
            moduleType: moduleState.moduleType,
            responded: true
          }
        }

        return moduleState
      })
      setModuleStates(newModuleStates)
      logModuleInteraction(
        lesson.id,
        displayModule.id,
        'ModuleCompleted',
        true,
        0
      )
    }

    if (displayModule?.moduleType === 'article') {
      generateResponse()

      // Set module state to responded, since it's an article
      const newModuleStates = moduleStates.map(moduleState => {
        if (moduleState.moduleNumber === displayModule.moduleNumber) {
          return {
            moduleNumber: moduleState.moduleNumber,
            moduleType: moduleState.moduleType,
            responded: true
          }
        }

        return moduleState
      })
      setModuleStates(newModuleStates)
      logModuleInteraction(
        lesson.id,
        displayModule.id,
        'ModuleCompleted',
        true,
        0
      )
    }

    // Set the module props
    setUpdatedModule({ ...displayModule } as Module)

    // console.log(lessonSession, 'lesson session')
  }, [displayModule])

  // Update module states when a new module response is added, match the module number and type and set the responded state to true
  useEffect(() => {
    if (moduleResponses.length > 0) {
      const newModuleStates = moduleStates.map(moduleState => {
        const response = moduleResponses.find(
          moduleResponse =>
            moduleResponse.moduleNumber === moduleState.moduleNumber &&
            moduleResponse.moduleType === moduleState.moduleType
        )

        if (response) {
          return {
            moduleNumber: moduleState.moduleNumber,
            moduleType: moduleState.moduleType,
            responded: true
          }
        }

        return moduleState
      })

      setModuleStates(newModuleStates)
    }

    console.log(moduleStates, 'module states')
  }, [moduleResponses])

  const recordMCQResponse = async (response: string) => {
    // Overwrite the previous module response using the current module number
    const newModuleResponses = moduleResponses.filter(
      moduleResponse =>
        moduleResponse.moduleNumber !== displayModule?.moduleNumber
    )

    // Add the new response
    newModuleResponses.push({
      moduleType: displayModule?.moduleType as string,
      moduleNumber: displayModule?.moduleNumber as number,
      question: displayModule?.question as string,
      correct: displayModule?.answer === response,
      responses: [
        {
          input: displayModule?.answer as string,
          response: response
        }
      ]
    })

    console.log(newModuleResponses, 'new module responses')

    // Set the new module responses
    setModuleResponses(newModuleResponses)
  }

  const recordTFResponse = async (response: string) => {
    // Overwrite the previous module response using the current module number
    const newModuleResponses = moduleResponses.filter(
      moduleResponse =>
        moduleResponse.moduleNumber !== displayModule?.moduleNumber
    )

    // Add the new response
    newModuleResponses.push({
      moduleType: displayModule?.moduleType as string,
      moduleNumber: displayModule?.moduleNumber as number,
      question: displayModule?.question as string,
      correct: displayModule?.answer === response,
      responses: [
        {
          input: displayModule?.answer as string,
          response: response
        }
      ]
    })

    console.log(newModuleResponses, 'new module responses')

    // Set the new module responses
    setModuleResponses(newModuleResponses)
  }

  const recordFITBResponse = async (res: Array<string>) => {
    // Overwrite the previous module response using the current module number
    const newModuleResponses = moduleResponses.filter(
      moduleResponse =>
        moduleResponse.moduleNumber !== displayModule?.moduleNumber
    )

    // Throw an error if display module answers is undefined
    if (!displayModule?.answers) {
      throw new Error('Display module answers is undefined')
    }

    // No quotation marks, whitespace, and newlines from the answers
    const sanitizedAnswers = displayModule.answers
      .split(',')
      .map(answer => answer.trim().replace(/["'`\s\n]/g, ''))
    // Add the new response
    newModuleResponses.push({
      moduleType: displayModule?.moduleType as string,
      moduleNumber: displayModule?.moduleNumber as number,
      question: displayModule?.question as string,
      responses: res.map((answer, index) => ({
        input: answer,
        response: answer,
        correct: sanitizedAnswers[index] === answer
      }))
    })
    // Set the new module responses
    setModuleResponses(newModuleResponses)
  }

  const recordShortAnswerResponse = async (response: string) => {
    // Overwrite the previous module response using the current module number
    const newModuleResponses = moduleResponses.filter(
      moduleResponse =>
        moduleResponse.moduleNumber !== displayModule?.moduleNumber
    )

    // Add the new response
    newModuleResponses.push({
      moduleType: displayModule?.moduleType as string,
      moduleNumber: displayModule?.moduleNumber as number,
      question: displayModule?.question as string,
      responses: [
        {
          input: displayModule?.answer as string,
          response: response
        }
      ]
    })

    console.log(newModuleResponses, 'new module responses')

    // Set the new module responses
    setModuleResponses(newModuleResponses)
  }

  useEffect(() => {
    if (messages.length > 0) {
      let content = ''
      let currentMessage = messages[messages.length - 1]

      if (currentMessage.content.startsWith('MODULECONTENT:')) {
        content = currentMessage.content.replace('MODULECONTENT:', '')
        // console.log(content, 'content')

        setUpdatedModule({
          id: displayModule?.id as number,
          lessonId: displayModule?.lessonId as string,
          moduleNumber: displayModule?.moduleNumber as number,
          moduleType: displayModule?.moduleType as string,
          topic: displayModule?.topic as string,
          description: displayModule?.description as string,
          question: displayModule?.question as string,
          options: displayModule?.options as string,
          text_content: content as string
        } as Module)
      }

      // Filtering logic
      const filteredMessages = messages.filter(
        message =>
          !message.content.startsWith('MODULECONTENT:') &&
          !message.content.match(/You are a/g)
      )

      let finalMessages = filteredMessages.slice(-2) // Get the last two messages

      // Check and remove prefixes
      finalMessages = finalMessages.map(message => ({
        ...message,
        content: message.content.replace(/^(GREETING:)/, '')
      }))

      // Remove any parts of a message that start with OMIT to END OMIT, leaving only the relevant content.
      finalMessages = finalMessages.map(message => ({
        ...message,
        content: message.content.replace(/OMIT:([\s\S]*?)END OMIT/g, '')
      }))

      // Handling consecutive assistant messages
      if (
        finalMessages.length === 2 &&
        finalMessages[0].role === 'assistant' &&
        finalMessages[1].role === 'assistant'
      ) {
        finalMessages.shift() // Remove the first of the two consecutive assistant messages
      }

      setRealMessages(finalMessages)
    }
  }, [messages])

  const lessonChatRecord = async (response: string) => {
    if (displayModule?.moduleType === 'short-answer') {
      recordShortAnswerResponse(response)
    }
  }

  const renderModule = (module: Module) => {
    console.log(module.moduleType, 'module type')
    switch (module.moduleType) {
      case 'video':
        return <VideoDisplay module={module} videos={videoResults as Video[]} />
      case 'article':
        return <ArticleDisplay module={module} />
      case 'audio':
        return <AudioDisplay module={module} />
      case 'fill-in-the-blank':
        return (
          <FITBDisplay
            module={module}
            session={lessonSession}
            record={recordFITBResponse}
            responses={moduleResponses}
          />
        )
      case 'true-false':
        return (
          <TrueFalseDisplay
            module={module}
            session={lessonSession}
            record={recordMCQResponse}
            responses={moduleResponses}
          />
        )
      case 'multiple-choice':
        return (
          <MCQDisplay
            module={module}
            session={lessonSession}
            record={recordTFResponse}
            responses={moduleResponses}
          />
        )
      case 'short-answer':
        return <ShortAnswerDisplay module={module} />
      case 'image':
        return <ImageDisplay module={module} images={imageResults} />
      default:
        return <ArticleDisplay module={module} />
    }
  }

  return (
    <>
      <div className={cn('flex justify-center lg:justify-start', className)}>
        <div
          className="flex grow justify-center px-8 pb-[200px] pt-4 md:pt-10 md:mr-0"
          // only apply style on md and larger screens
          style={isAboveLg && lessonSession ? { marginRight: `${sidebarWidth}px` } : {}}
        >
          {lessonSession && !lessonSession.completed ? (
            <div className="w-full flex flex-col justify-center">
              <div
                className={`flex flex-col xl:flex-row xl:items-center space-y-3 space-x-0 xl:space-y-0 xl:space-x-4`}
              >
                <TimeElapsed startTime={startTimeInInt} />
                <Button
                  variant="outline"
                  onClick={async () => await goBackInLesson()}
                >
                  <CornerUpLeft className="mr-2" />
                  Previous Module
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => await continueLesson()}
                >
                  <CornerUpRight className="mr-2" />
                  Next Module
                </Button>
                <FinishLesson endLesson={endLesson} />
              </div>
              {updatedModule && (
                <div className={`mt-10 rounded-sm`}>
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }} // Start with the component fully transparent
                    animate={{ opacity: 1 }} // Animate to fully opaque
                    exit={{ opacity: 0 }} // Animate out to fully transparent
                    transition={{ duration: 0.5 }} // Duration of the animation (optional, can be adjusted)
                  >
                    {/* Switch through module types and render the appropriate component */}
                    {updatedModule && updatedModule.moduleType
                      ? renderModule(updatedModule as Module)
                      : null}
                  </motion.div>
                </div>
              )}
              {updatedModule &&
                (updatedModule.moduleType === 'article' ||
                  updatedModule.moduleType === 'short-answer' ||
                  updatedModule.moduleType === 'video' ||
                  updatedModule.moduleType === 'audio') &&
                !isGeneratingTextArticle && (
                  <LessonChatList
                    messages={realMessages.filter(
                      message =>
                        !message.content.startsWith('MODULECONTENT:') &&
                        !message.content.match(/You are a/g)
                    )}
                  />
                )}
            </div>
          ) : (
            // <React.Suspense fallback={<EmptyScreen setInput={setInput} />}>
            <motion.div
              initial={{ opacity: 0 }} // Start with the component fully transparent
              animate={{ opacity: 1 }} // Animate to fully opaque
              exit={{ opacity: 0 }} // Animate out to fully transparent
              transition={{ duration: 0.5 }} // Duration of the animation (optional, can be adjusted)
            >
              <LessonWelcome
                setInput={setInput}
                lesson={lesson}
                user={user}
                startLesson={startLesson}
              />
              <ModulesList setInput={setInput} modules={modules} />
            </motion.div>
            // </React.Suspense>
          )}
        </div>
        {lessonSession && (
          <LessonSidebarDesktop
            modules={modules}
            setCurrentModule={setCurrentModule}
            endLesson={endLesson}
            currentModule={updatedModule}
            moduleStates={moduleStates}
            setSidebarWidth={setSidebarWidth}
          />
        )}
      </div>
      {lessonSession && displayModule?.isInteractive ? (
        <LessonChatPanel
          id={id}
          isLoading={isLoading}
          stop={stop}
          context={getContextPrompt(displayModule as Module)}
          record={lessonChatRecord}
          append={append}
          reload={reload}
          messages={messages}
          input={input}
          setInput={setInput}
          sidebarWidth={sidebarWidth}
        />
      ) : null}
    </>
  )
}
