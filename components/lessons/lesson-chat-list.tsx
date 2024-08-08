import { type Message } from 'ai'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat/chat-message'

export interface LessonChatList {
  messages: Message[]
}

export function LessonChatList({ messages }: LessonChatList) {
    // Check if there are messages and slice the array to get the last two messages
    const recentMessages = messages.length ? messages.slice(-2) : [];
  
    if (!recentMessages.length) {
      return null;
    }
  
    return (
      <div className="pl-2 mt-10">
        {recentMessages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
            {index < recentMessages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
          </div>
        ))}
      </div>
    );
  }
  
