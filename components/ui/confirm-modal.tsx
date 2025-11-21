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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-black/90 to-cyan-950/40 shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden">
        <div className="absolute inset-x-0 -top-24 mx-auto h-72 w-72 bg-cyan-500/30 blur-[120px] opacity-50 pointer-events-none" />

        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Confirm Action</p>
              <h2 className="text-2xl font-semibold text-white">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
            <p className="text-sm text-zinc-200 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              className="px-5 py-2.5 rounded-2xl bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-black font-semibold shadow-[0_10px_30px_rgba(6,182,212,0.35)] hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
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