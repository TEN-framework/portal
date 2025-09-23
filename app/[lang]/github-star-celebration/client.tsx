'use client'

import confetti from 'canvas-confetti'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Orbitron } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { cn } from '@/lib/utils'

type ClientProps = {
  lang: string
}

const TARGET_STARS = 8000
const COUNT_DURATION = 9000

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export function GitHubStarCelebrationClient({ lang }: ClientProps) {
  const [animatedStars, setAnimatedStars] = useState(0)
  const hasCelebrated = useRef(false)

  useEffect(() => {
    let frameId: number
    let start: number | null = null

    const animate = (timestamp: number) => {
      if (start === null) {
        start = timestamp
      }

      const progress = Math.min((timestamp - start) / COUNT_DURATION, 1)
      const eased = easeOutCubic(progress)
      setAnimatedStars(Math.round(TARGET_STARS * eased))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        setAnimatedStars(TARGET_STARS)

        if (!hasCelebrated.current) {
          hasCelebrated.current = true

          const defaults: confetti.Options = {
            scalar: 1.4,
            spread: 120,
            ticks: 180,
            startVelocity: 42,
          }

          const fire = (
            particleRatio: number,
            origin: confetti.Options['origin'],
            opts: confetti.Options = {}
          ) => {
            void confetti({
              ...defaults,
              ...opts,
              particleCount: Math.floor(280 * particleRatio),
              origin,
            })
          }

          const bursts: Array<{
            ratio: number
            origin: { x: number; y: number }
            options?: confetti.Options
          }> = [
            {
              ratio: 0.35,
              origin: { x: 0.25, y: 0.35 },
              options: { spread: 160, startVelocity: 50 },
            },
            {
              ratio: 0.45,
              origin: { x: 0.5, y: 0.32 },
              options: { spread: 180, scalar: 1.6, ticks: 200 },
            },
            {
              ratio: 0.35,
              origin: { x: 0.75, y: 0.35 },
              options: { spread: 160, startVelocity: 50 },
            },
          ]

          bursts.forEach(({ ratio, origin, options }, index) => {
            setTimeout(() => {
              fire(ratio, origin, options)
            }, index * 300)
          })
        }
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [])

  const formattedStars = animatedStars.toLocaleString('en-US', {
    useGrouping: false,
  })
  const placeholderLength = TARGET_STARS.toString().length
  const paddedStars = formattedStars.padStart(placeholderLength, '0')
  const starCharacters = Array.from(paddedStars)
  const milestoneLabel =
    lang === 'cn' ? 'GitHub Stars 里程碑' : 'GitHub Stars milestone'

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <WebGLShader />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />

      <section className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.3em] text-white/80">
            {lang === 'cn'
              ? 'GitHub 8,000+ Star 庆典'
              : 'GitHub 8,000 Star Celebration'}
          </span>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex flex-col items-center gap-3 text-center">
              <div className="absolute -inset-8 rounded-full bg-amber-200/25 blur-3xl" />
              <div className="relative flex flex-col items-center gap-3 text-center md:gap-5 lg:gap-1">
                <span
                  className={cn(
                    orbitron.className,
                    'flex items-center justify-center gap-[0.3em] text-[clamp(4.5rem,12vw,9.5rem)] font-black tracking-[0.08em] text-amber-50 drop-shadow-[0_25px_60px_rgba(245,158,11,0.6)]'
                  )}
                >
                  {starCharacters.map((char, index) => (
                    <span
                      key={`${char}-${index}`}
                      className="inline-flex w-[0.75em] justify-center tabular-nums"
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span
                  className={cn(
                    orbitron.className,
                    'text-[clamp(2.3rem,6.3vw,3.8rem)] font-semibold uppercase tracking-[0.45em] text-amber-50/80 lg:text-[clamp(2.5rem,6vw,4rem)]'
                  )}
                >
                  <span className="mt-3 block md:mt-6 lg:mt-[-2.5rem]" />
                  Stars
                  <span className="mb-3 block md:mb-5 lg:mb-0" />
                </span>
                <span
                  className={cn(
                    orbitron.className,
                    'text-sm uppercase tracking-[0.45em] text-amber-50/60'
                  )}
                >
                  {milestoneLabel}
                </span>
              </div>
            </div>
            <span className="text-sm text-white/65">
              {lang === 'cn'
                ? '感谢每一颗星星，未来由你共同点亮'
                : 'Every star sparks the next release — thank you for the momentum'}
            </span>
          </div>
          <div className="flex w-full max-w-xl flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <LiquidButton
              className="w-full rounded-full px-10 py-3 text-lg text-white sm:w-auto sm:flex-1"
              size="xl"
              onClick={() => {
                window.open(
                  'https://github.com/TEN-framework/ten-framework',
                  '_blank'
                )
              }}
            >
              <span className="flex items-center gap-2">
                {lang === 'cn'
                  ? '为 TEN Framework 增添一颗 Star'
                  : 'Add your star to TEN Framework'}
                <ExternalLink className="h-4 w-4" />
              </span>
            </LiquidButton>
            <MetalButton
              variant="gold"
              className="w-full text-base sm:w-auto sm:flex-1"
              onClick={() => {
                window.open(
                  'https://github.com/TEN-framework/ten-framework/stargazers',
                  '_blank'
                )
              }}
            >
              <span className="flex items-center gap-2">
                {lang === 'cn'
                  ? '查看我们的 GitHub 征程'
                  : 'See our GitHub journey'}
                <ExternalLink className="h-4 w-4" />
              </span>
            </MetalButton>
          </div>
        </div>

        <div className="h-6" />
      </section>

      <div className="pb-24" />
    </div>
  )
}
