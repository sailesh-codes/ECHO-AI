'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateAIResponse, generateMistralResponse } from './actions'
import Sidebar from '@/components/sidebar'
import ChatWindow from '@/components/chat-window'
import InfoModal from '@/components/info-modal'
import ConfirmModal from '@/components/confirm-modal'
import ModelSelector from '@/components/model-selector'
import { toast } from '@/hooks/use-toast'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [remainingPrompts, setRemainingPrompts] = useState<number>(5)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  // Available models and providers for random selection
  const availableModels = [
    { provider: 'gemini', model: 'gemini-2.0-flash' },
    { provider: 'mistral', model: 'mistral-small' }
  ]

  // Function to get random model and provider
  const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * availableModels.length)
    return availableModels[randomIndex]
  }

  useEffect(() => {
    // Check authentication status via API
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        
        if (data.success && data.isLoggedIn && data.sessionId) {
          setSessionId(data.sessionId)
          setRemainingPrompts(data.remainingPrompts)
        } else {
          router.replace('/auth')
          return
        }
      } catch (error) {
        console.error('Failed to check auth status:', error)
        router.replace('/auth')
        return
      }
    }

    checkAuthStatus()

    const savedMessages = localStorage.getItem('chatbot_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Failed to load saved messages:', error)
      }
    }
    setIsInitialized(true)
  }, [router])

  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async (content: string) => {
    console.log('handleSendMessage called')
    
    // Check if user has reached the limit
    if (remainingPrompts <= 0) {
      toast({
        title: 'Chat Limit Reached',
        description: 'You have used all 5 free prompts',
        variant: 'destructive'
      })
      return
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)
    abortControllerRef.current = null
    
    try {
      // Get random model and provider for each request
      const { provider, model } = getRandomModel()
      console.log(`Using random provider: ${provider}, model: ${model}`)
      
      // Call the new chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          provider 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update remaining prompts from API response
      if (data.remainingPrompts !== undefined) {
        setRemainingPrompts(data.remainingPrompts)
      }
    } catch (error: any) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate response',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleLogout = async () => {
    try {
      // Clear cookies by setting them to expire
      document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'promptCount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      // Call logout API to clear any server-side cookies
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/auth'
    } catch (error) {
      console.error('Logout error:', error)
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
    toast({
      title: 'Message copied',
      description: 'The message has been copied to your clipboard.',
    })
  }

  const handleClearChat = () => {
    setShowConfirmModal(true)
  }

  const confirmClearChat = () => {
    setMessages([])
    localStorage.setItem('chatbot_messages', '[]')
    setShowConfirmModal(false)
    toast({
      title: 'Chat history cleared',
      description: 'All messages have been removed.',
      variant: 'destructive'
    })
  }

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClearHistory={handleClearChat}
        isLoading={isLoading}
        sessionId={sessionId}
        onLogout={handleLogout}
        remainingPrompts={remainingPrompts}
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
