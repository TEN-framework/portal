import Image from 'next/image'

export const accentPalette = ['#f97316', '#6366f1', '#ec4899', '#10b981', '#facc15', '#0ea5e9']
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
    b: intValue & 255,
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

export function mixHexColors(color: HexColor, mixWith: HexColor, weight: number): HexColor {
  const ratio = clamp(weight, 0, 1)
  const rgbBase = hexToRgb(color)
  const rgbMix = hexToRgb(mixWith)

  if (!rgbBase || !rgbMix) {
    return color
  }

  return rgbToHex({
    r: rgbBase.r * (1 - ratio) + rgbMix.r * ratio,
    g: rgbBase.g * (1 - ratio) + rgbMix.g * ratio,
    b: rgbBase.b * (1 - ratio) + rgbMix.b * ratio,
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
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }

  const r = toLinear(rgb.r)
  const g = toLinear(rgb.g)
  const b = toLinear(rgb.b)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getReadableTextColor(background: HexColor) {
  return getLuminance(background) > 0.5 ? '#0f172a' : '#f8fafc'
}

export function getAccentColor(preferred: string | undefined, key: string): HexColor {
  if (preferred && hexColorRegex.test(preferred)) {
    return preferred
  }
  const paletteIndex = hashString(key) % accentPalette.length
  return accentPalette[paletteIndex]
}

export function getPrimaryWords(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ['TEN', 'Blog']

  const words = trimmed.split(/\s+/).filter(Boolean)

  if (words.length === 1) {
    const single = words[0]
    const parts = single.split(/[\-–—]/).filter(Boolean)
    if (parts.length >= 2) {
      return [parts[0], parts[1]]
    }
    return [single, '']
  }

  return [words[0], words[1]]
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

export type BlogFrontmatterMeta = {
  title: string
  description?: string
  author?: string
  date?: Date | string
  coverImage?: string
  coverImageAlt?: string
  accentColor?: string
}

type CoverArtworkProps = {
  articleLabel: string
  accentColor: HexColor
  coverImage?: string
  coverImageAlt: string
  featured?: boolean
  title: string
  showLabel?: boolean
}

export function CoverArtwork({
  accentColor,
  coverImage,
  coverImageAlt,
  featured,
  articleLabel,
  title,
  showLabel = true,
}: CoverArtworkProps) {
  const highlight = mixHexColors(accentColor, '#ffffff', 0.35)
  const glow = mixHexColors(accentColor, '#ffffff', 0.55)
  const deep = mixHexColors(accentColor, '#000000', 0.3)
  const textColor = getReadableTextColor(deep)
  const [primaryWord, secondaryWord] = getPrimaryWords(title)
  const displayPrimary = primaryWord.toUpperCase()
  const displaySecondary = secondaryWord.toUpperCase()

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
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
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority={featured}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-90" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              backgroundColor: accentColor,
              backgroundImage: `radial-gradient(circle at 20% 20%, ${glow}, transparent 55%), radial-gradient(circle at 80% 0%, ${highlight}, transparent 45%), linear-gradient(135deg, ${accentColor}, ${deep})`,
            }}
          />
          <div
            className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full opacity-50 blur-3xl"
            style={{ background: glow }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full opacity-40 blur-3xl"
            style={{ background: deep }}
          />
          <div
            className="relative z-10 flex flex-col items-center gap-2 text-center uppercase tracking-[0.3em] drop-shadow-md"
            style={{ color: textColor }}
          >
            <span className="text-4xl font-semibold md:text-5xl">{displayPrimary}</span>
            {displaySecondary && (
              <span className="text-3xl font-semibold md:text-4xl">{displaySecondary}</span>
            )}
          </div>
        </>
      )}
      {showLabel && (
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-700 shadow-sm backdrop-blur">
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
}

export function AuthorBadge({ accentColor, authorName, published }: AuthorBadgeProps) {
  const badgeStart = mixHexColors(accentColor, '#ffffff', 0.25)
  const badgeEnd = mixHexColors(accentColor, '#000000', 0.3)
  const textColor = getReadableTextColor(badgeEnd)
  const initials = getInitials(authorName)

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{
          backgroundImage: `linear-gradient(135deg, ${badgeStart}, ${badgeEnd})`,
          color: textColor,
        }}
      >
        {initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-medium text-foreground text-sm">{authorName}</span>
        <span className="text-muted-foreground text-xs">{published}</span>
      </div>
    </div>
  )
}
