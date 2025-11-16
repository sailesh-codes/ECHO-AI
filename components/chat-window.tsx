'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/app/page'
import MessageBubble from './message-bubble'

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      await onSendMessage(input)
      setInput('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="w-full max-w-3xl h-full md:h-[600px] bg-black/90 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden shadow-2xl 
    transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-black/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-cyan-500/30">
            AI
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">Assistant</h1>
            <p className="text-xs text-zinc-500">Powered by Gemini</p>
          </div>
        </div>
        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 animate-pulse shadow-cyan-500/50"></div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-4 bg-black/80">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-zinc-400 text-sm">Start a conversation</p>
              <p className="text-zinc-500 text-xs">Ask me anything, I'm here to help!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={onCopyMessage}
            />
          ))
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/80">
        <div className="flex gap-3 items-end max-w-2xl mx-auto">
          <div className="flex-1 flex items-center gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 bg-zinc-900 text-white placeholder-zinc-500/70 resize-none focus:outline-none min-h-10 max-h-24 text-sm rounded-2xl p-3 leading-relaxed border border-zinc-700"
              disabled={isLoading}
            />
          </div>
          {isLoading ? (
            <button
              onClick={onStopResponse}
              className="p-3 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 text-white rounded-2xl transition-all duration-200 font-medium text-sm flex items-center justify-center shadow-red-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed text-black rounded-2xl transition-all duration-200 font-semibold flex items-center justify-center shadow-cyan-500/40 hover:shadow-cyan-400/60 disabled:shadow-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
