'use client'

import { CalendarClock, ExternalLink, MessageCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function WorkshopSection({ className }: { className?: string }) {
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
          <h2 className="mb-6 font-bold text-4xl text-gray-900 dark:text-white">
            {t('workshop.title')}
          </h2>

          <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
            <CalendarClock className="h-5 w-5" />
            <span className="font-medium">{t('workshop.timeLabel')}</span>
            <span>{t('workshop.time')}</span>
          </div>

          <div className="mx-auto mb-8 max-w-3xl text-gray-700 text-lg dark:text-gray-300">
            <p className="mb-3">{t('workshop.desc1')}</p>
            <p className="mb-3">{t('workshop.desc2')}</p>
            <p>{t('workshop.desc3')}</p>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2 bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black"
              asChild
            >
              <a
                href="https://discord.gg/8AJkU7cU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {t('workshop.joinDiscord')}
                <ExternalLink className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
