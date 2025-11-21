'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X, User, Trash2, ExternalLink, Shuffle } from 'lucide-react'
import ConfirmModal from './ui/confirm-modal'
import InfoModal from './info-modal'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClearHistory: () => void
  isLoading: boolean
  sessionId: string | null
  onLogout: () => void
  remainingPrompts: number
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  onClearHistory, 
  isLoading = false,
  sessionId,
  onLogout,
  remainingPrompts = 5
}: SidebarProps) {
  const [showEndSessionModal, setShowEndSessionModal] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const handleClearChat = () => {
    onClearHistory()
  }

  const handleEndSession = async () => {
  setIsEndingSession(true);
  try {
    await onLogout();
    setShowEndSessionModal(false); // Close the modal after successful logout
  } catch (error) {
    console.error('Error ending session:', error);
  } finally {
    setIsEndingSession(false);
  }
};

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Toggle button for small screens */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="md:hidden fixed left-4 top-4 z-40 p-2 hover:bg-cyan-500/10 rounded-lg text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative h-full z-50 ${
          isOpen ? 'w-64' : 'w-0'
        } bg-black border-r border-cyan-500/30 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black">
              <Image 
                src="/logo.png" 
                alt="Echo logo" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Echo</h1>
              <p className="text-cyan-400 text-sm">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 space-y-4 overflow-y-auto">
          
          {/* Session Profile */}
        {sessionId && (
          <div className="space-y-4">
            <div className="text-xs text-cyan-400 font-medium uppercase tracking-wider">Session</div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">Active Session</div>
                  <div className="text-xs text-cyan-400">Free Plan</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Prompts Remaining</span>
                  <span className="text-sm font-bold text-cyan-300">{isNaN(remainingPrompts) ? 5 : remainingPrompts}/5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((isNaN(remainingPrompts) ? 5 : remainingPrompts) / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowEndSessionModal(true)}
              className="w-full px-4 py-2 rounded-lg bg-red-800 text-white shadow-md transition-transform transition-colors duration-200 hover:bg-red-700 hover:-translate-y-0.5 text-sm font-semibold"
            >
              End Session
            </button>
          </div>
        )}

          
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-full px-4 py-2 text-sm font-semibold text-black rounded-lg bg-cyan-500 shadow-md transition-transform transition-colors duration-200 hover:bg-cyan-400 hover:-translate-y-0.5"
          >
            About
          </button>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30 space-y-3">
          <a 
            href="https://www.codecraftnet.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            Powered by <span className="text-cyan-400 font-medium">Code Craft</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          
          {/* Clear Chat Button */}
          <button 
            onClick={handleClearChat}
            disabled={isLoading}
            className="w-full px-4 py-2 text-sm font-semibold text-white rounded-lg bg-red-800 shadow-md transition-transform transition-colors duration-200 hover:bg-red-700 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        </div>

        {/* Close button for mobile */}
        <button
          onClick={onToggle}
          className="md:hidden absolute top-4 right-4 p-1 hover:bg-cyan-500/10 rounded-lg text-gray-400 transition-colors hover:text-cyan-300"
        >
          <X className="w-5 h-5" />
        </button>
      </aside>

      {/* End Session Confirmation Modal */}
      <ConfirmModal
        isOpen={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        onConfirm={handleEndSession}
        title="End Session"
        description="Are you sure you want to end your current session? This will clear your chat history and you'll need to start a new session to continue chatting."
        confirmText="End Session"
        cancelText="Cancel"
        isLoading={isEndingSession}
      />

      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </>
  )
}
