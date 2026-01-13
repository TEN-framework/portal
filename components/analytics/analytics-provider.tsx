'use client'

import { useCallback, useState } from 'react'
import { CookieConsent } from '@/components/ui/cookie-consent'
import { AhrefsLoader } from '@/components/analytics/ahrefs-loader'
import { PostHogLoader } from './posthog-loader'

interface AnalyticsProviderProps {
  translations: {
    message: string
    accept: string
    decline: string
  }
}

export function AnalyticsProvider({ translations }: AnalyticsProviderProps) {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  const handleAccept = useCallback(() => {
    // Analytics will load on next render since consent is now stored
    setAnalyticsEnabled(true)
  }, [])

  const handleDecline = useCallback(() => {
    setAnalyticsEnabled(false)
    // Optionally disable PostHog if it was already loaded
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { posthog?: { opt_out_capturing?: () => void } })
        .posthog?.opt_out_capturing
    ) {
      ;(
        window as unknown as { posthog: { opt_out_capturing: () => void } }
      ).posthog.opt_out_capturing()
    }
  }, [])

  return (
    <>
      {analyticsEnabled && <PostHogLoader />}
      {analyticsEnabled && <AhrefsLoader />}
      <CookieConsent
        message={translations.message}
        acceptLabel={translations.accept}
        declineLabel={translations.decline}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </>
  )
}
