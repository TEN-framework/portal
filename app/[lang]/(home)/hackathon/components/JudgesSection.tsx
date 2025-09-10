'use client'

import { ClipboardList } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export function JudgesSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  return (
    <section className={cn('bg-white py-16 dark:bg-gray-950', className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-8 font-bold text-4xl text-gray-900 dark:text-white">
            {/* Use existing i18n title with requested suffix */}
            <span className="mr-2">📝</span>
            {t('judges.title')}（TBA）
          </h2>

          <div className="mx-auto rounded-2xl border border-gray-200 bg-white p-8 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-black text-white dark:border-gray-700 dark:bg-white dark:text-black">
                <ClipboardList className="h-6 w-6" />
              </div>
            </div>
            <p className="text-lg opacity-90">{t('judges.tba')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
