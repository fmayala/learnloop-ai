import { Message, OpenAIStream, StreamingTextResponse, experimental_StreamingReactResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const {
    messages,
  } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true
  })

  console.log(res);

  // ADD TOKENIZER FOR DETERMINING TOTAL TOKENS FOR INPUT/OUTPUT TO KEEP TRACK OF SPEND, update database.

  //console.log(res);

  const stream = OpenAIStream(res)

  return new StreamingTextResponse(stream)
}
