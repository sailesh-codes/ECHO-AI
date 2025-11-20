'use client'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-zinc-900/95 border border-cyan-500/30 rounded-2xl w-full max-w-xs sm:max-w-sm shadow-xl shadow-cyan-500/10 overflow-hidden">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-cyan-500/20">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-400">{title}</h2>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6 text-sm sm:text-base text-zinc-300">
          {message}
        </div>

        <div className="px-5 py-4 sm:px-6 sm:py-5 border-t border-cyan-500/20 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 border border-cyan-500/20 hover:border-cyan-400/60 text-zinc-300 rounded-lg transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

