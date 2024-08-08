import * as React from 'react'
import { useForm, Controller, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { Dropzone } from './dropzone'
import { Checkbox } from './ui/checkbox'
import { createLesson } from '@/app/actions/lessons/actions'
import { Progress } from './ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { CiCircleQuestion } from 'react-icons/ci'
import { usePathname, useRouter } from 'next/navigation'
import { signal } from '@preact/signals-react'
import DocumentList from './document-list'
import { Separator } from './ui/separator'
import { Document } from '@prisma/client'
import { IconSpinner } from './ui/icons'
import { toast } from 'react-hot-toast'
import { AIModel } from '@/app/actions/ai/types'
import { AIModels } from './ai/models'
// import type File from ''

const schema = z.object({
  context: z.string().min(1, 'Context is required.'),
  files: z.array(z.instanceof(File)),
  modules: z.object({
    fitb: z.boolean(),
    multipleChoice: z.boolean(),
    shortAnswer: z.boolean(),
    trueFalse: z.boolean(),
    article: z.boolean(),
    image: z.boolean(),
    video: z.boolean(),
    audio: z.boolean().default(false).readonly()
  })
})

const moduleDisplayNames = {
  fitb: 'Fill in the Blanks',
  multipleChoice: 'Multiple Choice',
  shortAnswer: 'Short Answer',
  trueFalse: 'True/False',
  article: 'Article',
  image: 'Image',
  video: 'Video',
  audio: 'Audio'
}

export interface MaterialSubmissionProps {
  isLoading: boolean
}

interface ModuleTypes {
  [key: string]: boolean;
}

// Define an interface for the form values
interface FormValues {
  context: string;
  files: File[];
  selectedDocuments: Document[]; // Ensure this matches the type expected for documents
  modules: ModuleTypes;
  totalContextSize: number;
}


const tokenLimit = signal(100000)
const currentTokens = signal(0)
const progress = signal(0)
const isUploadingS = signal(false)

export const MaterialSubmissionForm: React.FC<MaterialSubmissionProps> = ({
  isLoading
}) => {
  const path = usePathname()
  const router = useRouter()
  const { control, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      context: '',
      files: [],
      selectedDocuments: [],
      modules: {
        fitb: true,
        multipleChoice: true,
        shortAnswer: true,
        trueFalse: true,
        article: true,
        image: true,
        video: true,
        audio: false
      },
      totalContextSize: 0
    }
  });

  const { isSubmitting } = useFormState({ control })
  const currentSelectedDocuments = watch('selectedDocuments')
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

  React.useEffect(() => {
    console.log('currentSelectedDocuments:', currentSelectedDocuments)
  }, [currentSelectedDocuments])

  const handleSelectDocument = (document: Document) => {
    // Check if the document is already selected
    const isSelected = currentSelectedDocuments.some(d => d.id === document.id)

    if (isSelected) {
      // Update the progress
      currentTokens.value = currentTokens.value -= document.contextSize
      // Remove the document from the selection
      setValue(
        'selectedDocuments',
        currentSelectedDocuments.filter(d => d.id !== document.id)
      )
    } else {
      // Update the progress
      currentTokens.value = currentTokens.value += document.contextSize
      // Add the document to the selection
      setValue('selectedDocuments', [...currentSelectedDocuments, document])
    }

    progress.value = Math.floor((currentTokens.value / tokenLimit.value) * 100)
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

  const handleFormSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append('context', data.context)

    for (let i = 0; i < data.files.length; i++) {
      formData.append(`file${i}`, data.files[i])
    }

    // Append modules to formData
    formData.append('modules', JSON.stringify(data.modules))
    formData.append(
      'selectedDocuments',
      JSON.stringify(currentSelectedDocuments)
    )
    formData.append('model', selectedModel?.id || 'openai/gpt-4o'); // Add model ID to form data

    // Here you can submit the formData to your backend
    let res = await createLesson(formData)

    // redirect to the lesson page
    if (res) {
      // redirect to the lesson page
      if (!path.includes(`lessons/${res.id}`) && res.error === undefined) {
        // @ts-ignore
        router.push(`/lessons/${res.id}`, { shallow: true, scroll: false })
        router.refresh()
      }
    }

    if (res?.error) {
      toast.error(res.error as string)
    }
  }

  const handleDocumentAdd = (document: Document) => {
    setValue('selectedDocuments', [...currentSelectedDocuments, document])
  }
  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col space-y-2 md:flex-row mb-6">
        <h1 className="font-bold text-2xl">Create a Lesson</h1>
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
                This tool allows you to create a lesson. You can add context and
                supporting materials in order to get an adaptive lesson. You can
                select the type of lesson modules for the user to interact with
                such as fill-in-the-blank or multiple choice.
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
        <label className="text-lg font-bold">Prompt (what do you want to teach?)</label>
        <Controller
          name="context"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Enter prompt here... (e.g. Teach me about the history of the United States.)"
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
          Lesson Materials (lesson documents -- .pdf, .docx, .doc, .pptx)
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
      <div className="space-y-6 mt-6">
        <label className="text-lg font-bold">Lesson Modules</label>
        {Object.entries(schema.shape.modules.shape).map(([moduleName, _]) => (
          <div key={moduleName} className="flex items-center space-x-2">
            <Controller
              name={`modules.${moduleName}` as const}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  disabled={moduleName === 'audio'}
                  defaultChecked={
                    moduleName !== 'audio' ? (field.value as boolean) : false
                  }
                  onCheckedChange={e => field.onChange(e)}
                  value={field.value ? 'true' : 'false'}
                />
              )}
            />
            <label
              htmlFor={moduleName}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {moduleDisplayNames[moduleName as keyof typeof moduleDisplayNames]}{' '}
              {moduleName === 'audio' && <span>unavailable for now.</span>}
            </label>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={
          isLoading ||
          isSubmitting ||
          !formState.isValid ||
          currentTokens > tokenLimit ||
          isUploadingS.value
        }
        className="w-full py-5 mb-10 mt-6 shadow-none bg-mainblue text-white disabled:text-gray-300 disabled:bg-mainblue/20 hover:bg-mainblue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-100"
      >
        {isSubmitting ? (
          <>
            <IconSpinner className="animate-spin size-4 mr-2" /> Building
            lesson...
          </>
        ) : (
          'Create'
        )}
      </Button>
    </form>
  )
}
