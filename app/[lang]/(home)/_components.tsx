'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { MoveRightIcon, BotMessageSquareIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/next-intl-navigation'
import { URL_TEN_AGENT, URL_TEN_FRAMEWORK_DOC, BLOG } from '@/constants'

const TITLES = [
  'titleRealtime',
  'titleMultimodel',
  'titleLowlantency',
  'titleHighperformance',
  'titleEdgeCloud',
]

export function Hero(props: { className?: string }) {
  const { className } = props

  const t = useTranslations('homePage')

  const [titleNumber, setTitleNumber] = React.useState(0)

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === TITLES.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber])

  return (
    <div className={cn('text-foreground w-full', className)}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 pt-16 pb-20 lg:pt-32 lg:pb-60">
          <div>
            <Button variant="secondary" size="sm" className="gap-4" asChild>
              <Link href={BLOG}>
                {t('readLaunchArticle')} <MoveRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">{t('titlePrefix')}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pt-2 md:pb-5">
                &nbsp;
                {TITLES.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {t(title)}
                  </motion.span>
                ))}
              </span>
              <span className="text-spektr-cyan-50">{t('titleSuffix')}</span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              {t('heroDescription')}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href={URL_TEN_AGENT} target="_blank">
                {t('heroBtnTryTenAgent')}
                <BotMessageSquareIcon className="size-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4" asChild>
              <Link href={URL_TEN_FRAMEWORK_DOC}>
                {t('heroBtnReadDoc')}
                <MoveRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode
  showRadialGradient?: boolean
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        'transition-bg relative flex flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={cn(
            `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        />
      </div>
      {children}
    </div>
  )
}
