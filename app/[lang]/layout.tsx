import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import { type Translations } from 'fumadocs-ui/i18n'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { nextIntlRouting } from '@/lib/i18n'
import cnMessages from '@/messages/cn.json'
import enMessages from '@/messages/en.json'

import Script from 'next/script'
import '../global.css'

const inter = Inter({
  subsets: ['latin'],
})

const cn: Partial<Translations> = cnMessages.fuma
const en: Partial<Translations> = enMessages.fuma

const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '中文',
    locale: 'cn',
  },
]

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const lang = (await params).lang
  const messages = await getMessages({
    locale: lang,
  })

  if (!hasLocale(nextIntlRouting.locales, lang)) {
    notFound()
  }

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={lang} messages={messages}>
          <RootProvider
            i18n={{
              locale: lang,
              locales: locales,
              translations: { cn, en }[lang],
            }}
          >
            {children}
            <Script
              src="/analytics/scarf-analytics.js"
              strategy="afterInteractive"
            />
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
