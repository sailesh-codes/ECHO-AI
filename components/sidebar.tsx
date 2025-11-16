'use client'

import { useState } from 'react'

interface SidebarProps {
  onInfo: () => void
  onDeleteChat: () => void
  messageCount: number
}

export default function Sidebar({ onInfo, onDeleteChat, messageCount }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-lg hover:bg-cyan-500/30 transition-all"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 z-30 h-screen w-64 bg-zinc-950 border-r border-cyan-500/20 p-6 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-1">ChatBot</h2>
          <p className="text-xs text-zinc-500">Powered by Gemini API</p>
        </div>

        {/* Stats */}
        <div className="mb-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-zinc-400 mb-1">Messages</p>
          <p className="text-2xl font-bold text-cyan-400">{messageCount}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 flex-1">
          <button
            onClick={onInfo}
            className="w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 text-cyan-400 rounded-lg transition-all font-semibold flex items-center gap-3 group"
            aria-label="Show information"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Info</span>
          </button>

          <button
            onClick={onDeleteChat}
            className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-400/60 text-red-400 rounded-lg transition-all font-semibold flex items-center gap-3 group"
            aria-label="Delete chat history"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Chat</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-cyan-500/20 text-xs text-zinc-500">
          <p>Built with React & Tailwind</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  )
}
