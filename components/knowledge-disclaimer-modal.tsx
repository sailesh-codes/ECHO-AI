'use client'

interface KnowledgeDisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function KnowledgeDisclaimerModal({ isOpen, onClose, onAccept }: KnowledgeDisclaimerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-start sm:items-center justify-center z-50 p-4 sm:p-6">
      <div className="relative w-full max-w-lg sm:max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-black/90 to-cyan-950/40 shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden max-h-[90vh]">
        <div className="absolute inset-x-0 -top-24 mx-auto h-72 w-72 bg-cyan-500/30 blur-[120px] opacity-50 pointer-events-none" />

        <div className="relative p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Important Notice</p>
              <h2 className="text-3xl font-semibold text-white">Knowledge Limitation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/30 p-5">
              <p className="text-sm font-semibold text-yellow-300 mb-2">⚠️ Knowledge Cutoff</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                This AI model has limited knowledge and may not have information about events, developments, or data after its training cutoff. For the most current information, please verify with up-to-date sources.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-zinc-200">
              <p>📅 <strong>What this means:</strong></p>
              <ul className="ml-6 space-y-2 list-disc text-zinc-300">
                <li>May not know about recent events (2025-2026)</li>
                <li>Cannot provide real-time information</li>
                <li>Historical data may be outdated</li>
                <li>Always verify important information</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm font-semibold text-cyan-300 mb-2">💡 Recommendation</p>
              <p className="text-sm text-zinc-200">
                For current events, latest news, or time-sensitive information, please check reliable news sources, official websites, or current databases.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
