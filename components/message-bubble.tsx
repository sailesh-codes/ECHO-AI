'use client'

import { Message } from '@/app/page'

interface MessageBubbleProps {
  message: Message
  onCopy: (content: string) => void
}

export default function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl transition-all duration-200 ${
          isUser
            ? 'text-white'
            : 'text-white'
        }`}
      >
        <p className="text-sm md:text-base break-words whitespace-pre-wrap leading-relaxed font-medium">{message.content}</p>
        
        <div className="flex items-center justify-between mt-3 gap-3">
          <span className="text-xs opacity-40 font-medium">
            {formatTime(message.timestamp)}
          </span>
          
          {!isUser && (
            <button
              onClick={() => onCopy(message.content)}
              className="text-xs opacity-40 hover:opacity-100 transition-all duration-200 cursor-pointer hover:text-cyan-300 active:text-cyan-200 font-medium"
              title="Copy message"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
