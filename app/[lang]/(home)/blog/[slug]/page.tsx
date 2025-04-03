import { notFound } from 'next/navigation'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { getTranslations, getFormatter } from 'next-intl/server'

import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug], params.lang)

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const params = await props.params
  const locale = await params.lang

  const page = blog.getPage([params.slug], params.lang)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const formatter = await getFormatter({ locale })

  if (!page) notFound()

  const Mdx = page.data.body

  return (
    <div className="pb-16">
      <div className="via-primary/5 to-primary/10 bg-gradient-to-b from-transparent pt-24 pb-12">
        <div className="relative container">
          <Link
            locale={locale}
            href="/blog"
            className="group text-fd-muted-foreground hover:text-primary mb-8 inline-flex items-center text-sm font-medium transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            {t('backToBlog')}
          </Link>

          <div className="from-background/80 via-background/50 to-background/30 relative overflow-hidden rounded-xl border bg-gradient-to-br p-8 shadow-lg backdrop-blur-sm">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              {page.data.title}
            </h1>
            <p className="text-fd-muted-foreground text-lg">
              {page.data.description}
            </p>

            <div className="mt-6 flex items-center gap-6 border-t pt-6 text-sm">
              <div>
                <p className="text-fd-muted-foreground mb-1">
                  {t('writtenBy')}
                </p>
                <p className="font-medium">{page.data.author}</p>
              </div>
              <div>
                <p className="text-fd-muted-foreground mb-1">
                  {t('publishedOn')}
                </p>
                <p className="font-medium">
                  {formatter.dateTime(new Date(page.data.date), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="relative container mx-auto mt-12 max-w-4xl px-4">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <InlineTOC items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>
      </article>
    </div>
  )
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
    lang: page.locale,
  }))
}
