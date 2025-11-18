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
    // Debug: Show all cookies
    console.log('All cookies:', document.cookie)
    
    // Extract user email from auth token
    const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
    console.log('Token found:', !!token)
    
    if (token) {
      try {
        const tokenValue = token.split('=')[1]
        console.log('Token value:', tokenValue)
        const decoded = Buffer.from(tokenValue, 'base64').toString('utf-8')
        console.log('Decoded token:', decoded)
        const email = decoded.split(':')[0]
        console.log('Extracted email:', email)
        
        if (email) {
          setUserEmail(email)
          setRemainingPrompts(5) // Default to 5 prompts
        }
        
        // Try to get user data from the user endpoint
        fetch('/api/auth/user', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(data => {
            console.log('User data response:', data)
            if (data.success && data.user?.remainingPrompts !== undefined) {
              setRemainingPrompts(data.user.remainingPrompts)
            }
          })
          .catch(err => {
            console.error('Failed to fetch user data:', err)
            // Try the login endpoint as fallback
            return fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            })
          })
          .then(res => res?.json())
          .then(data => {
            console.log('Login fallback response:', data)
            if (data?.success && data.user?.remainingPrompts !== undefined) {
              setRemainingPrompts(data.user.remainingPrompts)
            }
          })
          .catch(err => console.error('Failed to fetch user data:', err))
      } catch (error) {
        console.error('Token decode error:', error)
      }
    } else {
      console.log('No auth token found in cookies')
      // Redirect to login page if no token found
      window.location.href = '/auth'
    }

    const savedMessages = localStorage.getItem('chatbot_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Failed to load saved messages:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async (content: string) => {
    console.log('handleSendMessage called, userEmail:', userEmail)
    
    // Fallback: try to get email directly from token if state is empty
    let emailToUse = userEmail
    if (!emailToUse) {
      console.log('userEmail is empty, trying to get from token')
      const token = document.cookie.split('; ').find(row => row.startsWith('auth-token='))
      if (token) {
        try {
          const decoded = Buffer.from(token.split('=')[1], 'base64').toString('utf-8')
          emailToUse = decoded.split(':')[0]
          console.log('Fallback email extracted:', emailToUse)
          // Set it in state for future use
          setUserEmail(emailToUse)
        } catch (error) {
          console.error('Fallback token decode error:', error)
        }
      }
    }
    
    if (!emailToUse) {
      console.log('No email found, showing error toast')
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
        assistantContent = await generateAIResponse(content, emailToUse)
      } else if (provider === 'mistral') {
        assistantContent = await generateMistralResponse(content, emailToUse)
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
      if (emailToUse) {
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToUse })
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
