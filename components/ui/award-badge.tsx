'use client'

import confetti from 'canvas-confetti'
import { type MouseEvent, useEffect, useRef, useState } from 'react'

type AwardBadgeType =
  | 'golden-kitty'
  | 'product-of-the-day'
  | 'product-of-the-month'
  | 'product-of-the-week'
  | 'github-trending'

interface AwardBadgeProps {
  link?: string
  place?: number
  label?: string
  type: AwardBadgeType
}

const identityMatrix =
  '1, 0, 0, 0, ' + '0, 1, 0, 0, ' + '0, 0, 1, 0, ' + '0, 0, 0, 1'

const maxRotate = 0.25
const minRotate = -0.25
const maxScale = 1
const minScale = 0.97

const backgroundColor = ['#f3e3ac', '#ddd', '#f1cfa6'] as const

const defaultTitle: Record<AwardBadgeType, string> = {
  'golden-kitty': 'Golden Kitty Awards',
  'product-of-the-day': 'Product of the Day',
  'product-of-the-month': 'Product of the Month',
  'product-of-the-week': 'Product of the Week',
  'github-trending': '#1 Repository Of The Day'
}

export const AwardBadge = ({ type, place, link, label }: AwardBadgeProps) => {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [firstOverlayPosition, setFirstOverlayPosition] = useState(0)
  const [matrix, setMatrix] = useState(identityMatrix)
  const [currentMatrix, setCurrentMatrix] = useState(identityMatrix)
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] =
    useState(true)
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState(false)
  const [isTimeoutFinished, setIsTimeoutFinished] = useState(false)
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getDimensions = () => {
    const left = ref.current?.getBoundingClientRect()?.left ?? 0
    const right = ref.current?.getBoundingClientRect()?.right ?? 0
    const top = ref.current?.getBoundingClientRect()?.top ?? 0
    const bottom = ref.current?.getBoundingClientRect()?.bottom ?? 0

    return { left, right, top, bottom }
  }

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    const scale = [
      maxScale -
        ((maxScale - minScale) * Math.abs(xCenter - clientX)) /
          (xCenter - left || 1),
      maxScale -
        ((maxScale - minScale) * Math.abs(yCenter - clientY)) /
          (yCenter - top || 1),
      maxScale -
        ((maxScale - minScale) *
          (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          (xCenter - left + yCenter - top || 1)
    ]

    const rotate = {
      x1:
        0.25 * ((yCenter - clientY) / yCenter - (xCenter - clientX) / xCenter),
      x2:
        maxRotate -
        ((maxRotate - minRotate) * Math.abs(right - clientX)) /
          (right - left || 1),
      x3: 0,
      y0: 0,
      y2:
        maxRotate -
        ((maxRotate - minRotate) * (top - clientY)) / (top - bottom || 1),
      y3: 0,
      z0: -(
        maxRotate -
        ((maxRotate - minRotate) * Math.abs(right - clientX)) /
          (right - left || 1)
      ),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom || 1),
      z3: 0
    }

    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    )
  }

  const getOppositeMatrix = (
    matrixString: string,
    clientY: number,
    onMouseEnter?: boolean
  ) => {
    const { top, bottom } = getDimensions()
    const oppositeY = bottom - clientY + top
    const weakening = onMouseEnter ? 0.7 : 4
    const multiplier = onMouseEnter ? -1 : 1

    return matrixString
      .split(', ')
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return (-Number.parseFloat(item) * multiplier) / weakening
        }

        if (index === 0 || index === 5 || index === 10) {
          return 1
        }

        if (index === 6) {
          return (
            (multiplier *
              (maxRotate -
                ((maxRotate - minRotate) * (top - oppositeY)) /
                  (top - bottom || 1))) /
            weakening
          )
        }

        if (index === 9) {
          return (
            (maxRotate -
              ((maxRotate - minRotate) * (top - oppositeY)) /
                (top - bottom || 1)) /
            weakening
          )
        }

        return Number.parseFloat(item)
      })
      .join(', ')
  }

  const triggerConfetti = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') {
      return
    }

    const count = 80
    const defaults = {
      origin: {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight
      },
      scalar: 0.7
    }

    const fire = (particleRatio: number, options: confetti.Options = {}) => {
      void confetti({
        ...defaults,
        ...options,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 24, startVelocity: 26 })
    fire(0.2, { spread: 36, startVelocity: 22 })
    fire(0.2, { spread: 48, startVelocity: 20, decay: 0.94 })
    fire(0.35, { spread: 60, startVelocity: 28 })
  }

  const badgeNumber = place ?? (type === 'github-trending' ? 1 : undefined)

  const onMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    triggerConfetti(event)

    if (leaveTimeout1.current) {
      clearTimeout(leaveTimeout1.current)
    }

    if (leaveTimeout2.current) {
      clearTimeout(leaveTimeout2.current)
    }

    if (leaveTimeout3.current) {
      clearTimeout(leaveTimeout3.current)
    }

    setDisableOverlayAnimation(true)

    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    setDisableInOutOverlayAnimation(false)
    enterTimeout.current = setTimeout(
      () => setDisableInOutOverlayAnimation(true),
      350
    )

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition(
          (Math.abs(xCenter - event.clientX) +
            Math.abs(yCenter - event.clientY)) /
            1.5
        )
      })
    })

    const matrixValue = getMatrix(event.clientX, event.clientY)
    const oppositeMatrix = getOppositeMatrix(matrixValue, event.clientY, true)

    setMatrix(oppositeMatrix)
    setIsTimeoutFinished(false)
    setTimeout(() => {
      setIsTimeoutFinished(true)
    }, 200)
  }

  const onMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    setTimeout(() => {
      setFirstOverlayPosition(
        (Math.abs(xCenter - event.clientX) +
          Math.abs(yCenter - event.clientY)) /
          1.5
      )
    }, 150)

    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(event.clientX, event.clientY))
    }
  }

  const onMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    const oppositeMatrix = getOppositeMatrix(matrix, event.clientY)

    if (enterTimeout.current) {
      clearTimeout(enterTimeout.current)
    }

    setCurrentMatrix(oppositeMatrix)
    setTimeout(() => setCurrentMatrix(identityMatrix), 200)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false)
        leaveTimeout1.current = setTimeout(
          () => setFirstOverlayPosition(-firstOverlayPosition / 4),
          150
        )
        leaveTimeout2.current = setTimeout(
          () => setFirstOverlayPosition(0),
          300
        )
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false)
          setDisableInOutOverlayAnimation(true)
        }, 500)
      })
    })
  }

  useEffect(() => {
    if (isTimeoutFinished) {
      setMatrix(currentMatrix)
    }
  }, [currentMatrix, isTimeoutFinished])

  useEffect(() => {
    return () => {
      if (enterTimeout.current) {
        clearTimeout(enterTimeout.current)
      }

      if (leaveTimeout1.current) {
        clearTimeout(leaveTimeout1.current)
      }

      if (leaveTimeout2.current) {
        clearTimeout(leaveTimeout2.current)
      }

      if (leaveTimeout3.current) {
        clearTimeout(leaveTimeout3.current)
      }
    }
  }, [])

  const overlayFillColors = [
    'hsl(358, 100%, 62%)',
    'hsl(30, 100%, 50%)',
    'hsl(60, 100%, 50%)',
    'hsl(96, 100%, 50%)',
    'hsl(233, 85%, 47%)',
    'hsl(271, 85%, 47%)',
    'hsl(300, 20%, 35%)',
    'transparent',
    'transparent',
    'white'
  ] as const

  const overlayAnimations = Array.from(
    { length: 10 },
    (_, index) => `
    @keyframes overlayAnimation${index + 1} {
      0% {
        transform: rotate(${index * 10}deg);
      }
      50% {
        transform: rotate(${(index + 1) * 10}deg);
      }
      100% {
        transform: rotate(${index * 10}deg);
      }
    }
    `
  ).join(' ')

  return (
    <a
      ref={ref}
      href={link}
      target='_blank'
      rel={link ? 'noreferrer' : undefined}
      className='block h-auto w-[180px] cursor-pointer sm:w-[260px]'
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <style>{overlayAnimations}</style>
      <div
        style={{
          transform: `perspective(700px) matrix3d(${matrix})`,
          transformOrigin: 'center center',
          transition: 'transform 200ms ease-out'
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 260 54'
          className='h-auto w-[180px] sm:w-[260px]'
        >
          <defs>
            <filter id='blur1'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='3' />
            </filter>
            <mask id='badgeMask'>
              <rect width='260' height='54' fill='white' rx='10' />
            </mask>
          </defs>
          <rect
            width='260'
            height='54'
            rx='10'
            fill={backgroundColor[(place ?? 2) - 1] ?? backgroundColor[1]}
          />
          <rect
            x='4'
            y='4'
            width='252'
            height='46'
            rx='8'
            fill='transparent'
            stroke='#bbb'
            strokeWidth='1'
          />
          <text
            fontFamily='Helvetica-Bold, Helvetica'
            fontSize='9'
            fontWeight='bold'
            fill='#666'
            x='53'
            y='20'
          >
            GITHUB TRENDING
          </text>
          <text
            fontFamily='Helvetica-Bold, Helvetica'
            fontSize='16'
            fontWeight='bold'
            fill='#666'
            x='52'
            y='40'
          >
            {label ?? defaultTitle[type]}
            {place && ` #${place}`}
          </text>
          <g transform='translate(8, 9)'>
            <path
              fill='#666'
              d='M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037'
            />
            {badgeNumber !== undefined && (
              <text
                x='18'
                y='24'
                fontFamily='Helvetica-Bold, Helvetica'
                fontSize='14'
                fontWeight='bold'
                fill='#666'
                textAnchor='middle'
              >
                {badgeNumber}
              </text>
            )}
          </g>
          <g style={{ mixBlendMode: 'overlay' }} mask='url(#badgeMask)'>
            {Array.from({ length: 10 }).map((_, index) => {
              const rotation = firstOverlayPosition + index * 10

              return (
                <g
                  key={index}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: !disableInOutOverlayAnimation
                      ? 'transform 200ms ease-out'
                      : 'none',
                    animation: disableOverlayAnimation
                      ? 'none'
                      : `overlayAnimation${index + 1} 5s infinite`,
                    willChange: 'transform'
                  }}
                >
                  <polygon
                    points='0,0 260,54 260,0 0,54'
                    fill={overlayFillColors[index]}
                    filter='url(#blur1)'
                    opacity='0.5'
                  />
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </a>
  )
}
