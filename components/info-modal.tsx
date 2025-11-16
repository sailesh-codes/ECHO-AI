'use client'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-cyan-500/30 rounded-lg max-w-md w-full shadow-xl shadow-cyan-500/10 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between sticky top-0 bg-zinc-900">
          <h2 className="text-xl font-bold text-cyan-400">About This Bot</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-cyan-400 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4 text-sm text-zinc-300">
          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">Welcome!</h3>
            <p>This is an AI-powered chatbot that leverages advanced language models to provide intelligent responses to your queries.</p>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">Features</h3>
            <ul className="space-y-1 text-xs">
              <li>• Real-time conversation history</li>
              <li>• Message copying capability</li>
              <li>• Stop response during generation</li>
              <li>• Local data persistence</li>
              <li>• Responsive mobile design</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">Usage Tips</h3>
            <ul className="space-y-1 text-xs">
              <li>• Press Enter to send, Shift+Enter for new line</li>
              <li>• Click "Copy" on assistant messages</li>
              <li>• Use "Delete Chat" to clear history</li>
              <li>• Your API key is stored locally</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cyan-400 mb-2">API & Privacy</h3>
            <p className="text-xs">This application uses the Google Gemini API. Your messages are sent to Google's servers for processing. Your API key is stored only in your browser's local storage.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cyan-500/20 flex justify-end sticky bottom-0 bg-zinc-900">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
