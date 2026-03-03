'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateAIResponse, generateMistralResponse } from './actions'
import Sidebar from '@/components/sidebar'
import ChatWindow from '@/components/chat-window'
import InfoModal from '@/components/info-modal'
import ConfirmModal from '@/components/confirm-modal'
import KnowledgeDisclaimerModal from '@/components/knowledge-disclaimer-modal'
import ModelSelector from '@/components/model-selector'
import InteractiveBackground from '@/components/InteractiveBackground'
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
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showClearChatModal, setShowClearChatModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showKnowledgeDisclaimer, setShowKnowledgeDisclaimer] = useState(false)
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [remainingTokens, setRemainingTokens] = useState<number>(0)
  const [tokensUsed, setTokensUsed] = useState<number>(0)
  const [tokenLimit, setTokenLimit] = useState<number>(5)
  const [tier, setTier] = useState<string>('free')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()

  // Use the most reliable model for consistent responses
  const getModel = () => {
    return { provider: 'openai', model: 'openai/gpt-4o-mini' }
  }

  useEffect(() => {
    // Check authentication status via API
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status')
        const data = await response.json()
        
        if (data.success && data.isLoggedIn && data.sessionId) {
          setSessionId(data.sessionId)
          setRemainingTokens(data.remainingMessages || 5)
          setTokensUsed(5 - (data.remainingMessages || 5))
          setTokenLimit(5)
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

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('hasAcceptedKnowledgeDisclaimer') === 'true'
    setHasAcceptedDisclaimer(hasAccepted)
  }, [])

  const handleSendMessage = async (content: string) => {
    console.log('handleSendMessage called')
    
    // Show knowledge disclaimer if not accepted yet
    if (!hasAcceptedDisclaimer) {
      setShowKnowledgeDisclaimer(true)
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
      // Get the reliable model
      const { provider, model } = getModel()
      console.log(`Using provider: ${provider}, model: ${model}`)
      
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

      console.log('Chat API Response:', data)

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
      
      // Update token state from API response
      if (data.remainingMessages !== undefined) {
        console.log('Updating state - remainingMessages:', data.remainingMessages, 'tokensUsed:', 5 - data.remainingMessages)
        setRemainingTokens(data.remainingMessages)
        setTokensUsed(5 - data.remainingMessages)
      }
    } catch (error: any) {
      console.error('Error generating response:', error)
      
      // Handle message limit gracefully
      if (error.message === 'Message limit reached (5 messages)') {
        const limitMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'You have reached your 5 message limit. Please start a new session to continue.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, limitMessage])
        
        // Update state to reflect limit reached
        setRemainingTokens(0)
        setTokensUsed(5)
        
        toast({
          title: '5 Messages Completed',
          description: 'You have used all your free messages. Start a new session to continue.',
          variant: 'default'
        })
      } else {
        // Handle other errors normally
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
      }
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

  const handleAcceptDisclaimer = () => {
    setHasAcceptedDisclaimer(true)
    setShowKnowledgeDisclaimer(false)
    localStorage.setItem('hasAcceptedKnowledgeDisclaimer', 'true')
  }

  const handleDeclineDisclaimer = () => {
    setShowKnowledgeDisclaimer(false)
    toast({
      title: 'Disclaimer Required',
      description: 'You must accept the knowledge limitation disclaimer to use the chat.',
      variant: 'destructive'
    })
  }

  const handleClearChat = () => {
    setShowClearChatModal(true)
  }

  const confirmClearChat = () => {
    setMessages([])
    localStorage.setItem('chatbot_messages', '[]')
    setShowClearChatModal(false)
    toast({
      title: 'Chat history cleared',
      description: 'All messages have been removed.',
      variant: 'destructive'
    })
  }

  const handleConfirmLogout = () => {
    handleLogout()
    setShowConfirmModal(false)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-transparent">
      {/* Background Container */}
      <div className="fixed inset-0 -z-10">
        <InteractiveBackground />
      </div>
      
      <div className="flex h-full">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          onClearHistory={handleClearChat}
          onLogout={handleLogout}
          isLoading={isLoading}
          sessionId={sessionId}
          remainingMessages={remainingTokens}
          messagesUsed={tokensUsed}
          messageLimit={tokenLimit}
        />
        
        <main className={`flex-1 flex flex-col items-start justify-center h-full overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} pl-4`}>
          <div className="w-full max-w-4xl h-full flex flex-col justify-center">
            {isInitialized && (
              <ChatWindow 
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onStopResponse={handleStopResponse}
                onCopyMessage={handleCopyMessage}
              />
            )}
          </div>
        </main>

        <InfoModal 
          isOpen={showInfoModal} 
          onClose={() => setShowInfoModal(false)} 
        />
        
        <KnowledgeDisclaimerModal
          isOpen={showKnowledgeDisclaimer}
          onClose={handleDeclineDisclaimer}
          onAccept={handleAcceptDisclaimer}
        />
        
        <ConfirmModal
          isOpen={showConfirmModal}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleLogout}
          title="Logout"
          message="Are you sure you want to logout?"
        />
        
        <ConfirmModal
          isOpen={showClearChatModal}
          onCancel={() => setShowClearChatModal(false)}
          onConfirm={confirmClearChat}
          title="Clear Chat History"
          message="Are you sure you want to clear all chat history? This action cannot be undone."
        />
        
        {remainingTokens <= 1 && (
          <div className="fixed bottom-4 right-4 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 text-cyan-100 px-4 py-2 rounded-lg text-sm shadow-lg z-50">
            Remaining messages: {remainingTokens}
          </div>
        )}
      </div>
    </div>
  )
}
