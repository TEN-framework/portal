'use client'

import { Headphones, Heart, Home } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function ChallengeSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const examples = [
    {
      icon: <Headphones className='h-8 w-8' />,
      title: t('challenge.serviceAgents'),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient:
        'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      icon: <Home className='h-8 w-8' />,
      title: t('challenge.iotHardware'),
      gradient: 'from-green-500 to-emerald-500',
      bgGradient:
        'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      icon: <Heart className='h-8 w-8' />,
      title: t('challenge.emotionalCompanions'),
      gradient: 'from-purple-500 to-pink-500',
      bgGradient:
        'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    }
  ]

  return (
    <section className={cn('bg-gray-50 py-16 dark:bg-gray-900', className)}>
      <div className='container mx-auto max-w-[72rem] px-6'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className='mx-auto max-w-4xl text-center'
        >
          <h2 className='mb-8 font-bold text-4xl text-gray-900 dark:text-white'>
            {t('challenge.title')}
          </h2>
          <p className='mb-12 text-gray-600 text-lg leading-relaxed dark:text-gray-300'>
            {t('challenge.description')}
          </p>
        </motion.div>

        {/* Examples Title */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className='mb-8 text-center'
        >
          <h3 className='font-semibold text-2xl text-gray-800 dark:text-gray-200'>
            {t('challenge.examples')}
          </h3>
        </motion.div>

        {/* Examples Grid */}
        <div className='grid gap-8 md:grid-cols-3'>
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 * index }}
              viewport={{ once: true }}
              className='rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800'
            >
              <div className=''>
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-black text-white dark:border-gray-700 dark:bg-white dark:text-black`}
                >
                  {example.icon}
                </div>
                <p className='font-semibold text-gray-800 text-lg leading-relaxed dark:text-gray-200'>
                  {example.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
