import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export interface Lesson extends Record<string, any> {
  id: string
  name: string
  description: string
  userId: string
  path: string
}

// Type '{ id: string; name: string; description: string; userId: string; }[]' is not assignable to type '[]'.
//   Target allows only 0 element(s) but source may have more.ts(2322)

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Completed {
  moduleNumber: number
  moduleType: string
  responded: boolean
}

export type CompletedModules = Completed[]

export interface ModuleResponse {
  moduleType: string;
  moduleNumber: number;
  question?: string;
  correct?: boolean;
  responses: Response[];
}

export interface Response {
  message?: string;
  input?: string;
  response?: string;
  correct?: boolean;
}

// Define a type for the array of module responses
export type ModuleResponses = ModuleResponse[];

// Create a type for the integrations
export type AccountIntegration = {
  name: string,
  icon: string,
  description: string,
  link: string,
  isLinked: boolean,
}