import { notFound } from 'next/navigation'
import { getLLMText } from '@/lib/get-llm-text'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET(
  _req: Request,
  { params }: { params: { slug?: string[]; lang: string } }
) {
  const { slug, lang } = await params
  console.log('slug ===>', slug, lang)
  const parsedSlug = slug
    ? slug.map((s) => {
        if (s.endsWith('.mdx')) {
          return s.slice(0, -4)
        }
        if (s.endsWith('.md')) {
          return s.slice(0, -3)
        }
        return s
      })
    : []
  const page = source.getPage(parsedSlug, lang)
  console.log('page ===>', page)
  if (!page) notFound()

  return new Response(await getLLMText(page))
}
