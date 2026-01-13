'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsentStatus } from '@/components/ui/cookie-consent'

export function AhrefsLoader() {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const status = getConsentStatus()
    if (status !== 'declined') {
      setShouldLoad(true)
    }
  }, [])

  if (!shouldLoad) return null

  return (
    <Script
      id='ahrefs-analytics'
      src='https://analytics.ahrefs.com/analytics.js'
      data-key='lOUyYaT4eHvdDZ0IWZN7YQ'
      strategy='afterInteractive'
      async
    />
  )
}
