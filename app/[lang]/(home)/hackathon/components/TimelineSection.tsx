'use client'

import { Calendar, Clock, Trophy, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function TimelineSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const timeline: Array<{
    icon: ReactNode
    title: string
    date: string
    color: string
    description?: string
  }> = [
    {
      icon: <Calendar className='h-6 w-6' />,
      title: 'Registration Period',
      date: 'Sept 10 – Sept 21, 23:59 PDT (Sept 22, 06:59 UTC)',
      color: 'neutral'
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Submission Period',
      date: 'Sept 15 – Sept 28, 23:59 PDT (Sept 29, 06:59 UTC)',
      color: 'neutral'
    },
    {
      icon: <Users className='h-6 w-6' />,
      title: 'Judging',
      date: 'Sept 29 – Sept 30, 2025',
      color: 'neutral'
    },
    {
      icon: <Trophy className='h-6 w-6' />,
      title: 'Winners Announced',
      date: 'Oct 13, 2025',
      color: 'neutral'
    }
  ]

  return (
    <section className={cn('bg-white py-16 dark:bg-gray-950', className)}>
      <div className='container mx-auto max-w-[72rem] px-6'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className='mx-auto max-w-4xl text-center'
        >
          <h2 className='mb-12 font-bold text-4xl text-gray-900 dark:text-white'>
            {t('timeline.title')}
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className='relative mx-auto max-w-4xl'>
          {/* Vertical Line */}
          <div className='-translate-x-1/2 absolute top-0 left-1/2 hidden h-full w-px bg-gray-200 md:block dark:bg-gray-700'></div>

          {/* Timeline Items */}
          <div className='space-y-12'>
            {timeline.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:flex-row`}
              >
                {/* Content Card */}
                <div
                  className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} text-center`}
                >
                  <div className='rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='mb-4 font-bold text-2xl text-gray-900 dark:text-white'>
                      {item.date}
                    </div>
                    <h3 className='mb-2 font-semibold text-gray-800 text-xl dark:text-gray-200'>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className='text-gray-600 dark:text-gray-400'>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Central Icon */}
                <div className='relative mx-0 my-4 md:my-0'>
                  <div
                    className={
                      'flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-black text-white dark:border-gray-700 dark:bg-white dark:text-black'
                    }
                  >
                    {item.icon}
                  </div>
                  {/* Connecting dots for mobile */}
                  {index < timeline.length - 1 && (
                    <div className='-translate-x-1/2 absolute top-12 left-1/2 h-8 w-px bg-gray-300 md:hidden dark:bg-gray-600' />
                  )}
                </div>

                {/* Spacer for desktop */}
                <div className='hidden w-5/12 md:block' />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
