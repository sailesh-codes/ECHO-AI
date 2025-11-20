'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8 sm:p-4 twinkle-background">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-black/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
          {/* Logo and Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black flex items-center justify-center mx-auto mb-4 shadow-[0_20px_40px_rgba(0,0,0,0.65)] border border-cyan-500/40">
              <Image
                src="/logo.png"
                alt="Echo logo"
                priority
                width={48}
                height={48}
                className="relative w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_4px_20px_rgba(8,145,178,0.8)]"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to Echo AI</h1>
            <p className="text-sm sm:text-base text-gray-400">Your intelligent conversation partner</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative flex h-12 sm:h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/70 bg-transparent px-5 sm:px-6 text-base sm:text-lg font-semibold text-cyan-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Start chat session"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-cyan-100">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting Session...
                </div>
              ) : (
                <>
                  <span className="absolute left-0 h-full w-5 border-y border-l border-cyan-400 transition-all duration-500 group-hover:w-full" />
                  <span className="absolute right-0 h-full w-5 border-y border-r border-cyan-400 transition-all duration-500 group-hover:w-full" />
                  <span className="absolute translate-x-0 text-cyan-200 transition-all duration-200 group-hover:-translate-x-full group-hover:opacity-0">
                    Ready?
                  </span>
                  <span className="absolute translate-x-full text-cyan-50 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                    Start Chat Session
                  </span>
                  <span className="opacity-0">Start Chat Session</span>
                </>
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

        
      </div>
    </div>
  )
}
