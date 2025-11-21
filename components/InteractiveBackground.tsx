// components/InteractiveBackground.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface Dot {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  angle: number
  distance: number
}

export default function InteractiveBackground() {
  const [dots, setDots] = useState<Dot[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  
  // Add keyframes to the document head
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.4; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Initialize dots
  useEffect(() => {
    if (typeof window === 'undefined') return

    const createDots = () => {
      if (!containerRef.current) return []
      
      const container = containerRef.current
      const dotCount = 150 // Fixed number of dots for consistent look
      
      return Array.from({ length: dotCount }, (_, i) => ({
        id: i,
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
        size: Math.random() * 1.5 + 0.5, // Smaller dots
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 50 + 25
      }))
    }

    const initialDots = createDots()
    setDots(initialDots)

    const handleResize = () => {
      const newDots = createDots()
      setDots(newDots)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation loop
  useEffect(() => {
    if (typeof window === 'undefined') return

    const animate = () => {
      setDots(prevDots => 
        prevDots.map(dot => {
          // Gentle floating movement
          dot.angle += (dot.speed * 0.1) * 0.016 // 60fps frame time
          
          // Update position with smooth floating
          dot.x += Math.cos(dot.angle) * 0.2
          dot.y += Math.sin(dot.angle * 0.5) * 0.2
          
          // Keep dots within bounds
          if (!containerRef.current) return dot
          
          if (dot.x < 0 || dot.x > containerRef.current.offsetWidth) {
            dot.angle = Math.PI - dot.angle
            dot.x = Math.max(0, Math.min(dot.x, containerRef.current.offsetWidth))
          }
          
          if (dot.y < 0 || dot.y > containerRef.current.offsetHeight) {
            dot.angle = -dot.angle
            dot.y = Math.max(0, Math.min(dot.y, containerRef.current.offsetHeight))
          }
          
          return { ...dot }
        })
      )
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none twinkle-background"
      style={{
        zIndex: -1,
        background: 'linear-gradient(to bottom, #0f172a, #0c0f1e)'
      }}
    >
      {/* Animated dots */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            boxShadow: '0 0 10px 1px rgba(14, 165, 233, 0.15)',
            opacity: dot.opacity * 0.7, // Reduced opacity for better visibility
            transition: 'all 0.3s ease-out',
            animation: 'twinkle 5s infinite',
            animationDelay: `${(dot.id % 5) * 0.5}s`,
            willChange: 'transform, opacity',
            zIndex: -1
          }}
        />
      ))}
      
      {/* Subtle grid pattern - made more subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'linear-gradient(to right, #0891b2 0.5px, transparent 0.5px), linear-gradient(to bottom, #0891b2 0.5px, transparent 0.5px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}