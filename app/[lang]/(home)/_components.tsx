'use client'

import { ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { AwardBadge } from '@/components/ui/award-badge'

import { Button } from '@/components/ui/button'
import {
  HUGGING_FACE_SPACE,
  URL_TEN_AGENT,
  URL_TEN_TURN_DETECTION,
  URL_TEN_VAD
} from '@/constants'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'
import { SAMPLE_PROJECTS } from './sample-projects'

const TITLES = ['titleLowlantency', 'titleMultimodal', 'titleEdgeCloud']
const awardLink = 'https://github.com/ten-framework/ten-framework'

const titleVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: (direction: number) => ({
    y: direction > 0 ? -150 : 150,
    opacity: 0
  })
}

export function ProjectsShowcase(props: { className?: string }) {
  const { className } = props

  return (
    <div
      className={cn(
        'w-full bg-gray-50/50 py-20 dark:bg-gray-900/50',
        className
      )}
    >
      <div className='container mx-auto px-4'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 font-bold text-4xl text-black tracking-tight'>
            From the Community
          </h2>
          <p className='mx-auto max-w-2xl text-black text-lg'>
            Discover amazing projects built with TEN Framework
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {SAMPLE_PROJECTS.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className='group hover:-translate-y-1 relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20'>
                <div className='flex h-full items-center justify-center text-gray-400'>
                  <div className='text-center'>
                    <div className='text-sm'>Preview</div>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <div className='mb-3 flex items-center justify-between'>
                  <span className='inline-block rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300'>
                    {project.category}
                  </span>
                  <span className='text-gray-500 text-sm dark:text-gray-400'>
                    {project.remixes} Remixes
                  </span>
                </div>

                <h3 className='mb-2 font-semibold text-gray-900 text-lg transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                  {project.title}
                </h3>

                <p className='mb-4 line-clamp-2 text-gray-600 text-sm dark:text-gray-300'>
                  {project.description}
                </p>

                <div className='flex items-center gap-2'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300'>
                    {project.author.charAt(0).toUpperCase()}
                  </div>
                  <span className='text-gray-600 text-sm dark:text-gray-400'>
                    {project.author}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Button variant='outline' size='lg' className='gap-2'>
            View All Projects
            <ExternalLink className='h-4 w-4' />
          </Button>
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
        <div className='flex flex-col items-center justify-center gap-4 py-0 sm:py-1 md:gap-6 md:py-2 lg:py-3 xl:py-4 2xl:py-6'>
          <div>
            <Button
              variant='secondary'
              size='sm'
              className='h-auto gap-2 bg-blue-600/[0.05] px-3 py-2 text-blue-600 transition-all duration-600 hover:scale-105 hover:bg-blue-600/[0.08] hover:text-blue-500 sm:h-8 sm:px-4 sm:py-0'
              asChild
            >
              <span className='inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 whitespace-normal text-center'>
                🎉{' '}
                <Link
                  href={URL_TEN_VAD}
                  className='font-medium text-blue-500 text-sm underline-offset-2 hover:underline sm:text-base dark:text-blue-300'
                >
                  TEN VAD
                </Link>
                <span className='font-medium text-blue-500 text-sm sm:text-base dark:text-blue-300'>
                  and
                </span>
                <Link
                  href={URL_TEN_TURN_DETECTION}
                  className='font-medium text-blue-500 text-sm underline-offset-2 hover:underline sm:text-base dark:text-blue-300'
                >
                  TEN Turn Detection
                </Link>
                <span className='font-medium text-blue-500 text-sm sm:text-base dark:text-blue-300'>
                  are now part of the TEN open-source ecosystem!
                </span>
              </span>
            </Button>
          </div>

          <div className='relative z-10 flex flex-col items-center gap-4'>
            <div className='flex flex-wrap items-center justify-center gap-6'>
              <AwardBadge type='github-trending' link={awardLink} />
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            <h1 className='text-center font-regular text-4xl tracking-tight md:text-5xl lg:text-6xl'>
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

          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button size='lg' className='gap-4' asChild>
              <Link href={URL_TEN_AGENT} target='_blank'>
                {t('heroBtnTryTenAgent')}
                <ExternalLink className='size-4' />
              </Link>
            </Button>
            <Button size='lg' className='gap-4' variant='outline' asChild>
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
