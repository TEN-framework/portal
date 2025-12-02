'use client'

import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { AwardBadge } from '@/components/ui/award-badge'

import { Button } from '@/components/ui/button'
import { HUGGING_FACE_SPACE, URL_TEN_AGENT } from '@/constants'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'
import { SAMPLE_PROJECTS } from './sample-projects'

const awardLink = 'https://github.com/ten-framework/ten-framework'
const TITLES = ['titleLowlantency', 'titleMultimodal', 'titleEdgeCloud']
const titleVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: (direction: number) => ({
    y: direction > 0 ? -150 : 150,
    opacity: 0
  })
}

export function ProjectsShowcase(props: { className?: string }) {
  const { className } = props
  const t = useTranslations('homePage')

  return (
    <div className={cn('w-full py-16 md:py-24', className)}>
      <div className='container mx-auto px-4'>
        <div className='rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-sm md:p-8'>
          <div className='mb-6 md:mb-8'>
            <h2 className='font-semibold text-xl tracking-tight md:text-2xl'>
              {t('communityTitle')}
            </h2>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4'>
            {SAMPLE_PROJECTS.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className='group hover:-translate-y-0.5 relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
              >
                <div className='aspect-video w-full overflow-hidden rounded-t-xl'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill={false}
                    width={480}
                    height={270}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                </div>

                <div className='p-5 md:p-6'>
                  <div className='mb-3 flex items-center justify-between'>
                    <span className='inline-block rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300'>
                      {project.category}
                    </span>
                  </div>

                  <h3 className='mb-2 font-semibold text-base text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                    {project.title}
                  </h3>

                  <p className='line-clamp-2 text-gray-600 text-xs dark:text-gray-300'>
                    {project.description}
                  </p>

                  <div className='mt-4 flex items-center gap-2'>
                    <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 font-medium text-[10px] text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
                      {project.author.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-gray-600 text-xs dark:text-gray-400'>
                      {project.author}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CapabilitiesShowcase(props: { className?: string }) {
  const { className } = props
  const t = useTranslations('homePage')

  const chips = [
    t('chipVoice'),
    t('chipMultimodal'),
    t('chipEdgeCloud'),
    t('chipProduction')
  ]

  const makeGradient = (from: string, to: string) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${from}'/><stop offset='100%' stop-color='${to}'/></linearGradient></defs><rect width='640' height='360' fill='url(%23g)'/></svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const items = [
    {
      title: t('capabilities1Title'),
      desc: t('capabilities1Desc'),
      image: makeGradient('#A5F3FC', '#93C5FD')
    },
    {
      title: t('capabilities2Title'),
      desc: t('capabilities2Desc'),
      image: makeGradient('#FDE68A', '#FCA5A5')
    },
    {
      title: t('capabilities3Title'),
      desc: t('capabilities3Desc'),
      image: makeGradient('#C4B5FD', '#60A5FA')
    },
    {
      title: t('capabilities4Title'),
      desc: t('capabilities4Desc'),
      image: makeGradient('#86EFAC', '#22D3EE')
    },
    {
      title: t('capabilities5Title'),
      desc: t('capabilities5Desc'),
      image: makeGradient('#FBCFE8', '#A7F3D0')
    },
    {
      title: t('capabilities6Title'),
      desc: t('capabilities6Desc'),
      image: makeGradient('#93C5FD', '#F59E0B')
    }
  ]

  return (
    <div className={cn('w-full py-12 md:py-16', className)}>
      <div className='container mx-auto px-4'>
        <div className='mb-8 text-center'>
          <h2 className='mb-3 font-bold text-4xl tracking-tight'>
            {t('capabilitiesTitle')}
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            {t('capabilitiesDescription')}
          </p>
        </div>

        <div className='mb-6 flex flex-wrap items-center justify-center gap-2'>
          {chips.map((c) => (
            <span
              key={c}
              className='inline-flex items-center rounded-full border border-border bg-card px-3 py-1 font-medium text-muted-foreground text-sm'
            >
              {c}
            </span>
          ))}
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {items.map((it) => {
            return (
              <div
                key={`cap-${it.title}`}
                className='group hover:-translate-y-1 relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800'
              >
                <div className='aspect-video w-full overflow-hidden rounded-t-2xl'>
                  <Image
                    src={it.image}
                    alt={it.title}
                    width={640}
                    height={360}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div className='p-6'>
                  <h3 className='mb-2 font-semibold text-gray-900 text-lg dark:text-white'>
                    {it.title}
                  </h3>
                  <p className='text-gray-600 text-sm dark:text-gray-300'>
                    {it.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

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
    <div className={cn('w-full text-foreground', className)}>
      <div className='container mx-auto'>
        <div className='flex flex-col items-center justify-center gap-2 py-1 md:gap-3 md:py-2 lg:py-3'>
          <div className='relative z-10 flex flex-col items-center gap-4'>
            <div className='flex flex-wrap items-center justify-center gap-6'>
              <AwardBadge type='github-trending' link={awardLink} />
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <h1 className='text-center font-regular text-3xl tracking-tight md:text-4xl lg:text-5xl'>
              <span className='font-medium text-spektr-cyan-50'>
                {t('titlePrefix')}
              </span>
              <span className='relative flex w-full justify-center overflow-hidden text-center leading-tight'>
                &nbsp;
                {TITLES.map((title, index) => (
                  <motion.span
                    key={`title-${title}`}
                    className='absolute font-bold'
                    initial='hidden'
                    animate={titleNumber === index ? 'visible' : 'hidden'}
                    variants={titleVariants}
                    custom={titleNumber > index ? 1 : -1}
                    transition={{
                      type: 'spring',
                      stiffness: 35,
                      duration: 0.5
                    }}
                  >
                    {t(title)}
                  </motion.span>
                ))}
              </span>
              <span className='font-medium text-spektr-cyan-50'>
                {t('titleSuffix')}
              </span>
            </h1>

            <p className='max-w-2xl text-center font-medium text-base text-muted-foreground leading-relaxed tracking-tight md:text-lg dark:text-gray-300'>
              {t('heroDescription')}
            </p>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row'>
            <Button className='gap-3' asChild>
              <Link href={URL_TEN_AGENT} target='_blank'>
                {t('heroBtnTryTenAgent')}
                <ExternalLink className='size-4' />
              </Link>
            </Button>
            <Button className='gap-3' variant='outline' asChild>
              <Link href={HUGGING_FACE_SPACE} target='_blank'>
                {t('huggingFaceSpace')}
                <ExternalLink className='size-4' />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
