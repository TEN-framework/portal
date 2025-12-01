'use client'

import { Sparkles, Star } from 'lucide-react'
import { useMotionValue, useSpring } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

interface GitHubStarButtonProps {
  repo: string // Format: "owner/repo"
  className?: string
}

function useCountAnimation(
  to: number | null,
  from: number = 0,
  duration: number = 2
) {
  // const ref = useRef<number>(from)
  const [displayValue, setDisplayValue] = useState(from)
  const motionValue = useMotionValue(from)

  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  })

  const formatValue = useCallback((latest: number) => {
    return Math.floor(latest)
  }, [])

  useEffect(() => {
    if (to !== null) {
      motionValue.set(to)
    }
  }, [to, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      setDisplayValue(formatValue(latest))
    })

    return () => unsubscribe()
  }, [springValue, formatValue])

  return displayValue
}

export function GitHubStarButton({
  repo,
  className = ''
}: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const animatedCount = useCountAnimation(starCount, 0, 2)

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        // Use our API route instead of direct GitHub API calls
        const response = await fetch(
          `/api/github-stars?repo=${encodeURIComponent(repo)}`
        )

        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)

          // Only show sparkles for fresh data, not cached
          // Note: Sparkle animation removed
        } else {
          // Handle API errors (including rate limits)
          const errorData = await response.json().catch(() => ({}))

          if (errorData.from_cache) {
            console.info(
              'Using cached star count due to API error:',
              errorData.error || 'Unknown error'
            )
          } else {
            console.warn(
              'GitHub star count API failed, using fallback:',
              errorData.error || 'Unknown error'
            )
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
    <div className='relative'>
      {/* Sparkles effect - only on hover */}
      {isHovered && (
        <div className='-inset-2 pointer-events-none absolute hidden sm:block'>
          <Sparkles className='absolute top-0 left-0 h-3 w-3 animate-ping text-yellow-400' />
          <Sparkles className='animation-delay-300 absolute top-0 right-0 h-2 w-2 animate-ping text-blue-400' />
          <Sparkles className='animation-delay-500 absolute bottom-0 left-2 h-2 w-2 animate-ping text-purple-400' />
          <Sparkles className='animation-delay-700 absolute right-2 bottom-0 h-3 w-3 animate-ping text-green-400' />
        </div>
      )}

      <button
        type='button'
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#171717] px-3 py-1.5 font-medium text-sm text-white transition-all duration-300 hover:scale-105 ${className}`}
      >
        {/* GitHub icon */}
        <svg
          viewBox='0 0 24 24'
          className='relative z-10 h-4 w-4'
          fill='currentColor'
        >
          <title className='sr-only'>GitHub</title>
          <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
        </svg>
        <span className='relative z-10 hidden whitespace-nowrap text-xs sm:inline dark:text-gray-300'>
          open source
        </span>
        <Star
          className={`relative z-10 h-4 w-4 transition-all duration-300 ${isHovered ? 'scale-110 fill-transparent stroke-yellow-500' : 'fill-transparent stroke-white'}`}
        />
        <span
          className={`relative z-10 inline-flex min-w-[2.5rem] justify-center rounded-full bg-gradient-to-r from-gray-700 to-gray-600 px-2 py-0.5 text-center font-bold text-xs transition-all duration-300 ${isHovered ? 'scale-105 from-yellow-600 to-yellow-500 text-white' : ''} sm:min-w-[4rem]`}
        >
          {formatStarCount(animatedCount)}
        </span>

        {/* Tooltip */}
        {isHovered && (
          <div className='-bottom-8 -translate-x-1/2 pointer-events-none absolute left-1/2 z-50 transform whitespace-nowrap rounded bg-black px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            ⭐ Star this repo!
          </div>
        )}
      </button>
    </div>
  )
}
