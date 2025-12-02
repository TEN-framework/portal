'use client'

import { useEffect, useRef } from 'react'

export function AsciiBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    const chars = ['.', '•', '*', '+']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const size = 16
      const cols = Math.ceil(canvas.width / size)
      const rows = Math.ceil(canvas.height / size)
      ctx.font =
        '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'rgba(64, 200, 255, 0.12)'

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = Math.floor(
            (x * 13 + y * 7 + Math.floor(t / 120)) % chars.length
          )
          const ch = chars[idx]
          ctx.fillText(ch, x * size + size / 2, y * size + size / 2)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onBlur = () => cancelAnimationFrame(raf)
    const onFocus = () => {
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className='pointer-events-none absolute inset-0 z-0 mix-blend-screen'
    />
  )
}
