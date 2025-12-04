'use client'

import { Wifi, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

interface AnnouncementBannerProps {
  title: string
  primaryHref: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  storageKey?: string
  className?: string
}

export function AnnouncementBanner({
  title,
  primaryHref,
  primaryLabel = 'Learn more',
  secondaryHref,
  secondaryLabel = 'Quick start',
  storageKey = 'banner:websocket:v1',
  className
}: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      const closed =
        typeof window !== 'undefined' && window.localStorage.getItem(storageKey)
      if (closed === 'closed') setVisible(false)
    } catch {}
  }, [storageKey])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(storageKey, 'closed')
    } catch {}
  }

  if (!visible) return null

  return (
    <div
      role='note'
      aria-live='polite'
      className={cn(
        'mx-auto max-w-[var(--spacing-fd-container)] px-[var(--site-x-pad)]',
        className
      )}
    >
      <div className='flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border bg-card/80 px-3 py-2.5 text-sm shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60 sm:flex-row sm:gap-3 sm:rounded-full sm:px-4'>
        <div className='flex items-center justify-center gap-2'>
          <Wifi
            className='hidden h-4 w-4 shrink-0 text-muted-foreground sm:block'
            aria-hidden='true'
          />
          <span className='hyphens-auto break-words text-center font-medium leading-tight'>
            {title}
          </span>
        </div>
        <div className='flex shrink-0 items-center gap-1.5 sm:gap-2'>
          <Link
            href={primaryHref}
            className='inline-flex items-center rounded-full bg-accent px-3 py-1 font-semibold text-accent-foreground text-xs transition-colors hover:bg-accent/80'
          >
            {primaryLabel}
          </Link>
          {secondaryHref && (
            <Link
              href={secondaryHref}
              className='inline-flex items-center rounded-full border border-border bg-card px-3 py-1 font-semibold text-foreground text-xs transition-colors hover:bg-accent/60'
            >
              {secondaryLabel}
            </Link>
          )}
          <button
            type='button'
            aria-label='Dismiss announcement'
            onClick={dismiss}
            className='inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2.5 text-muted-foreground hover:bg-muted'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
