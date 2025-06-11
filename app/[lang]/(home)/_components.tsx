'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import confetti from 'canvas-confetti'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/next-intl-navigation'
import { URL_TEN_AGENT, HUGGING_FACE_SPACE, URL_TEN_FAMILY } from '@/constants'

const TITLES = ['titleLowlantency', 'titleMultimodal', 'titleEdgeCloud']

const titleVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: (direction: number) => ({
    y: direction > 0 ? -150 : 150,
    opacity: 0,
  }),
}

const createConfetti = (e: React.MouseEvent) => {
  const count = 88;
  const defaults = {
    origin: {
      x: e.clientX / window.innerWidth,
      y: (e.clientY + 50) / window.innerHeight
    },
    scalar: 0.6
  };

  function fire(particleRatio: number, opts: confetti.Options = {}) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 20,
    startVelocity: 20,
  });
  fire(0.2, {
    spread: 35,
    startVelocity: 15,
  });
  fire(0.35, {
    spread: 30,
    decay: 0.91,
    scalar: 0.4,
    startVelocity: 15,
  });
  fire(0.1, {
    spread: 40,
    startVelocity: 10,
    decay: 0.92,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 40,
    startVelocity: 10,
  });
};

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
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 bg-blue-600/[0.05] text-blue-600 transition-all duration-600 hover:scale-105 hover:bg-blue-600/[0.08] hover:text-blue-500 py-7 sm:py-0"
              asChild
              onMouseEnter={(e) => createConfetti(e)}
            >
              <Link href={URL_TEN_FAMILY}>
                <span className="flex items-center gap-2">
                  🎉{' '}
                  <span className="font-medium text-blue-500 dark:text-blue-300 text-sm sm:text-base whitespace-normal">
                    {t('bannerAnnouncement')}
                  </span>
                </span>
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular text-center text-5xl tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50 font-medium">
                {t('titlePrefix')}
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center leading-tight md:leading-normal">
                &nbsp;
                {TITLES.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold"
                    initial="hidden"
                    animate={titleNumber === index ? 'visible' : 'hidden'}
                    variants={titleVariants}
                    custom={titleNumber > index ? 1 : -1}
                    transition={{
                      type: 'spring',
                      stiffness: 35,
                      duration: 0.5,
                    }}
                  >
                    {t(title)}
                  </motion.span>
                ))}
              </span>
              <span className="text-spektr-cyan-50 font-medium">
                {t('titleSuffix')}
              </span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed font-medium tracking-tight md:text-xl dark:text-gray-300">
              {t('heroDescription')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="gap-4" asChild>
              <Link href={URL_TEN_AGENT} target="_blank">
                {t('heroBtnTryTenAgent')}
                <ExternalLink className="size-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href={HUGGING_FACE_SPACE} target="_blank">
                {t('huggingFaceSpace')}
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground/100 max-w-2xl text-center text-sm leading-relaxed font-normal tracking-tight md:text-base dark:text-gray-300">
            {t('supportedBy')}{' '}
            <Link
              href="https://www.agora.io/en/"
              target="_blank"
              className="text-spektr-cyan-100 underline decoration-gray-300 underline-offset-5 hover:text-[#13C2FF] hover:decoration-[#13C2FF]"
            >
              Agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
