'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { MessageCircle, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

export function DiscordSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

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
          <div className="">
            {/* Background decoration (static, no animation) */}
            <div className="absolute inset-0 -m-4">
              <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-purple-400/20 blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl"></div>
            </div>

            <div className="">
              <h2 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
                {t('discord.title')}
              </h2>
              
              {/* Main Discord Card */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                viewport={{ once: true }}
                className="mb-8 rounded-2xl bg-white dark:bg-gray-800 p-8 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black border border-gray-200 dark:border-gray-700">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="mb-4 text-2xl font-bold">
                  {t('discord.description')}
                </h3>
                
                <p className="mb-8 text-lg opacity-90">
                  {t('discord.support')}
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" className="gap-2 bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black">
                    <MessageCircle className="h-5 w-5" />
                    Join Discord Community
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                  
                  <Button size="lg" variant="outline" className="gap-2 border-gray-900 text-gray-900 hover:bg-gray-100 dark:border-gray-200 dark:text-gray-900 dark:hover:bg-gray-100">
                    <Mail className="h-5 w-5" />
                    {t('cta.email')}
                  </Button>
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                viewport={{ once: true }}
                className="grid gap-6 md:grid-cols-3"
              >
                <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-6 backdrop-blur-sm border border-white/50 dark:border-gray-700">
                  <div className="mb-3 text-2xl">🤝</div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Find Teammates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other developers and form teams</p>
                </div>
                
                <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-6 backdrop-blur-sm border border-white/50 dark:border-gray-700">
                  <div className="mb-3 text-2xl">🛠️</div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Technical Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get help with TEN Framework implementation</p>
                </div>
                
                <div className="rounded-xl bg-white/70 dark:bg-gray-800/70 p-6 backdrop-blur-sm border border-white/50 dark:border-gray-700">
                  <div className="mb-3 text-2xl">📢</div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Latest Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with announcements and workshops</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
