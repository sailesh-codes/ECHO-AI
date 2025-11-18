'use client'

import { useState } from 'react'
import { Menu, X, Sparkles, User, Trash2, ExternalLink, Shuffle } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClearHistory: () => void
  isLoading?: boolean
}

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  onClearHistory, 
  isLoading = false
}: SidebarProps) {
  const handleClearChat = () => {
    onClearHistory()
  }

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Echo</h1>
              <p className="text-cyan-400 text-sm">AI Assistant</p>
            </div>
          </div>

          {/* User Profile */}
          <button className="w-full text-left hover:bg-cyan-500/10 p-3 rounded-xl transition-colors flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Guest User</div>
              <div className="text-xs text-cyan-400">Free Plan</div>
            </div>
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 space-y-4">
          {/* Random Model Indicator */}
          <div className="space-y-2">
            <div className="text-xs text-cyan-400 font-medium uppercase tracking-wider">AI Model</div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/60">
              <Shuffle className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-300 text-sm">Random Model</span>
            </div>
            <p className="text-xs text-gray-400">Model automatically changes for each message</p>
          </div>

          {/* Navigation Buttons */}
          <nav className="space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 font-medium transition-colors hover:bg-cyan-500/30">
              New Chat
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 transition-colors hover:text-cyan-300">
              Recent Chats
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-500/10 text-gray-400 transition-colors hover:text-cyan-300">
              Settings
            </button>
          </nav>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-100/10 rounded-lg transition-colors"
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
    </>
  )
}
