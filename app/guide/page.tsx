import type { Metadata } from 'next'
import GuidePage from '@/app/[lang]/guide/page'
import { i18n } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Guide',
  description: 'TEN Portal contribution guide'
}

export default async function GuideDefaultPage() {
  return GuidePage({
    params: Promise.resolve({ lang: i18n.defaultLanguage })
  })
}
