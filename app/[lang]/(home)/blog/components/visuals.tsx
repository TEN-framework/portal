import Image from 'next/image'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const accentPalette = [
  '#f97316',
  '#6366f1',
  '#ec4899',
  '#10b981',
  '#facc15',
  '#0ea5e9',
  '#c084fc',
  '#fb7185',
  '#14b8a6',
  '#fbbf24'
]
const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/

type RGB = { r: number; g: number; b: number }
export type HexColor = string

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function hexToRgb(hex: HexColor): RGB | null {
  if (!hexColorRegex.test(hex)) return null
  let normalized = hex.slice(1)
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('')
  }
  const intValue = parseInt(normalized, 16)
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  }
}

function componentToHex(component: number) {
  const clamped = clamp(Math.round(component), 0, 255)
  const hex = clamped.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

function rgbToHex({ r, g, b }: RGB): HexColor {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

export function mixHexColors(
  color: HexColor,
  mixWith: HexColor,
  weight: number
): HexColor {
  const ratio = clamp(weight, 0, 1)
  const rgbBase = hexToRgb(color)
  const rgbMix = hexToRgb(mixWith)

  if (!rgbBase || !rgbMix) {
    return color
  }

  return rgbToHex({
    r: rgbBase.r * (1 - ratio) + rgbMix.r * ratio,
    g: rgbBase.g * (1 - ratio) + rgbMix.g * ratio,
    b: rgbBase.b * (1 - ratio) + rgbMix.b * ratio
  })
}

export function hexToRgba(color: HexColor, alpha: number) {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  const clampedAlpha = clamp(alpha, 0, 1)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clampedAlpha})`
}

function getLuminance(hex: HexColor) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5

  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getReadableTextColor(background: HexColor) {
  return getLuminance(background) > 0.5 ? '#0f172a' : '#f8fafc'
}

export function getAccentColor(
  preferred: string | undefined,
  key: string,
  position = 0
): HexColor {
  if (preferred && hexColorRegex.test(preferred)) {
    return preferred
  }
  const hash = hashString(key)
  const baseIndex = hash % accentPalette.length
  const paletteIndex = (baseIndex + position) % accentPalette.length
  return accentPalette[paletteIndex]
}

export function getInitials(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return 'TEN'
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (words.length === 1) {
    const firstWord = words[0]
    const first = firstWord.charAt(0)
    const second = firstWord.charAt(1) || firstWord.charAt(0)
    return `${first}${second}`.toUpperCase()
  }
  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
}

function parseAccentWords(override?: string | string[]) {
  if (!override) return []

  const toWords = Array.isArray(override) ? override : override.split(/[|,\n]+/)

  return toWords.map((item) => item.trim()).filter((item) => item.length > 0)
}

export function getPrimaryWords(value: string, override?: string | string[]) {
  const parsedOverride = parseAccentWords(override)
  if (parsedOverride.length > 0) {
    const primary = parsedOverride[0]
    const secondary = parsedOverride[1] ?? ''
    return [primary, secondary]
  }

  const trimmed = value.trim()
  if (!trimmed) return ['TEN', 'Blog']

  const words = trimmed.split(/\s+/).filter(Boolean)

  if (words.length === 1) {
    const single = words[0]
    const parts = single.split(/[-–—]/).filter(Boolean)
    if (parts.length >= 2) {
      return [parts[0], parts[1]]
    }
    return [single, '']
  }

  return [words[0], words[1]]
}

export type BlogFrontmatterMeta = {
  title: string
  description?: string
  author?: string
  date?: Date | string
  coverImage?: string
  coverImageAlt?: string
  accentColor?: string
  accentWords?: string | string[]
  featuredLabel?: string
  articleLabel?: string
}

type CoverArtworkProps = {
  articleLabel: string
  accentColor: HexColor
  coverImage?: string
  coverImageAlt: string
  featured?: boolean
  accentWords?: string | string[]
  title: string
  showLabel?: boolean
}

export function CoverArtwork({
  accentColor,
  coverImage,
  coverImageAlt,
  featured,
  articleLabel,
  accentWords,
  title,
  showLabel = true
}: CoverArtworkProps) {
  const highlight = mixHexColors(accentColor, '#ffffff', 0.35)
  const glow = mixHexColors(accentColor, '#ffffff', 0.55)
  const deep = mixHexColors(accentColor, '#000000', 0.3)
  const ambient = mixHexColors(accentColor, '#f8fafc', 0.6)
  const lowlight = mixHexColors(accentColor, '#0f172a', 0.35)
  const gradientTilt = 120 + ((hashString(title) % 40) - 20)
  const softSweep = 45 + ((hashString(`${title}-sweep`) % 35) - 17)
  const [primaryWord, secondaryWord] = getPrimaryWords(title, accentWords)
  const wordContainerClass = featured
    ? 'relative z-20 flex flex-col items-center gap-2 text-center uppercase tracking-[0.28em] text-white drop-shadow-[0_12px_28px_rgba(15,23,42,0.55)]'
    : 'relative z-10 flex flex-col items-center gap-1 text-center uppercase tracking-[0.35em] text-white/80'
  const primaryWordClass = featured
    ? 'text-3xl font-black leading-tight md:text-5xl lg:text-6xl transition-transform duration-300 group-hover/cover:-translate-y-1'
    : 'text-sm font-semibold md:text-base'
  const secondaryWordClass = featured
    ? 'text-lg font-semibold text-white/85 tracking-[0.18em] md:text-3xl md:tracking-[0.24em] transition-transform duration-300 group-hover/cover:translate-y-0.5'
    : 'text-xs font-semibold md:text-sm'

  return (
    <div className='relative flex h-full w-full items-center justify-center overflow-hidden'>
      {coverImage ? (
        <>
          <Image
            src={coverImage}
            alt={coverImageAlt}
            fill
            sizes={
              featured
                ? '(min-width: 1024px) 50vw, 100vw'
                : '(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw'
            }
            className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
            priority={featured}
          />
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-90' />
        </>
      ) : (
        <>
          <div
            className='absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105'
            style={{
              backgroundColor: accentColor,
              backgroundImage: `radial-gradient(circle at 20% 20%, ${glow}, transparent 55%), radial-gradient(circle at 80% 0%, ${highlight}, transparent 45%), linear-gradient(${gradientTilt}deg, ${accentColor}, ${deep})`
            }}
          />
          <div
            className='pointer-events-none absolute inset-0'
            style={{
              backgroundImage: `linear-gradient(${softSweep}deg, ${hexToRgba(
                glow,
                0.28
              )}, transparent 60%), radial-gradient(75% 95% at 15% 85%, ${hexToRgba(
                ambient,
                0.32
              )}, transparent 70%), radial-gradient(circle at 85% -15%, ${hexToRgba(
                lowlight,
                0.3
              )}, transparent 60%)`
            }}
          />
          <div
            className='-left-16 pointer-events-none absolute top-6 h-36 w-36 rounded-full opacity-60 blur-3xl'
            style={{ background: hexToRgba(glow, 0.55) }}
          />
          <div
            className='-bottom-20 pointer-events-none absolute right-0 h-44 w-44 rounded-full opacity-45 blur-[100px]'
            style={{ background: hexToRgba(lowlight, 0.45) }}
          />
          <div
            className='pointer-events-none absolute inset-0 opacity-15 mix-blend-soft-light'
            style={{
              backgroundImage:
                'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADtgGpGvxuugAAAABJRU5ErkJggg==")',
              backgroundSize: '120px'
            }}
          />
          <div className='pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/25' />
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/10' />
          <div className={wordContainerClass}>
            <span className={primaryWordClass}>{primaryWord}</span>
            {secondaryWord && (
              <span className={secondaryWordClass}>{secondaryWord}</span>
            )}
          </div>
        </>
      )}
      {showLabel && (
        <div className='pointer-events-none absolute top-4 left-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 font-semibold text-[0.65rem] text-gray-700 uppercase tracking-wide shadow-sm backdrop-blur'>
          {articleLabel}
        </div>
      )}
    </div>
  )
}

type AuthorBadgeProps = {
  accentColor: HexColor
  authorName: string
  published: string
  tone?: 'light' | 'dark'
}

export function AuthorBadge({
  accentColor,
  authorName,
  published,
  tone = 'dark'
}: AuthorBadgeProps) {
  const badgeStart = mixHexColors(accentColor, '#ffffff', 0.25)
  const badgeEnd = mixHexColors(accentColor, '#000000', 0.3)
  const textColor = getReadableTextColor(badgeEnd)
  const initials = getInitials(authorName)
  const primaryTextClass =
    tone === 'light'
      ? 'font-medium text-white text-sm'
      : 'font-medium text-foreground text-sm'
  const secondaryTextClass =
    tone === 'light' ? 'text-white/80 text-xs' : 'text-muted-foreground text-xs'

  return (
    <div className='flex items-center gap-3'>
      <div
        className='group-hover:-translate-y-0.5 flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm shadow-sm transition-transform duration-300'
        style={{
          backgroundImage: `linear-gradient(135deg, ${badgeStart}, ${badgeEnd})`,
          color: textColor
        }}
      >
        {initials}
      </div>
      <div className='flex flex-col leading-tight'>
        <span className={primaryTextClass}>{authorName}</span>
        <span className={secondaryTextClass}>{published}</span>
      </div>
    </div>
  )
}

type ModernPaintingBannerProps = {
  accentColor: HexColor
  children: ReactNode
  className?: string
  height?: number
}

export function ModernPaintingBanner({
  accentColor,
  children,
  className,
  height
}: ModernPaintingBannerProps) {
  const highlight = mixHexColors(accentColor, '#ffffff', 0.35)
  const glow = mixHexColors(accentColor, '#ffffff', 0.58)
  const deep = mixHexColors(accentColor, '#000000', 0.32)
  const ambient = mixHexColors(accentColor, '#f8fafc', 0.66)
  const lowlight = mixHexColors(accentColor, '#0f172a', 0.38)
  const gradientTilt = 115 + ((hashString(`${accentColor}-banner`) % 42) - 21)
  const sweepTilt = 38 + ((hashString(`${accentColor}-sweep`) % 28) - 14)

  return (
    <div
      className={cn('relative overflow-hidden border-border/60', className)}
      style={{
        minHeight: height,
        backgroundColor: mixHexColors(accentColor, '#0f172a', 0.12)
      }}
    >
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          backgroundColor: accentColor,
          backgroundImage: `radial-gradient(circle at 15% 18%, ${hexToRgba(
            glow,
            0.55
          )}, transparent 58%), radial-gradient(circle at 84% 6%, ${hexToRgba(
            highlight,
            0.48
          )}, transparent 46%), linear-gradient(${gradientTilt}deg, ${accentColor}, ${deep})`
        }}
      />

      <div
        className='-left-20 pointer-events-none absolute top-10 h-[18rem] w-[18rem] rounded-full opacity-60 blur-3xl'
        style={{ background: hexToRgba(glow, 0.68) }}
      />
      <div
        className='-bottom-24 pointer-events-none absolute right-0 h-[20rem] w-[20rem] rounded-full opacity-50 blur-[120px]'
        style={{ background: hexToRgba(lowlight, 0.6) }}
      />

      <div
        className='pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light'
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADtgGpGvxuugAAAABJRU5ErkJggg==")',
          backgroundSize: '140px'
        }}
      />

      <div className='-skew-x-[12deg] pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-white/15 via-white/4 to-transparent' />

      <div className='relative'>
        <div
          className='absolute inset-0 mix-blend-overlay'
          style={{
            backgroundImage: `linear-gradient(145deg, ${hexToRgba(
              glow,
              0.12
            )}, transparent 55%), linear-gradient(${sweepTilt}deg, ${hexToRgba(
              ambient,
              0.28
            )}, transparent 70%)`
          }}
        />
        <div className='relative flex h-full flex-col justify-center gap-8 px-6 py-12 md:px-12 lg:px-20'>
          <div className='h-[2px] w-14 rounded-full bg-gradient-to-r from-white/70 to-transparent' />
          {children}
          <div className='h-[2px] w-24 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent' />
        </div>
      </div>
    </div>
  )
}
