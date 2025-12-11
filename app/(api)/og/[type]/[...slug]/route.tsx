import { generate as DefaultImage } from 'fumadocs-ui/og'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { SITE_META } from '@/constants'
import { type BlogPage, blog, type DocPage, source } from '@/lib/source'

export const revalidate = false

export async function GET(
  _req: Request,
  { params }: RouteContext<`/og/[type]/[...slug]`>
) {
  const { type, slug } = await params
  let page: DocPage | BlogPage | undefined

  if (type === 'docs') {
    page = source.getPage(slug.slice(0, -1))
  } else if (type === 'blog') {
    page = blog.getPage(slug.slice(0, -1))
  } else {
    notFound()
  }

  if (!page) notFound()

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site={SITE_META.name}
    />,
    {
      width: 1200,
      height: 630
    }
  )
}

// Generate OG images on-demand to avoid heavy static pre-rendering
export const dynamic = 'force-dynamic'
