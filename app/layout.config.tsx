import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { GitHubStarButton } from '@/components/ui/github-star-button'
import { Logo } from '@/components/ui/logo'

import { i18n } from '@/lib/i18n'
import en from '@/messages/en.json'
import cn from '@/messages/cn.json'

const getMessages = (locale?: string) => {
  switch (locale) {
    case 'cn':
      return cn
    case 'en':
    default:
      return en
  }
}

export function baseOptions(locale: string): BaseLayoutProps {
  const messages = getMessages(locale)
  return {
    i18n,
    nav: {
      title: (
        <div className="flex items-center gap-2 mt-0.5">
          <Logo height={33} width={66} />
        </div>
      ),
      url: `/${locale}`,
    },
    links: [
      {
        text: messages.nav.docs,
        url: `/${locale}/docs`,
        active: 'nested-url',
      },
      {
        text: messages.nav.blog,
        url: `/${locale}/blog`,
        active: 'nested-url',
      },
      {
        text: <GitHubStarButton repo="TEN-framework/ten-framework" />,
        url: 'https://github.com/TEN-framework/ten-framework',
        active: 'none',
      },
    ],
    themeSwitch: {
      enabled: true,
      mode: 'light-dark-system',
    },
  }
}
