'use client'

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

interface GitHubStarButtonProps {
  repo: string // Format: "owner/repo"
  className?: string
}

function useCountAnimation(
  endValue: number | null,
  duration: number = 2500,
  initialEstimate: number = 6045
) {
  const [count, setCount] = useState(0)
  const countRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)
  const estimateRef = useRef<boolean>(true)

  useEffect(() => {
    // Start with estimate animation
    const animateEstimate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / 1500, 1) // Initial animation duration

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      countRef.current = Math.floor(easeOutQuart * initialEstimate)
      setCount(countRef.current)

      if (progress < 1 && estimateRef.current) {
        requestAnimationFrame(animateEstimate)
      }
    }

    // Transition to actual count when available
    const animateActual = (currentTime: number) => {
      if (!endValue) return
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Using a more dramatic easing function for slower start and finish
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const startValue = countRef.current
      const diff = endValue - startValue
      countRef.current = Math.floor(startValue + diff * easeOutExpo)
      setCount(countRef.current)

      if (progress < 1) {
        requestAnimationFrame(animateActual)
      }
    }

    if (endValue === null) {
      // Start with estimate animation
      estimateRef.current = true
      startTimeRef.current = null
      requestAnimationFrame(animateEstimate)
    } else {
      // Transition to actual count
      estimateRef.current = false
      startTimeRef.current = null
      requestAnimationFrame(animateActual)
    }

    return () => {
      startTimeRef.current = null
    }
  }, [endValue, duration, initialEstimate])

  return count
}

export function GitHubStarButton({
  repo,
  className = '',
}: GitHubStarButtonProps) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const animatedCount = useCountAnimation(starCount)

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`)
        if (response.ok) {
          const data = await response.json()
          setStarCount(data.stargazers_count)
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error)
      }
    }

    // Add a longer delay before fetching to show more of the estimate animation
    setTimeout(fetchStarCount, 1200)
  }, [repo])

  const formatStarCount = (count: number) => {
    return count.toLocaleString()
  }

  const handleClick = () => {
    window.open(`https://github.com/${repo}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 ${className}`}
    >
      {/* github icon */}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
      <span>open source</span>
      <Star className="h-4 w-4 fill-transparent stroke-[#FFD700] text-[#FFD700] transition-colors group-hover:fill-[#FFD700]" />
      <span className="inline-block w-14 rounded bg-gray-700 px-1.5 py-0.5 text-center text-xs">
        {formatStarCount(animatedCount)}
      </span>
    </button>
  )
}
