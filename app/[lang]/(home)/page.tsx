'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Hero } from '@/app/[lang]/(home)/_components'

const BackgroundVideo = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarsePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    const isSmallViewport =
      typeof window !== 'undefined' && window.innerWidth < 768
    const saveData =
      typeof navigator !== 'undefined' &&
      (navigator as any).connection?.saveData
    const effectiveType =
      typeof navigator !== 'undefined' &&
      (navigator as any).connection?.effectiveType
    const isSlowNetwork =
      effectiveType && ['2g', '3g', 'slow-2g'].includes(effectiveType)

    const allowAutoplay =
      !prefersReducedMotion &&
      !saveData &&
      !isSlowNetwork &&
      !isCoarsePointer &&
      !isSmallViewport
    setShouldRenderVideo(allowAutoplay)
  }, [])

  useEffect(() => {
    if (shouldRenderVideo && videoRef.current) {
      setIsLoaded(false)
      videoRef.current.currentTime = 0
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [shouldRenderVideo])

  if (!mounted) return null

  const videoSrc =
    resolvedTheme === 'dark'
      ? 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg-dark.mp4'
      : 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4'

  if (!shouldRenderVideo) return null

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload='metadata'
      onLoadedData={() => setIsLoaded(true)}
      className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${
        isLoaded ? 'opacity-37 dark:opacity-57' : 'opacity-0'
      }`}
    >
      <source src={videoSrc} type='video/mp4' />
    </video>
  )
}

export default function HomePage() {
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
        <div className='flex flex-1 flex-col justify-center text-center'>
          <Hero className='flex h-full w-full items-center justify-center' />
        </div>
      </div>
    </div>
  )
}
