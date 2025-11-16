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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-cyan-500/30 rounded-lg max-w-sm w-full shadow-xl shadow-cyan-500/10">
        <div className="px-6 py-4 border-b border-cyan-500/20">
          <h2 className="text-lg font-bold text-cyan-400">{title}</h2>
        </div>

        <div className="px-6 py-6">
          <p className="text-zinc-300 text-sm">{message}</p>
        </div>

        <div className="px-6 py-4 border-t border-cyan-500/20 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-800 border border-cyan-500/20 hover:border-cyan-400/60 text-zinc-300 rounded transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-all font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
