'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Calendar, Clock, Users, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TimelineSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const timeline = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Registration Opens',
      description: t('timeline.registrationOpens'),
      date: 'Sept 4',
      color: 'neutral'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Submissions Open',
      description: t('timeline.submissionsOpen'),
      date: 'Sept 12',
      color: 'neutral'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Deadline',
      description: t('timeline.deadline'),
      date: 'Sept 26',
      color: 'neutral'
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'Winners Announced',
      description: t('timeline.winnersAnnounced'),
      date: 'Oct 15',
      color: 'neutral'
    }
  ]

  return (
    <section className={cn('py-16 bg-white dark:bg-gray-950 ', className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-12 text-4xl font-bold text-gray-900 dark:text-white">
            {t('timeline.title')}
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-4xl">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-700 md:block"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:flex-row`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} text-center`}>
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                    <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                      {item.date}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Central Icon */}
                <div className="relative mx-0 my-4 md:my-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700`}>
                    {item.icon}
                  </div>
                  {/* Connecting dots for mobile */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-1/2 top-12 h-8 w-px -translate-x-1/2 bg-gray-300 dark:bg-gray-600 md:hidden"></div>
                  )}
                </div>

                {/* Spacer for desktop */}
                <div className="hidden w-5/12 md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Workshops Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 rounded-xl bg-black p-8 text-white dark:bg-black"
        >
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold">{t('timeline.workshops')}</h3>
            <p className="mb-6 text-lg opacity-90">
              {t('timeline.workshopsDesc')}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3">
              <Users className="h-5 w-5" />
              <span className="font-semibold">Join our Discord for updates!</span>
            </div>
          </div>
        </motion.div>

        {/* Judging Period */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.35 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{t('timeline.judging')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
