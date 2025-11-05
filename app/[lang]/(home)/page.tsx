'use client'

import { useTheme } from 'next-themes'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Hero } from '@/app/[lang]/(home)/_components'
import { Footer } from '@/components/ui/footer'

const BackgroundVideo = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      // Reset loaded state when theme changes
      setIsLoaded(false)
      // Reset the video to start playing from beginning
      videoRef.current.currentTime = 0
      videoRef.current.load()
      videoRef.current.play()
    }
  }, [])

  if (!mounted) return null

  const videoSrc =
    resolvedTheme === 'dark'
      ? 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg-dark.mp4'
      : 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4'

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      onLoadedData={() => setIsLoaded(true)}
      className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${
        isLoaded ? 'opacity-37 dark:opacity-57' : 'opacity-0'
      }`}
    >
      <source src={videoSrc} type='video/mp4' />
      Your browser does not support the video tag.
    </video>
  )
}

export default function HomePage() {
  const heroOffsetStyle = useMemo<CSSProperties>(() => {
    const navHeightVar = 'var(--fd-nav-height, 3.5rem)'
    return {
      marginTop: `calc(${navHeightVar} * -0.5)`
    }
  }, [])

  return (
    <div className='relative'>
      {/* Background Video - Fixed to cover entire viewport */}
      <div className='fixed inset-0 z-0'>
        <BackgroundVideo />
        {/* Gradient overlay to blend video into footer */}
        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background/95 via-background/50 to-transparent' />
      </div>

      {/* Content */}
      <div className='relative z-10'>
        <div
          className='lg:-mt-[10vh] flex min-h-screen flex-1 flex-col justify-center text-center'
          style={heroOffsetStyle}
        >
          <Hero className='flex h-full w-full items-center justify-center' />
        </div>
      </div>
    </div>
  )
}
