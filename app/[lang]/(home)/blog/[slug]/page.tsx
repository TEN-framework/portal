import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { notFound } from 'next/navigation'
import { getFormatter, getTranslations } from 'next-intl/server'
import { SITE_URL } from '@/app/metadata.config'
import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug], params.lang)

  if (!page) notFound()

  const blogUrl = `${SITE_URL}/${params.lang}/blog/${params.slug}`

  return {
    title: page.data.title,
    description: page.data.description,
    authors: [{ name: page.data.author }],
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      publishedTime: new Date(page.data.date).toISOString(),
      authors: [page.data.author],
      url: blogUrl,
      siteName: 'TEN Framework',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
    },
    alternates: {
      canonical: blogUrl,
    },
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

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title,
    description: page.data.description,
    author: {
      '@type': 'Person',
      name: page.data.author,
    },
    datePublished: new Date(page.data.date).toISOString(),
    dateModified: new Date(page.data.date).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'TEN Framework',
      url: SITE_URL,
    },
    url: `${SITE_URL}/${locale}/blog/${params.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${locale}/blog/${params.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="pb-16">
        <div className="bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pt-24 pb-12">
          <div className="container relative">
            <Link
              locale={locale}
              href="/blog"
              className="group mb-8 inline-flex items-center font-medium text-fd-muted-foreground text-sm transition-colors hover:text-primary"
            >
              <svg
                className="group-hover:-translate-x-1 mr-2 h-4 w-4 transition-transform duration-300"
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

            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background/80 via-background/50 to-background/30 p-8 shadow-lg backdrop-blur-sm">
              <h1 className="mb-4 font-bold text-4xl tracking-tight">
                {page.data.title}
              </h1>
              <p className="text-fd-muted-foreground text-lg">
                {page.data.description}
              </p>

              <div className="mt-6 flex items-center gap-6 border-t pt-6 text-sm">
                <div>
                  <p className="mb-1 text-fd-muted-foreground">
                    {t('writtenBy')}
                  </p>
                  <p className="font-medium">{page.data.author}</p>
                </div>
                <div>
                  <p className="mb-1 text-fd-muted-foreground">
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

        <article className="container relative mx-auto mt-12 max-w-4xl px-4">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <InlineTOC items={page.data.toc} />
            <Mdx components={defaultMdxComponents} />
          </div>
        </article>
      </div>
    </>
  )
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
    lang: page.locale,
  }))
}
