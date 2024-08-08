'use server'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { encode, isWithinTokenLimit } from 'gpt-tokenizer';
import { prisma } from '@/lib/utils';
import { auth, db } from '@/auth';

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const {
    messages,
    previewToken,
    copy
  } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (previewToken) {
    openai.apiKey = previewToken
  }

  const inputText = messages.map((msg: any) => msg.content).join(' '); // Combine for tokenization
  const inputTokens = encode(inputText).length;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.7,
    stream: true
  })

  // ADD TOKENIZER FOR DETERMINING TOTAL TOKENS FOR INPUT/OUTPUT TO KEEP TRACK OF SPEND, update database.

  //console.log(res);

  const stream = OpenAIStream(res, {
    async onFinal(completion) {
      //console.log('Final completion:', completion)

      const outputTokens = encode(completion).length;

      // Cost Constants (in USD) GPT-3.5 Turbo
      const INPUT_TOKEN_COST = 0.5 / 1000000;   // $0.50 per 1M input tokens
      const OUTPUT_TOKEN_COST = 1.5 / 1000000;  // $1.50 per 1M output tokens


      // update using kysely
      await db.updateTable('User').set({
        input_token_usage: inputTokens,
        output_token_usage: outputTokens,
        net_spend: (inputTokens * INPUT_TOKEN_COST) + (outputTokens * OUTPUT_TOKEN_COST)
      }).where('id', '=', userId).executeTakeFirstOrThrow()
    }
  })

  return new StreamingTextResponse(stream)
}
