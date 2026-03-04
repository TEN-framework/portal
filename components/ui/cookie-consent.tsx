'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'declined'

interface CookieConsentProps {
  message: string
  acceptLabel: string
  declineLabel: string
  className?: string
  onAccept?: () => void
  onDecline?: () => void
}

export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'accepted' || stored === 'declined') return stored
  } catch {}
  return 'pending'
}

export function CookieConsent({
  message,
  acceptLabel,
  declineLabel,
  className,
  onAccept,
  onDecline
}: CookieConsentProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const status = getConsentStatus()
    if (status === 'pending') {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {}
    onAccept?.()
  }

  const handleDecline = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, 'declined')
    } catch {}
    onDecline?.()
  }

  if (!visible) return null

  return (
    <div
      role='alert'
      aria-live='polite'
      className={cn(
        'fixed right-4 bottom-8 z-50 max-w-xs md:right-6 md:bottom-10',
        className
      )}
    >
      <div className='flex flex-col gap-2 rounded-lg border border-border/50 bg-background/70 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/55'>
        <p className='text-muted-foreground text-xs leading-snug'>{message}</p>
        <div className='flex gap-2'>
          <Button
            size='sm'
            onClick={handleAccept}
            className='h-7 flex-1 px-2 text-xs'
          >
            {acceptLabel}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDecline}
            className='h-7 flex-1 px-2 text-muted-foreground text-xs hover:text-foreground'
          >
            {declineLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
