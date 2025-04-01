import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { i18n } from '@/lib/i18n'

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="_图层_2"
            data-name="图层_2"
            viewBox="0 0 159.66 114.89"
            width="24"
            height="24"
            aria-label="Logo"
            className="text-primary"
          >
            <g id="_图层_1-2" data-name="图层_1">
              <g id="logo-logo" fill="currentColor">
                <polygon points="135.36 2.41 135.53 2.41 133.07 .18 130.24 .17 130.24 .17 30.23 0 29.52 2.05 0 87.79 24.77 114.89 56.09 114.83 87.42 23.84 54.35 23.62 32.34 2.06 132.54 2.4 156.92 25.93 118.28 24.55 87.2 114.83 129.23 114.4 159.66 26.03 135.36 2.41" />
              </g>
            </g>
          </svg>
          TEN
        </>
      ),
      url: `/${locale}`,
    },
    links: [
      {
        text: locale === 'cn' ? '文档' : 'Documentation',
        url: `/${locale}/docs`,
        active: 'nested-url',
      },
      {
        text: locale === 'cn' ? '博客' : 'Blog',
        url: `/${locale}/blog`,
        active: 'nested-url',
      },
    ],
  }
}
