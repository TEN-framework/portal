import type { Metadata } from 'next'

import { GitHubStarCelebrationClient } from './client'

export const metadata: Metadata = {
  title: 'GitHub 8K Star Celebration | TEN Framework',
  description:
    'Celebrate TEN Framework reaching 8,000+ GitHub stars and discover how the community is shaping the real-time, multimodal roadmap.'
}

type ParamsRecord = Record<string, string | string[] | undefined>

export default async function GitHubStarCelebrationPage({
  params
}: {
  params?: Promise<ParamsRecord>
}) {
  const resolvedParams = params ? await params : undefined
  const langParam = resolvedParams?.lang
  const lang = Array.isArray(langParam) ? langParam[0] : (langParam ?? 'en')

  return <GitHubStarCelebrationClient lang={lang} />
}
