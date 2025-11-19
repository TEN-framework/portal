import type { Metadata } from 'next'
import { GuideClient } from '@/app/guide/GuideClient'

export const metadata: Metadata = {
  title: 'Contribution Guide | TEN Framework',
  description: 'Immersive contribution journey for TEN Portal contributors.'
}

type GuidePageProps = {
  params: Promise<{ lang: string }>
}

export default async function LocalizedGuidePage(_: GuidePageProps) {
  return <GuideClient />
}
