import * as React from 'react'
import { type UseChatHelpers } from 'ai/react'

import { shareChat } from '@/app/actions/chat/actions-chat'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import {
  IconRefresh,
  IconShare,
  IconSpinner,
  IconStop
} from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat/chat-share-dialog'
import { useBreakpoint } from '@/lib/hooks/useBreakpoint'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
  title?: string,
  record?: (res: string) => Promise<void>,
  context?: string | null,
  sidebarWidth: number
}

export function LessonChatPanel({
  id,
  title,
  isLoading,
  stop,
  append,
  context,
  reload,
  record,
  input,
  setInput,
  messages,
  sidebarWidth
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const { isAboveLg } = useBreakpoint("lg");

  return (
    <div
      className="fixed inset-x-0 bottom-10 animate-in duration-300 ease-in-out dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]"
      style={isAboveLg ? { marginRight: `${sidebarWidth}px` } : {}} // Adding extra margin to match Tailwind spacing
    >
      <ButtonScrollToBottom />
      <div className="sm:px-4">
        <div className="flex items-center justify-center h-12">
          {isLoading ? (
            // render a circular loading spinner
            <IconSpinner className="mr-2 animate-spin" />
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                {/* <Button variant="outline" onClick={() => reload()}>
                  <IconRefresh className="mr-2" />
                  Regenerate response
                </Button> */}
                {/* {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <IconShare className="mr-2" />
                      Share
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat}
                      chat={{
                        id,
                        title,
                        messages
                      }}
                    />
                  </>
                ) : null} */}
              </div>
            )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 shadow-sm bg-background sm:rounded-sm md:py-4">
          <PromptForm
            onSubmit={async value => {
              if (record) {
                await record(value)
              }
              // Include context in the message
              if (context) {
                value = `${context}\n${value}`
              }
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          {/* <Button variant="outline" onClick={() => reload()}>
            <IconRefresh className="mr-2" />
            Regenerate response
          </Button> */}
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  )
}
