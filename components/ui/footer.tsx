'use client'

import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/lib/next-intl-navigation'
import { cn } from '@/lib/utils'

export function Footer({ className }: { className?: string }) {
  const t = useTranslations('footer')

  const DiscordIcon = () => (
    <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
      <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z' />
    </svg>
  )

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/ten-framework/ten-framework',
      icon: Github
    },
    {
      name: 'X (Twitter)',
      href: 'https://twitter.com/TENFramework',
      icon: 'text',
      text: '𝕏'
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/VnPftUzAMJ',
      icon: DiscordIcon
    }
  ]

  const productLinks = [
    { name: t('product.framework'), href: 'https://github.com/ten-framework/ten-framework' },
    { name: t('product.agent'), href: 'https://agent.theten.ai' },
    { name: t('product.vad'), href: 'https://github.com/ten-framework/ten-vad' },
    { name: t('product.turnDetection'), href: 'https://github.com/ten-framework/ten-turn-detection' }
  ]

  const resourceLinks = [
    { name: t('resources.documentation'), href: '/docs' },
    { name: t('resources.blog'), href: '/blog' },
    { name: t('resources.huggingFace'), href: 'https://huggingface.co/spaces/TEN-framework/ten-agent-demo', external: true }
  ]

  const communityLinks = [
    { name: t('community.github'), href: 'https://github.com/ten-framework/ten-framework', external: true },
    { name: t('community.discord'), href: 'https://discord.gg/VnPftUzAMJ', external: true },
    { name: t('community.twitter'), href: 'https://twitter.com/TENFramework', external: true }
  ]

  return (
    <footer
      className={cn(
        'relative z-10 bg-transparent',
        className
      )}
    >
      <div className='container mx-auto px-4 py-12 md:py-16'>
        {/* Divider */}
        <div className='mb-8 h-px bg-gradient-to-r from-transparent via-border to-transparent' />

        {/* Main Content */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Brand Section */}
          <div className='space-y-4 lg:col-span-2'>
            <Link href='/' className='inline-block'>
              <Logo height={40} width={80} />
            </Link>
            <p className='max-w-sm text-muted-foreground text-sm leading-relaxed'>
              {t('tagline')}
            </p>
            <div className='flex gap-3'>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    className='flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-foreground'
                    title={social.name}
                  >
                    {social.icon === 'text' ? (
                      <span className='font-bold text-base'>{social.text}</span>
                    ) : (
                      <Icon className='h-4 w-4' />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground text-sm'>
              {t('product.title')}
            </h3>
            <ul className='space-y-3'>
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target='_blank'
                    className='inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground'
                  >
                    {link.name}
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground text-sm'>
              {t('resources.title')}
            </h3>
            <ul className='space-y-3'>
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    className='inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground'
                  >
                    {link.name}
                    {link.external && <ExternalLink className='h-3 w-3' />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-foreground text-sm'>
              {t('community.title')}
            </h3>
            <ul className='space-y-3'>
              {communityLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target='_blank'
                    className='inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground'
                  >
                    {link.name}
                    <ExternalLink className='h-3 w-3' />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left'>
          <p className='text-muted-foreground text-sm'>
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className='text-muted-foreground text-sm'>
            {t('supportedBy')}{' '}
            <Link
              href='https://www.agora.io/en/'
              target='_blank'
              className='text-spektr-cyan-100 underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-[#13C2FF]'
            >
              Agora
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
