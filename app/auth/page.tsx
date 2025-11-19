'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/')
      } else {
        console.error('Login failed:', data.error)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Echo AI</h1>
            <p className="text-gray-400">Your intelligent conversation partner</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting Session...
                </>
              ) : (
                'Start Chat Session'
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-center text-sm text-gray-400">
                <p>You get 5 free prompts per session</p>
                <p className="mt-1">No registration required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Gemini & Mistral AI</p>
        </div>
      </div>
    </div>
  )
}
