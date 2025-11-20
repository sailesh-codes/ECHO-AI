'use client'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-start sm:items-center justify-center z-50 p-4 sm:p-6">
      <div className="relative w-full max-w-lg sm:max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-black/90 to-cyan-950/40 shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden max-h-[90vh]">
        <div className="absolute inset-x-0 -top-24 mx-auto h-72 w-72 bg-cyan-500/30 blur-[120px] opacity-50 pointer-events-none" />

        <div className="relative p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Echo brief</p>
              <h2 className="text-3xl font-semibold text-white">About This Bot</h2>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
              <p className="text-sm text-cyan-300 font-semibold">Welcome!</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                Echo pairs contextual reasoning with elegant UI to keep your conversations flowing. It blends Google Gemini & Mistral intelligence for fast, grounded responses.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
              <p className="text-sm text-cyan-300 font-semibold">Highlights</p>
              <ul className="text-sm text-zinc-200 space-y-1.5">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Real-time conversation memory</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Message copy & stop controls</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Local data persistence</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Mobile-responsive canvas</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-cyan-300">Usage Tips</p>
              <span className="text-xs text-cyan-200/70">Stay in flow</span>
            </div>
            <div className="grid gap-3 text-sm text-zinc-200 md:grid-cols-2">
              <p>↵ Enter to send, Shift+Enter for breaks.</p>
              <p>📋 Tap “Copy” on any assistant response.</p>
              <p>🧹 “Delete Chat” wipes local history instantly.</p>
              <p>🔒 API keys live only in your browser storage.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-cyan-300">API & Privacy</p>
              <p className="text-sm text-zinc-200">
                Echo routes prompts through Google Gemini with optional Mistral fallbacks. Traffic is encrypted and your credentials never leave local storage.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-cyan-500 text-black font-semibold shadow-[0_10px_30px_rgba(6,182,212,0.35)] hover:bg-cyan-400 transition-colors inline-flex items-center space-x-1"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
