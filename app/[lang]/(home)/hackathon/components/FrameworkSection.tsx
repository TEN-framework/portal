'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { ExternalLink, Code, Zap, Cpu, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

export function FrameworkSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-Time',
      description: 'Low-latency voice interactions'
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: 'Multi-Modal',
      description: 'Voice, vision, and text capabilities'
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Extensible',
      description: 'Create reusable extensions'
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: 'AI-Powered',
      description: 'Integrate LLMs, STT, TTS easily'
    }
  ]

  return (
    <section className={cn('py-16 bg-white dark:bg-gray-950', className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
              {t('framework.title')}
            </h2>
            <p className="mb-6 text-xl font-semibold text-gray-700 dark:text-gray-200">
              {t('framework.description')}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {t('framework.features')}
            </p>

            <div className="flex gap-4">
              <Button className="gap-2" asChild>
                <Link href="https://github.com/TEN-framework/ten-framework" target="_blank">
                  <Code className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/docs" target="_blank">
                  Documentation
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-lg bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Toolkit Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8"
        >
          <div className="text-center">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{t('toolkit.title')}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-2">
                <span className="font-medium text-gray-900 dark:text-white">{t('toolkit.framework')}</span>
              </div>
              <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-2">
                <span className="font-medium text-gray-900 dark:text-white">{t('toolkit.vadTtd')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}