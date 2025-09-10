'use client'

import { Code, Cpu, ExternalLink, Mic, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

export function FrameworkSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Production-Ready & Real-Time',
      description: 'Low-latency, interruptible, and full-duplex conversations.',
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: 'Highly Extensible',
      description: 'Easily integrate any mainstream or custom AI model.',
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Developer-Friendly',
      description:
        'Build with pro-code (Node.js, Python, Go, C++) or a low-code canvas.',
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: 'Multimodal Support',
      description:
        'Simultaneously process voice, vision, text, and data streams.',
    },
  ]

  return (
    <section className={cn('bg-white py-16 dark:bg-gray-950', className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-bold text-4xl text-gray-900 dark:text-white">
              {t('framework.title')}
            </h2>
            <p className="mb-6 font-semibold text-gray-700 text-xl dark:text-gray-200">
              {t('framework.description')}
            </p>
            <p className="mb-8 text-gray-600 text-lg leading-relaxed dark:text-gray-300">
              {t('framework.features')}
            </p>

            <div className="flex gap-4">
              <Button className="gap-2" asChild>
                <Link
                  href="https://github.com/TEN-framework/ten-framework"
                  target="_blank"
                >
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
                className="rounded-lg border border-gray-200 bg-white/60 p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm dark:text-gray-400">
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
          className="mt-16 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="text-center">
            <h3 className="mb-4 font-medium text-gray-900 text-xl dark:text-white">
              {t('toolkit.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <a
                  href="https://theten.ai/docs/ten_agent/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  TEN Framework
                </a>
                <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                  An open-source framework for conversational voice AI agents.
                </p>
              </div>

              <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <div className="flex w-full items-center justify-center gap-2">
                  <a
                    href="https://github.com/ten-framework/ten-vad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    TEN VAD
                  </a>
                  <span className="text-gray-500">/</span>
                  <a
                    href="https://github.com/ten-framework/ten-turn-detection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    TTD
                  </a>
                </div>
                <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                  Lightweight Voice Activity Detection with low latency and high
                  accuracy, plus intelligent Turn Detection for natural
                  conversations between humans and AI agents.
                </p>
              </div>

              <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <a
                  href="https://kiro.dev/docs/getting-started/index"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  Kiro
                </a>
                <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                  An AI IDE that helps you deliver from concept to production
                  through simplified developer experience for working with AI
                  agents.
                </p>
              </div>

              <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <a
                  href="https://www.siliconflow.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  SiliconFlow
                </a>
                <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                  A one-stop cloud service platform integrating top-tier large
                  language models, providing developers with faster, more
                  comprehensive, and seamlessly integrated model APIs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
