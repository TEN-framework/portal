'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

export function FooterSection({ className }: { className?: string }) {
  const t = useTranslations('hackathon')

  const socialLinks = [
    {
      name: 'X (Twitter)',
      href: 'https://twitter.com/TENFramework',
      icon: '𝕏'
    },
    {
      name: 'Medium',
      href: 'https://medium.com/@TENFramework',
      icon: 'M'
    }
  ]

  return (
    <section className={cn('py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800', className)}>
      <div className="container mx-auto max-w-[72rem] px-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Organizer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.organizer')}
            </h3>
            <Link href="/" className="inline-block">
              <Logo height={40} width={80} />
            </Link>
          </div>

          {/* Partners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.partners')}
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Coming soon...</p>
            </div>
          </div>

          {/* Community Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.communitySupport')}
            </h3>
            <Link 
              href="https://slush.org" 
              target="_blank"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              Slush
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('footer.socialMedia')}
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                  title={social.name}
                >
                  <span className="text-lg font-bold">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="my-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"
        ></motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            {/* <VisitCounter showCounter={true} /> */}
          </div>
          
          <div className="flex items-center gap-6">
          </div>
        </motion.div>
      </div>
    </section>
  )
}
