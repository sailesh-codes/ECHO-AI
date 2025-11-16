'use client'

import { useState, useRef, useEffect } from 'react'
import { generateAIResponse } from './actions'
import Sidebar from '@/components/sidebar'
import ChatWindow from '@/components/chat-window'
import InfoModal from '@/components/info-modal'
import ConfirmModal from '@/components/confirm-modal'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot_messages')
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (e) {
        console.error('Failed to load messages:', e)
      }
    }
    
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    abortControllerRef.current = new AbortController()

    try {
      const assistantContent = await generateAIResponse(content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error:', error.message)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleClearChat = () => {
    setShowConfirmModal(true)
  }

  const confirmClearChat = () => {
    setMessages([])
    setShowConfirmModal(false)
    localStorage.setItem('chatbot_messages', '[]')
  }

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      <Sidebar
        onInfo={() => setShowInfoModal(true)}
        onDeleteChat={handleClearChat}
        messageCount={messages.length}
      />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        {isInitialized && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onStopResponse={handleStopResponse}
            onCopyMessage={handleCopyMessage}
          />
        )}
      </main>

      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)}
      />
      
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Clear Chat History"
        message="Are you sure you want to delete all messages? This action cannot be undone."
        onConfirm={confirmClearChat}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
