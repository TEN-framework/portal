'use client'

import { useEffect, useState } from 'react'

export function WelcomeHackers() {
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
          // Only log the counts info in the browser devtools
          console.log(
            `\n  _______  ______  _   _ \n |__   __||  ____|| \\ | |\n    | |   | |__   |  \\| |\n    | |   |  __|  | . | |\n    | |   | |____ | |\\  |\n    |_|   |______||_| \\_|\n`
          )
          console.log(`Welcome to TEN 🎉, hacker #${data.uniqueVisitors}`)
        } else {
          console.warn(
            '⚠️ Visit counter API returned non-OK status:',
            response.status
          )
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
