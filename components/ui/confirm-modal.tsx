'use client'

import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  cancelText: string
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isLoading = false
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/95 via-black/90 to-red-950/30 shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="absolute inset-x-0 -top-28 mx-auto h-64 w-64 bg-red-500/30 blur-[110px] opacity-50 pointer-events-none" />

        <div className="relative p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-red-300/70">Warning</p>
              <h2 className="text-3xl font-semibold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-zinc-200 leading-relaxed">{description}</p>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-red-300 mb-2">This action is permanent</p>
            <ul className="space-y-1">
              <li>• Chat history is erased locally.</li>
              <li>• You cannot undo this step.</li>
              <li>• A fresh session will start.</li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/8 text-white font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-[0_15px_40px_rgba(239,68,68,0.35)] hover:from-red-400 hover:to-pink-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
