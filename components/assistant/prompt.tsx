import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow } from '@/components/ui/icons'
import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import useAudioCapture from '@/lib/hooks/useAudioWebSocket'
import VoiceVisualizer from './visualizer'
import { Controls } from './types/types'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void
  isLoading: boolean,
  controls: Controls
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  controls
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative">
        <div className="voice-visualizer-container">
          <VoiceVisualizer controls={controls} rounded={10} height={50} />
        </div>
        <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background rounded-md border">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Send a message."
            spellCheck={false}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ''}
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
            <motion.div
              animate={{ scale: controls.isRecordingInProgress ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <Button
                type="button"
                size="icon"
                className="bg-transparent border hover:bg-background hover:border-background"
                onClick={
                  controls.isRecordingInProgress
                    ? controls.stopRecording
                    : controls.startRecording
                }
              >
                <Mic className="text-white dark:text-white " />
                <span className="sr-only">
                  {controls.isRecordingInProgress
                    ? 'Stop capturing'
                    : 'Start capturing'}
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </form>
  )
}
