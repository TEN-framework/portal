'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Sparkles } from 'lucide-react'

interface GitHubStarButtonProps {
  repo: string // Format: "owner/repo"
  className?: string
}

function useCountAnimation(endValue: number | null, duration: number = 8000) {
  const [count, setCount] = useState(0)
  const countRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!endValue) return

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const startValue = countRef.current
      const newValue = Math.floor(startValue + (endValue - startValue) * easeOutExpo)
      countRef.current = newValue
      setCount(newValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    startTimeRef.current = null
    requestAnimationFrame(animate)

    return () => {
      startTimeRef.current = null
    }
  }, [endValue, duration])

  return count
}

export function GitHubStarButton({ repo, className = '' }: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const animatedCount = useCountAnimation(starCount)

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        // Use our API route instead of direct GitHub API calls
        const response = await fetch(`/api/github-stars?repo=${encodeURIComponent(repo)}`)
        
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
          
          // Only show sparkles for fresh data, not cached
          // Note: Sparkle animation removed
        } else {
          // Handle API errors (including rate limits)
          const errorData = await response.json().catch(() => ({}))
          
          if (errorData.from_cache) {
            console.info('Using cached star count due to API error:', errorData.error || 'Unknown error')
          } else {
            console.warn('GitHub star count API failed, using fallback:', errorData.error || 'Unknown error')
          }
          
          // Use fallback count from API response (either cached or default)
          setStarCount(errorData.stargazers_count || 1000)
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error)
        // Fallback: show a placeholder count
        setStarCount(1000)
      }
    }

    fetchStarCount()
  }, [repo])

  const formatStarCount = (count: number) => count.toLocaleString()

  const handleClick = () => {
    window.open(`https://github.com/${repo}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="relative">
      {/* Sparkles effect */}
      {!isHovered && (
        <div className="absolute -inset-2 pointer-events-none">
          <Sparkles className="absolute top-0 left-0 h-3 w-3 text-yellow-400 animate-ping" />
          <Sparkles className="absolute top-0 right-0 h-2 w-2 text-blue-400 animate-ping animation-delay-300" />
          <Sparkles className="absolute bottom-0 left-2 h-2 w-2 text-purple-400 animate-ping animation-delay-500" />
          <Sparkles className="absolute bottom-0 right-2 h-3 w-3 text-green-400 animate-ping animation-delay-700" />
        </div>
      )}
      
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-gray-900 to-black px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:from-gray-800 hover:to-gray-900 hover:scale-105 cursor-pointer ${className}`}
      >
        {/* GitHub icon */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 relative z-10" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span className="dark:text-gray-300 relative z-10">open source</span>
        <Star className={`h-4 w-4 relative z-10 transition-all duration-300 ${isHovered ? 'fill-transparent stroke-yellow-500 scale-110' : 'fill-transparent stroke-white'}`} />
        <span className={`inline-block w-16 rounded bg-gradient-to-r from-gray-700 to-gray-600 px-2 py-0.5 text-center text-xs font-bold relative z-10 transition-all duration-300 ${isHovered ? 'from-yellow-600 to-yellow-500 text-white scale-105' : ''}`}>
          {formatStarCount(animatedCount)}
        </span>
        
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
            ⭐ Star this repo!
          </div>
        )}
      </button>
    </div>
  )
}
