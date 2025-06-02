'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Hero } from '@/app/[lang]/(home)/_components'

const BackgroundVideo = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [videoKey, setVideoKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setVideoKey(prev => prev + 1)
  }, [resolvedTheme])

  if (!mounted) return null

  const videoSrc = resolvedTheme === 'dark'
    ? 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg-dark.mp4'
    : 'https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4'

  return (
    <video
      key={videoKey}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0 opacity-37"
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

export default function HomePage() {
  return (
    <div className="relative flex h-[calc(100dvh-56px)] flex-1 flex-col justify-center text-center overflow-hidden">
      <BackgroundVideo />
      <Hero className="relative z-10" />
    </div>
  )
}
