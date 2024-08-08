import { S3Client } from '@aws-sdk/client-s3'
import { TextractClient } from '@aws-sdk/client-textract'
import OpenAI from 'openai'
import { createAI} from 'ai/rsc'
import { createQuiz } from './actions/quizzes/actions'

const awsConfig = {
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// export const openai_router = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
// })
export const openai_router = new OpenAI({
  baseURL: "http://localhost:1234/v1/",
})
// bartowski/Codestral-22B-v0.1-GGUF
export const textractClient = new TextractClient(awsConfig)
export const s3Client = new S3Client(awsConfig)
export const s3BucketName = 'learnloop-new'

type MessageAI = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type UIRender = {
  id: number
  error: string
  display: React.ReactNode
}

// Define initial states
const initialAIState = {
  messages: [] as MessageAI[], // Holds the conversation history,
  questions: [] as any[], // Holds quiz questions
  userData: {}, // Can store user-related data, e.g., scores, selections
}

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: UIRender[] = []

export const AI = createAI({
  actions: {
    createQuiz
  },
  initialUIState,
  initialAIState
})