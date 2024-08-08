'use client'

import { useChat, type Message } from 'ai/react'
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import { CanvyPanel } from './canvy-panel'
import { Controls } from './types/types'
import useVoiceVisualizerWithSTT from '@/lib/hooks/useAudioWebSocket'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface CanvyProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Canvy({ id, initialMessages, className }: CanvyProps) {
  const router = useRouter()
  const path = usePathname()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const controls: Controls = useVoiceVisualizerWithSTT()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      onFinish() {
        //
        // if (!path.includes('chat')) {
        //   router.push(`/chat/${id}`, { shallow: true, scroll: false })
        //   router.refresh()
        // }

        // Check if theres not a chat id in the path, if not, push the chat id to the url
        if (!path.includes(`chat/${id}`)) {
          // @ts-ignore
          router.push(`/chat/${id}`, { shallow: true, scroll: false })
          router.refresh()
          //{ shallow: true, scroll: false }
        }
      }
    })

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {controls.messages.length ? (
          <>
            <ChatList messages={controls.messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <CanvyPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        controls={controls}
      />
    </>
  )
}

