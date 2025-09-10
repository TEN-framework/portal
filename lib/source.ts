import { loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx'
import { blogPosts, docs } from '@/.source'
import { i18n } from '@/lib/i18n'

// `loader()` also assign a URL to your pages
// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
})

export const blog = loader({
  baseUrl: '/blog',
  source: createMDXSource(blogPosts),
  i18n,
})
