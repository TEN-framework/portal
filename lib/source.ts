import {
  type InferMetaType,
  type InferPageType,
  loader
} from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx/runtime/next'
import { icons } from 'lucide-react'
import { createElement } from 'react'
import { blogPosts, docs } from '@/.source'
import { i18n } from '@/lib/i18n'

// `loader()` also assign a URL to your pages
// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
  icon(name) {
    if (name && name in icons) {
      return createElement(icons[name as keyof typeof icons])
    }
  }
})

export const blog = loader({
  baseUrl: '/blog',
  source: createMDXSource(blogPosts),
  i18n
})

export type DocPage = InferPageType<typeof source>
export type DocMeta = InferMetaType<typeof source>
