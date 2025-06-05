import { Metadata } from 'next'

export const SITE_URL = 'https://theten.ai'
export const DEFAULT_TITLE = 'TEN Framework - Build Real-Time Multimodal AI Agents'
export const DEFAULT_DESCRIPTION = 'TEN is an open-source framework designed for building multimodal conversational AI with real-time capabilities.'

export const KEYWORDS = [
  'AI Framework',
  'Conversational AI',
  'Multimodal AI',
  'Real-time AI',
  'Voice AI',
  'AI Agents'
]

export const SOCIAL_HANDLES = {
  twitter: '@TenFramework'
}

interface GenerateMetadataProps {
  title?: string
  description?: string
  lang: string
}

export function generateSiteMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  lang
}: GenerateMetadataProps): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: '%s | TEN Framework',
      default: title,
    },
    description,
    keywords: KEYWORDS,
    authors: [{ name: 'TEN Framework Team' }],
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'TEN Framework',
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SOCIAL_HANDLES.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'en-US': `${SITE_URL}/en`,
        'zh-CN': `${SITE_URL}/cn`,
      },
    },
  }
} 