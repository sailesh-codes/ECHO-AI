'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/app/page'
import MessageBubble from './message-bubble'
import InteractiveBackground from './InteractiveBackground'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => Promise<void>
  onStopResponse: () => void
  onCopyMessage: (content: string) => void
}

export default function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onStopResponse,
  onCopyMessage
}: ChatWindowProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      await onSendMessage(input)
      setInput('')
      inputRef.current?.focus()
    }
  }


  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Messages Area */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-2xl mx-auto px-4 ml-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
              <div className="space-y-4 w-full max-w-2xl text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-white-500 text-sl">Start a conversation</p>
                <p className="text-white text-sm">Ask me anything, I'm here to help!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={onCopyMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-zinc-800/50 rounded-2xl rounded-tl-none border border-zinc-700/50">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl mx-auto px-4 py-4 ml-2">
        <div className="glow-input-wrapper">
          <div className="glow-input-inner flex gap-2 w-full items-center rounded-full shadow-xl px-2 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your prompt here..."
              className="flex-1 rounded-full px-6 py-3 bg-transparent text-white placeholder-zinc-300 resize-none focus:outline-none border-none shadow-none min-h-12 max-h-28 text-base"
              style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent'
              }}
              disabled={isLoading}
              rows={1}
            />
            {isLoading ? (
              <button
                onClick={onStopResponse}
                className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
