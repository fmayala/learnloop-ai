import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import {
  encode,
} from 'gpt-tokenizer'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { logInteraction } from '@/app/actions/tracking/actions'
import { useMediaQuery } from 'react-responsive';
import { theme } from '../tailwind.config'; // Your tailwind config


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tokenizeContent = async (content: string) => {
  // Assuming cl100k_base is the tokenizer you want to use
  const encodedTokens = encode(content)
  return encodedTokens
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export const prisma = new PrismaClient().$extends(withAccelerate())


export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}


// const pdf = require('pdf-parse');

// // Function to read a PDF file and extract text
// export function readPDFasText(fileBuffer) {
//   return pdf(fileBuffer).then(function(data) {
//     // data.numpages - number of pages
//     // data.numrender - number of rendered pages
//     // data.info - PDF info
//     // data.metadata - PDF metadata
//     // data.version - PDF version
//     // data.text - extracted text from PDF
//     return data.text;
//   });
// }