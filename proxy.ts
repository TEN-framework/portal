import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'
import { i18n } from '@/lib/i18n'

export default createI18nMiddleware({
  ...i18n,
  format: (locale, path) => {
    return `/${locale}${path}`
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2)).*)'
  ]
}
