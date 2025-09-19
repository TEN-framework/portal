'use client'

import { RootProvider } from 'fumadocs-ui/provider'
import type { Translations } from 'fumadocs-ui/i18n'
import type { ReactNode } from 'react'

const availableLocales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '中文',
    locale: 'cn',
  },
] as const

interface LocaleProvidersProps {
  locale: string
  translations?: Partial<Translations>
  children: ReactNode
}

export function LocaleProviders({
  locale,
  translations,
  children,
}: LocaleProvidersProps) {
  return (
    <RootProvider
      i18n={{
        locale,
        locales: [...availableLocales],
        translations,
      }}
    >
      {children}
    </RootProvider>
  )
}
