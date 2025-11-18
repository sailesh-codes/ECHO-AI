'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [userEmail, setUserEmail] = useState<string>('')
  const [remainingPrompts, setRemainingPrompts] = useState<number>(5)
  const abortControllerRef = useRef<AbortController | null>(null)

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
    // Extract user email from auth token
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
    if (token) {
      try {
        const decoded = Buffer.from(token.split('=')[1], 'base64').toString('utf-8')
        const email = decoded.split(':')[0]
        setUserEmail(email)
        setRemainingPrompts(5) // Default to 5 prompts
        
        // Try to get user data
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user?.remainingPrompts !== undefined) {
              setRemainingPrompts(data.user.remainingPrompts)
            }
          })
          .catch(err => console.error('Failed to fetch user data:', err))
      } catch (error) {
        console.error('Token decode error:', error)
      }
    }

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
    if (!userEmail) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to send messages',
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
      
      let assistantContent: string
      
      if (provider === 'gemini') {
        assistantContent = await generateAIResponse(content, userEmail)
      } else if (provider === 'mistral') {
        assistantContent = await generateMistralResponse(content, userEmail)
      } else {
        throw new Error('Unknown provider')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Refresh prompt count
      if (userEmail) {
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user?.remainingPrompts !== undefined) {
              setRemainingPrompts(data.user.remainingPrompts)
            }
          })
          .catch(err => console.error('Failed to refresh prompt count:', err))
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
        userEmail={userEmail}
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
