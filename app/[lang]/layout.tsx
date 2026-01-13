import { defineI18nUI } from 'fumadocs-ui/i18n'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'
import { LocaleProviders } from '@/app/[lang]/providers'
import { generateSiteMetadata } from '@/app/metadata.config'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { ForceLightTheme } from '@/components/utils/force-light-theme'
import { i18n, nextIntlRouting } from '@/lib/i18n'
import cnMessages from '@/messages/cn.json'
import enMessages from '@/messages/en.json'

import '../global.css'

const fumaTranslations = {
  cn: {
    ...cnMessages.fuma,
    displayName: cnMessages.languages.cn
  },
  en: {
    ...enMessages.fuma,
    displayName: enMessages.languages.en
  }
} as const

const { provider: I18nUIProvider } = defineI18nUI(i18n, {
  translations: fumaTranslations
})

export async function generateMetadata({
  params: paramsPromise
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await paramsPromise
  return generateSiteMetadata({ lang })
}

export default async function Layout({
  params,
  children
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang } = await params
  const messages = await getMessages({
    locale: lang
  })

  if (!hasLocale(nextIntlRouting.locales, lang)) {
    notFound()
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Audiowide&family=Inter:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <Script
          id='tweakcn-live-preview'
          src='https://tweakcn.com/live-preview.min.js'
          strategy='afterInteractive'
          async
          crossOrigin='anonymous'
        />
      </head>
      <body className='flex min-h-screen flex-col'>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <LocaleProviders i18n={I18nUIProvider(lang)}>
            <ForceLightTheme />
            {children}
            <AnalyticsProvider
              translations={{
                message:
                  lang === 'cn'
                    ? cnMessages.cookieConsent.message
                    : enMessages.cookieConsent.message,
                accept:
                  lang === 'cn'
                    ? cnMessages.cookieConsent.accept
                    : enMessages.cookieConsent.accept,
                decline:
                  lang === 'cn'
                    ? cnMessages.cookieConsent.decline
                    : enMessages.cookieConsent.decline
              }}
            />
          </LocaleProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
