'use client'

import type * as React from 'react'
import { usePathname } from 'next/navigation'
import { Link } from '@/lib/next-intl-navigation'
import { VersionSelector } from '@/components/layout/version-select'
import { cn } from '@/lib/utils'

export const Banner = (props: React.ComponentProps<'div'>) => {
  const { className, children, ...rest } = props

  return (
    <div {...rest} className={cn('flex flex-col gap-2 px-4 py-2', className)}>
      {children}
      <VersionSelector />
    </div>
  )
}
