'use client'

import { useEffect, useState } from 'react'

export function VisitCounter() {

  const [, setVisitCount] = useState<number | null>(null)

  useEffect(() => {
    // Track the visit when component mounts
    let isMounted = true
    
    const trackVisit = async () => {
      try {
        // POST to count this visit
        const response = await fetch('/api/visit-counter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        // Check if component is still mounted before processing response
        if (!isMounted) return
        
        if (response.ok) {
          const data = await response.json()
          // Only update state if component is still mounted
          if (isMounted) {
            setVisitCount(data.uniqueVisitors)
          }
          console.log(`🎉 Welcome, new hacker! ${data.uniqueVisitors}`)
          if (data.isFirstVisit) {
            console.log('🎉 Welcome, new hacker!')
          }
        } else {
          console.warn('⚠️ Visit counter API returned non-OK status:', response.status)
        }
      } catch (error) {
        // Only log error if component is still mounted
        if (isMounted) {
          console.error('❌ Failed to track visit:', error)
        }
      }
    }

    trackVisit()

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false
    }
  }, [])

  // Always return null - don't show anything to users
  return null
}
