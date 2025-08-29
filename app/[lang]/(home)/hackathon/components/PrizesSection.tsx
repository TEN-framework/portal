'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Trophy, Award, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PrizesSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const prizes = [
    {
      place: 'first',
      icon: <Trophy className="h-8 w-8" />,
      emoji: '🥇',
      title: t('prizes.firstPlace.title'),
      amount: t('prizes.firstPlace.amount'),
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      scale: 'lg:scale-110',
      order: 'lg:order-2'
    },
    {
      place: 'second',
      icon: <Award className="h-8 w-8" />,
      emoji: '🥈',
      title: t('prizes.secondPlace.title'),
      amount: t('prizes.secondPlace.amount'),
      gradient: 'from-gray-400 to-gray-600',
      bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
      scale: '',
      order: 'lg:order-1'
    },
    {
      place: 'third',
      icon: <Star className="h-8 w-8" />,
      emoji: '🥉',
      title: t('prizes.thirdPlace.title'),
      amount: t('prizes.thirdPlace.amount'),
      gradient: 'from-amber-600 to-yellow-800',
      bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      scale: '',
      order: 'lg:order-3'
    }
  ]

  return (
    <section className={cn('py-16 bg-gray-50 dark:bg-gray-900 ', className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {t('prizes.title')}
          </h2>
          <p className="mb-12 text-xl font-semibold text-green-600 dark:text-green-400">
            💰 USD 11,000 Total Prize Pool
          </p>
        </motion.div>

        {/* Main Prizes */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 ${prize.order} relative overflow-hidden`}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(45deg, ${prize.gradient.includes('yellow') ? '#fbbf24' : prize.gradient.includes('gray') ? '#6b7280' : '#d97706'}, ${prize.gradient.includes('orange') ? '#f97316' : prize.gradient.includes('slate') ? '#475569' : '#92400e'})`
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="text-center relative z-10">
                <motion.div 
                  className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {prize.icon}
                </motion.div>
                <h3 className="mb-2 text-base font-medium text-gray-800 dark:text-gray-200">
                  {prize.title}
                </h3>
                <motion.div 
                  className="text-2xl font-semibold text-gray-900 dark:text-white"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {prize.amount}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Award */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8"
        >
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="mb-4 text-3xl md:mb-0 md:mr-6">
              ⚙️
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">{t('prizes.technical.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">For projects using TEN VAD or Turn Detection features</p>
            </div>
            <div className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white md:mt-0">
              {t('prizes.technical.amount')}
            </div>
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="rounded-xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              🎪 RTE Conference Showcase
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {t('prizes.showcase')}
            </p>
          </div>

          <div className="rounded-xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              👑 Community Ambassador Program
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {t('prizes.ambassador')}
            </p>
          </div>

          {/* Eligibility Notes */}
          <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 p-6 border border-yellow-200 dark:border-yellow-800">
            <h4 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              📋 Prize Eligibility
            </h4>
            <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>• {t('prizes.eligibilityNote')}</p>
              <p>• {t('prizes.technicalNote')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
