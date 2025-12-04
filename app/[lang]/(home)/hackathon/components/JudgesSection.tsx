'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function JudgesSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')
  const judgeKeys = ['plutoless', 'hermes', 'kiroTeam'] as const
  const judges = judgeKeys.map((key) => {
    const full = t(`judges.${key}`)
    const parts = full.split(/,|，/)
    const name = parts[0]?.trim() || full
    const role = parts.slice(1).join(',').trim()
    const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('')
    return { key, name, role, initials }
  })

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
          <h2 className='mb-8 font-bold text-4xl text-gray-900 dark:text-white'>
            <span className='mr-2'>📝</span>
            {t('judges.title')}
          </h2>

          <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
            {judges.map((j, index) => (
              <motion.div
                key={j.key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                viewport={{ once: true }}
                className='rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
              >
                <div className='mb-4 flex items-center gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-black font-semibold text-white dark:border-gray-700 dark:bg-white dark:text-black'>
                    {j.initials || '☆'}
                  </div>
                  <div className='min-w-0'>
                    <div className='break-words font-semibold'>{j.name}</div>
                    {j.role && (
                      <div className='break-words text-sm opacity-80'>
                        {j.role}
                      </div>
                    )}
                  </div>
                </div>
                <span className='inline-block rounded-full border border-gray-200 px-2.5 py-1 text-xs opacity-80 dark:border-gray-700'>
                  {t('judges.badge')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
