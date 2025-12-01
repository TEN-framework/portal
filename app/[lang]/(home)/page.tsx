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
    const alwaysPlay =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_ALWAYS_PLAY_BG_VIDEO === 'true'

    const allowAutoplay = alwaysPlay ? true : !prefersReducedMotion
    setShouldRenderVideo(allowAutoplay)
  }, [])

  useEffect(() => {
    if (shouldRenderVideo && videoRef.current) {
      setIsLoaded(false)
      videoRef.current.muted = true
      // @ts-expect-error playsInline is a valid HTMLVideoElement property in browsers
      videoRef.current.playsInline = true
      videoRef.current.autoplay = true
      videoRef.current.currentTime = 0
      videoRef.current.load()
      videoRef.current
        .play()
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('Background video autoplay blocked', err)
          }
          const handler = () => {
            const v = videoRef.current
            if (!v) return
            v.muted = true
            // @ts-expect-error playsInline is a valid HTMLVideoElement property in browsers
            v.playsInline = true
            v.autoplay = true
            v.play().finally(() => {
              window.removeEventListener('pointerdown', handler)
              window.removeEventListener('touchstart', handler)
            })
          }
          window.addEventListener('pointerdown', handler, { once: true })
          window.addEventListener('touchstart', handler, { once: true })
        })
    }
  }, [shouldRenderVideo])

  if (!mounted) return null

  const isSmallViewport =
    typeof window !== 'undefined' && window.innerWidth < 768
  const baseDark =
    'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg-dark.mp4'
  const baseLight =
    'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4'
  const mobileDark = process.env.NEXT_PUBLIC_BG_VIDEO_DARK_MOBILE || ''
  const mobileLight = process.env.NEXT_PUBLIC_BG_VIDEO_LIGHT_MOBILE || ''
  const videoSrc = resolvedTheme === 'dark'
    ? (isSmallViewport && mobileDark ? mobileDark : baseDark)
    : (isSmallViewport && mobileLight ? mobileLight : baseLight)

  if (!shouldRenderVideo) return null

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload='auto'
      poster={
        resolvedTheme === 'dark'
          ? process.env.NEXT_PUBLIC_BG_VIDEO_POSTER_DARK ||
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBAQ=='
          : process.env.NEXT_PUBLIC_BG_VIDEO_POSTER_LIGHT ||
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBAQ=='
      }
      onCanPlay={() => setIsLoaded(true)}
      className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-700 ${
        isLoaded ? 'opacity-37 dark:opacity-57' : 'opacity-0'
      }`}
    >
      {resolvedTheme === 'dark' && process.env.NEXT_PUBLIC_BG_VIDEO_WEBM_URL_DARK ? (
        <source src={process.env.NEXT_PUBLIC_BG_VIDEO_WEBM_URL_DARK} type='video/webm' />
      ) : null}
      {resolvedTheme !== 'dark' && process.env.NEXT_PUBLIC_BG_VIDEO_WEBM_URL_LIGHT ? (
        <source src={process.env.NEXT_PUBLIC_BG_VIDEO_WEBM_URL_LIGHT} type='video/webm' />
      ) : null}
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
