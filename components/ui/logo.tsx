import Image from 'next/image'

import { cn } from '@/lib/utils'

const LOGO_WIDTH = 1178
const LOGO_HEIGHT = 495
const LOGO_ASPECT_RATIO = LOGO_WIDTH / LOGO_HEIGHT
const LOGO_SRC = '/images/ten-logo.png'
const DEFAULT_HEIGHT = 32

interface LogoProps {
  height?: number
  width?: number
  className?: string
}

export const Logo = ({ height, width, className }: LogoProps) => {
  const resolvedHeight =
    height ?? (width ? Math.round(width / LOGO_ASPECT_RATIO) : DEFAULT_HEIGHT)
  const resolvedWidth = Math.round(resolvedHeight * LOGO_ASPECT_RATIO)

  return (
    <Image
      src={LOGO_SRC}
      alt='TEN logo'
      width={resolvedWidth}
      height={resolvedHeight}
      style={{ transform: 'translateY(2px)' }}
      className={cn('block dark:invert', className)}
    />
  )
}
