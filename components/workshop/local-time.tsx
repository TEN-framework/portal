'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface LocalTimeProps {
  start: string
  end: string
  className?: string
}

const formatRange = (start: Date, end: Date) => {
  const resolvedZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  const startLabel = formatter.format(start)
  const endLabel = formatter.format(end)

  return `${startLabel} – ${endLabel} (${resolvedZone.replace('_', ' ')})`
}

export function LocalTimeNotice({ start, end, className }: LocalTimeProps) {
  const [label, setLabel] = useState<string>()

  useEffect(() => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    setLabel(formatRange(startDate, endDate))
  }, [start, end])

  if (!label) return null

  return (
    <p className={cn('text-gray-400 text-xs dark:text-gray-500', className)}>
      Shows in your timezone: {label}
    </p>
  )
}
