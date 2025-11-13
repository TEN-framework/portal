import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'
import {
  isMarkdownPreferred as _isMarkdownPreferred,
  rewritePath
} from 'fumadocs-core/negotiation'
import { type NextRequest, NextResponse } from 'next/server'
import { i18n } from '@/lib/i18n'

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path')

const getTargetPath = (request: NextRequest) => {
  let locale = i18n.defaultLanguage
  let pathNameWithoutLocale = request.nextUrl.pathname
  const [detectedLocale, ...restPathSlugs] = request.nextUrl.pathname
    .split('/')
    .filter(Boolean)
  if (detectedLocale && i18n.languages.includes(detectedLocale)) {
    locale = detectedLocale
    pathNameWithoutLocale = restPathSlugs?.length
      ? `/${restPathSlugs.join('/')}`
      : ''
  }
  const result = {
    locale,
    pathNameWithoutLocale
  }
  return result
}

const isMarkdownPreferred = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname
  const isMd = pathname.endsWith('.mdx')
  const isMdx = pathname.endsWith('.mdx')
  return isMd || isMdx || _isMarkdownPreferred(request) || false
}

export default function proxy(request: NextRequest) {
  const { locale, pathNameWithoutLocale } = getTargetPath(request)
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(pathNameWithoutLocale)
    if (result) {
      return NextResponse.rewrite(
        new URL(`/${locale}${result}`, request.nextUrl)
      )
    }
  }
  if (pathNameWithoutLocale === '/llms-full.txt') {
    return NextResponse.next()
  }
  const middleware = createI18nMiddleware(i18n) as (
    request: NextRequest
  ) => NextResponse
  return middleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2)).*)'
  ]
}
