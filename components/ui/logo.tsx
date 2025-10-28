import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

interface LogoProps {
  height?: number
  width?: number
  className?: string
  variant?: 'full' | 'mark'
}

export const Logo = ({
  height = 32,
  width,
  className,
  variant = 'full'
}: LogoProps) => {
  const style: CSSProperties = {
    height: `${height}px`,
    width: width ? `${width}px` : 'auto'
  }

  if (variant === 'mark') {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 184 136'
        style={style}
        className={cn('h-full w-full', className)}
        aria-hidden='true'
      >
        <polygon
          points='153.1 3.22 153.3 3.22 150.5 .72 147.3 .72 147.3 .72 34.2 .52 33.4 2.82 0 99.72 28 130.42 63.5 130.32 98.9 27.42 61.5 27.22 36.6 2.82 149.9 3.22 177.5 29.82 133.8 28.22 98.6 130.32 146.2 129.82 180.6 29.92 153.1 3.22'
          fill='currentColor'
        />
      </svg>
    )
  }

  return (
    <svg
      id='ten-logo'
      data-name='ten-logo'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 536.03 168.7'
      style={style}
      className={cn('h-full w-full', className)}
    >
      <title className='sr-only'>TEN Logo</title>
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
            .cls-1 {
              font-family: 'Audiowide', cursive;
              font-size: 144px;
              fill: currentColor;
              dominant-baseline: middle;
              text-anchor: start;
            }
          `}
        </style>
      </defs>
      <g id='logo-container' data-name='logo-container'>
        <g id='logo-shape'>
          <polygon
            points='153.1 3.22 153.3 3.22 150.5 .72 147.3 .72 147.3 .72 34.2 .52 33.4 2.82 0 99.72 28 130.42 63.5 130.32 98.9 27.42 61.5 27.22 36.6 2.82 149.9 3.22 177.5 29.82 133.8 28.22 98.6 130.32 146.2 129.82 180.6 29.92 153.1 3.22'
            fill='currentColor'
          />
        </g>
        <text className='cls-1' x='200' y='85'>
          TEN
        </text>
      </g>
    </svg>
  )
}
