// Resolved types for the database columns
export type TimestampType = Date | string

export interface _PrismaMigrations {
  applied_steps_count: number
  checksum: string
  finished_at: TimestampType | null
  id: string
  logs: string | null
  migration_name: string
  rolled_back_at: TimestampType | null
  started_at: TimestampType
}

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null // Assuming Int maps to number
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
  createdAt: Date // Assuming DateTime maps to Date
  updatedAt: Date | null
}

export interface Authenticator {
  counter: number
  credentialBackedUp: boolean
  credentialDeviceType: string
  credentialID: string
  credentialPublicKey: string
  providerAccountId: string
  transports: string | null
  userId: string
}

export interface VerificationToken {
  expires: TimestampType
  identifier: string
  token: string
}

export interface Session {
  createdAt: TimestampType
  expires: TimestampType
  sessionToken: string
  updatedAt: TimestampType | null
  userId: string
}

export interface User {
  createdAt: Date
  email: string
  emailVerified: Date | null
  id: string
  image: string | null
  input_token_usage: number | null
  max_document_size: number | null
  max_documents: number | null
  max_lesson_creation: number | null
  max_lesson_sessions: number | null
  max_net_spend: number | null
  max_quiz_creation: number | null
  max_quiz_previews: number | null
  name: string | null
  net_spend: number | null
  output_token_usage: number | null
  published_quiz_usage: number | null
  quiz_usage: number | null
  updatedAt: Date | null
}

export interface Document {
  id: number
  name: string
  path: string
  type: string
  contextSize: number
  userId: string
}

export interface GeneratedModuleContent {
  id: number
  timestamp: Date
  moduleId: number
  content: string
  contentType: string
  contentOrder: number
  sessionId: string
}

export interface InteractionLog {
  id: number
  userId: string
  lessonId: string | null
  moduleId: number | null
  interactionType: string
  details: string | null
  timestamp: Date
  data: string | null
}

export interface Lesson {
  id: string
  name: string
  description: string
  userId: string
}

export interface LessonMessage {
  content: string
  createdAt: Date
  id: string
  isSystem: boolean
  lessonId: string
  moduleId: number
  role: string
  sessionId: string
}

export interface LessonModuleState {
  id: number
  userId: string
  lessonId: string
  sessionId: string
  moduleId: number
  completed: boolean
  lastAccessed: Date
}

export interface LessonSession {
  id: string
  lessonId: string
  userId: string
  startTime: Date
  endTime: Date | null
  completed: boolean
  elapsedTime: number | null
  currentModuleId: number | null
  lastChangeTime: Date | null
}

export interface Module {
  id: number
  lessonId: string
  moduleNumber: number
  moduleType: string
  topic: string
  description: string
  question: string | null
  options: string | null
  text_content: string | null
  isInteractive: boolean
  answer: string | null
  answers: string | null
}

export interface ModuleAttempt {
  id: number
  moduleId: number
  userId: string
  lessonSessionId: string
  attemptNumber: number
  success: boolean
  response: string | null
  timestamp: Date
}
