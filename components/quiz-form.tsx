'use client'
import * as React from 'react'
import { useForm, Controller, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { Dropzone } from './dropzone'
import { Progress } from './ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { CiCircleQuestion } from 'react-icons/ci'
import { signal } from '@preact/signals-react'
import DocumentList from './document-list'
import { Separator } from './ui/separator'
import { Document } from '@prisma/client'
import { IconSpinner } from './ui/icons'
import { useUIState, useActions, useAIState } from 'ai/rsc'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { AI, UIRender } from '@/app/shared'
import { getOpenRouterModels } from '@/app/actions/ai/actions'
import { Model } from 'openai/resources'
import { AIModel } from '@/app/actions/ai/types'
import { AIModels } from './ai/models'

const schema = z.object({
  context: z.string().optional(),
  files: z.array(z.instanceof(File)),
  difficulty: z.string().min(1, 'Difficulty is required.'),
  length: z.string().min(1, 'Length is required.'),
  selectedDocuments: z.array(z.any()).optional()
})

export interface MaterialSubmissionProps {
  isLoading: boolean
}

const tokenLimit = signal(100000)
const currentTokens = signal(0)
const progress = signal(0)
const isUploadingS = signal(false)

export const QuizCreateForm: React.FC<MaterialSubmissionProps> = ({
  isLoading
}) => {
  const { control, handleSubmit, setValue, watch, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      context: '',
      files: [],
      selectedDocuments: [] as Document[],
      difficulty: 'easy',
      length: 'short',
      totalContextSize: 0
    }
  })

  const [messages, setMessages] = useUIState<typeof AI>()
  const { createQuiz } = useActions<typeof AI>()
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [generatingQuiz, setGeneratingQuiz] = React.useState(false)
  const [previewQuizData, setQuizPreviewData] = useLocalStorage<string | null>(
    'quizPreviewData',
    null
  )
  const router = useRouter()

  const { isSubmitting } = useFormState({ control })
  const currentSelectedDocuments = watch('selectedDocuments')
  const context = watch('context')
  const [selectedModel, setSelectedModel] = React.useState<AIModel>({
    id: 'openai/gpt-4o',
    name: 'OpenAI: GPT-4o',
    description: 'GPT-4o is OpenAI\'s newest model after [GPT-4 Omni](/models/openai/gpt-4o), supporting both text and image inputs with text outputs.\n\nAs their most advanced small model, it is many multiples more affordable than other recent frontier models, and more than 60% cheaper than [GPT-3.5 Turbo](/models/openai/gpt-3.5-turbo). It maintains SOTA intelligence, while being significantly more cost-effective.\n\nGPT-4o achieves an 82% score on MMLU and presently ranks higher than GPT-4 on chat preferences [common leaderboards](https://arena.lmsys.org/).\n\nCheck out the [launch announcement](https://openai.com/index/gpt-4o-advancing-cost-efficient-intelligence/) to learn more.\n\n#multimodal',
    pricing: {
      prompt: '0.00000015',
      completion: '0.0000006',
      image: '0.007225',
      request: '0'
    },
    context_length: 128000,
    architecture: {
      modality: 'text+image->text',
      tokenizer: 'GPT',
      instruct_type: null
    },
    top_provider: {
      max_completion_tokens: 16000,
      is_moderated: true
    },
    per_request_limits: {
      prompt_tokens: '266666',
      completion_tokens: '66666'
    }
  });

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };


  React.useEffect(() => {}, [currentSelectedDocuments])

  const handleSelectDocument = (document: Document) => {
    // Check if the document is already selected
    const isSelected = currentSelectedDocuments.some(
      (d: Document) => d.id === document.id
    )

    if (isSelected) {
      // Update the progress
      currentTokens.value = currentTokens.value -= document.contextSize
      // Remove the document from the selection
      setValue(
        'selectedDocuments',
        currentSelectedDocuments.filter(
          (d: Document) => d.id !== document.id
        ) as Document[]
      )
    } else {
      // Update the progress
      currentTokens.value = currentTokens.value += document.contextSize
      // Add the document to the selection
      setValue('selectedDocuments', [
        ...currentSelectedDocuments,
        document
      ] as Document[])
    }

    progress.value = Math.floor((currentTokens.value / selectedModel.context_length) * 100)
  }

  const handleDropzoneChange = (newFiles: File[]) => {
    setValue('files', newFiles as any)
  }

  const handleCallback = (tokens: number) => {
    currentTokens.value = tokens

    // update progress
    progress.value = Math.floor((tokens / tokenLimit.value) * 100)
  }

  const uploadingCallback = (isUploading: boolean) => {
    console.log('isUploading:', isUploading)
    isUploadingS.value = isUploading
  }

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData()
    formData.append('context', data.context)

    for (let i = 0; i < data.files.length; i++) {
      formData.append(`file${i}`, data.files[i])
    }

    formData.append(
      'selectedDocuments',
      JSON.stringify(currentSelectedDocuments)
    )
    formData.append('difficulty', data.difficulty)
    formData.append('length', data.length)
    formData.append('model', selectedModel?.id || 'openai/gpt-4o'); // Add model ID to form data

    // Here you can submit the formData to your backend
    // Submit and get response message
    const responseMessage = await createQuiz(formData)
    console.log('Response message:', responseMessage)

    // ex: { id: 1, error: null, display: 'Quiz preview generated' }
    const formattedResponseMessage: UIRender = {
      id: responseMessage.id,
      error: responseMessage.error || '',
      display: responseMessage.display
    }
    setMessages((currentMessages: UIRender[]) => [
      ...currentMessages,
      formattedResponseMessage
    ])
    setGeneratingQuiz(true)
  }

  const handleDocumentAdd = (document: Document) => {
    setValue('selectedDocuments', [
      ...currentSelectedDocuments,
      document
    ] as Document[])
  }

  const discardQuiz = () => {
    // Clear server state and UI state
    setAIState({ ...aiState, questions: [] })
    setMessages([])
    setGeneratingQuiz(false)
  }

  const handleContinuePublish = async () => {
    setQuizPreviewData(JSON.stringify(aiState.questions))
    router.push('/quizzes/edit', { shallow: true, scroll: true })
  }

  const isValidSubmission = () => {
    // Directly watching the fields used in the custom validation logic
    const context = watch('context')
    const selectedDocuments = watch('selectedDocuments')
    // Custom validation logic
    const hasRequiredInput =
      context.trim() !== '' || selectedDocuments.length > 0
    console.log('hasRequiredInput:', hasRequiredInput)
    console.log('formState.isValid:', formState.isValid)
    // Return true if the form is valid according to Zod and custom logic is satisfied
    return formState.isValid && hasRequiredInput
  }

  React.useEffect(() => {
    // Set generating state to false since the quiz has been generated
    if (aiState.questions.length > 0) {
      setGeneratingQuiz(false)
    }
  }, [aiState.questions])

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col space-y-2 md:flex-row mb-6">
        <h1 className="font-bold text-2xl">Create a Quiz</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-row space-x-2 md:ml-4">
              <CiCircleQuestion className="self-center md:ml-2 size-6 text-neutral-400" />
              <h1 className="self-center text-neutral-400 text-sm">
                How does this tool work?
              </h1>
            </div>
          </TooltipTrigger>
          <TooltipContent className="md:ml-60">
            <div className="flex flex-col space-y-2 w-[400px]">
              <p className="text-sm">
                This tool allows you to create a quiz by adding questions and
                answers. You can also add images and videos to your quiz.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-row items-center md:ml-4">
          <Progress
            value={progress.value}
            max={selectedModel.context_length}
            className="w-48 h-2 self-center"
          />
          <h1 className="text-neutral-500 ml-4">
            {currentTokens} / {selectedModel.context_length} Tokens
          </h1>
        </div>
      </div>
      <div className="space-y-4">
        <div className="mb-3 space-y-3 pb-6">
          <div className="flex flex-row">
            <label className="text-lg font-bold">AI Model</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-row space-x-2 md:ml-4">
                  <CiCircleQuestion className="self-center md:ml-2 size-6 text-neutral-400" />
                  <h1 className="self-center text-neutral-400 text-sm">
                    What is an AI model?
                  </h1>
                </div>
              </TooltipTrigger>
              <TooltipContent className="md:ml-60">
                <div className="flex flex-col space-y-2 w-[400px]">
                  <p className="text-sm">
                    An AI model is a specialized artificial intelligence model
                    that is trained on a large amount of data to generate
                    human-like text. It is designed to understand and generate
                    natural language text based on the input it receives. There
                    are varying types of AI models, the ones listed are widely
                    used but have varying levels of accuracy and performance.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <AIModels onModelSelect={handleModelSelect} />
          <p className='text-muted-foreground'>Need more info? Models are provided through OpenRouter. View model pricing and context size <a href="https://openrouter.ai/docs/models" target="_blank" className="text-white">here</a>.</p>
        </div>
        <label className="text-lg font-bold">
          Quiz Prompt (what do you want to teach?)
        </label>
        <h2 className="text-md font-semibold mb-4">
          Additional text prompt (optional if document selected)
        </h2>
        <Controller
          name="context"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter quiz prompt here... (e.g. History of the United States.)"
              className="min-h-[150px] w-full resize-none bg-transparent border-[1px] rounded-sm px-4 py-[1rem] focus-within:outline-none sm:text-sm"
            />
          )}
        />
        {formState.errors.context && (
          <p className="text-red-500 text-sm">
            {formState.errors.context.message}
          </p>
        )}
      </div>
      <div className="space-y-4">
        <label className="text-lg font-bold">
          Quiz Materials (lesson documents -- .pdf, .docx, .doc, .pptx)
        </label>
        <DocumentList
          selectDocument={handleSelectDocument}
          selectedDocuments={currentSelectedDocuments}
        />
        <Separator text="or upload" />
        <Dropzone
          onChange={handleDropzoneChange}
          className="w-full"
          fileExtension="pdf"
          handleCallback={handleCallback}
          isUploading={uploadingCallback}
          addDocument={handleDocumentAdd}
        />
        {formState.errors.files && (
          <p className="text-red-500">Files are required</p>
        )}
      </div>

      {/* Quiz Options */}
      <label className="text-lg font-bold">Quiz Difficulty</label>
      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quiz difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="banana">Medium</SelectItem>
                <SelectItem value="blueberry">Hard</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <label className="text-lg font-bold">Quiz Length</label>
      <Controller
        name="length"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quiz length" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="short">Short (5-10 questions)</SelectItem>
                <SelectItem value="medium">Medium (10-20 questions)</SelectItem>
                <SelectItem value="long">Long (20-30 questions)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {
        // View messages in UI state, only show the last message
        messages.length > 0 && (
          <div className="flex flex-col space-y-2">
            <h1 className="font-bold text-lg">Quiz Preview</h1>
            <motion.div
              className="text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {messages[messages.length - 1].display}
            </motion.div>
          </div>
        )
      }

      {aiState.questions.length == 0 && !generatingQuiz && (
        <Button
          type="submit"
          disabled={
            isLoading ||
            isSubmitting ||
            !isValidSubmission() ||
            currentTokens.value > selectedModel.context_length ||
            isUploadingS.value
          }
          className="w-full py-5 mt-6 mb-4 shadow-none bg-zinc-800 text-white disabled:text-slate-100 disabled:bg-zinc-900 hover:bg-mainblue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-100"
        >
          {isSubmitting ? (
            <>
              <IconSpinner className="animate-spin size-4 mr-2" /> Building
              quiz...
            </>
          ) : (
            'Generate Preview'
          )}
        </Button>
      )}
      {aiState.questions.length > 0 && (
        <div className="flex flex-row space-x-3 mt-6">
          <Button
            onClick={discardQuiz}
            className="w-full py-5 shadow-none bg-zinc-800 text-white disabled:text-slate-100 disabled:bg-zinc-900 hover:bg-mainblue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-100"
          >
            Discard
          </Button>
          <Button
            onClick={e => {
              e.preventDefault()

              handleContinuePublish()
            }}
            disabled={
              isLoading ||
              isSubmitting ||
              !isValidSubmission() || // Ensures Zod schema validation is respected
              currentTokens.value > tokenLimit.value ||
              isUploadingS.value
            }
            className="w-full py-5 mb-10 shadow-none bg-mainblue text-white disabled:text-gray-300 disabled:bg-mainblue/20 hover:bg-mainblue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-100"
          >
            {isSubmitting ? (
              <>
                <IconSpinner className="animate-spin size-4 mr-2" />{' '}
                Redirecting...
              </>
            ) : (
              <>
                <Image
                  src="/canvas.svg"
                  width={24}
                  height={24}
                  alt=""
                  className="mr-2"
                />
                Edit and Publish to Canvas
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  )
}
