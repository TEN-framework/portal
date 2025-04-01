import type { I18nConfig } from 'fumadocs-core/i18n'
import { defineRouting } from 'next-intl/routing'

const LOCALES = ['en', 'cn']
const DEFAULT_LOCALE = 'en'

export const i18n: I18nConfig = {
  defaultLanguage: DEFAULT_LOCALE,
  languages: LOCALES,
  hideLocale: 'default-locale',
}

export const nextIntlRouting = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,
  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
})
