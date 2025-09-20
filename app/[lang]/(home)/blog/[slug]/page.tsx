import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { notFound } from 'next/navigation'
import { getFormatter, getTranslations } from 'next-intl/server'

import { SITE_URL } from '@/app/metadata.config'
import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'

import {
  AuthorBadge,
  CoverArtwork,
  getAccentColor,
  hexToRgba,
  mixHexColors,
  type BlogFrontmatterMeta,
} from '../components/visuals'

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

  const frontmatter = page.data as BlogFrontmatterMeta
  const isChinese = locale === 'cn'
  const fallbackAuthor = isChinese ? 'TEN 团队' : 'TEN Team'
  const authorName = frontmatter.author ?? fallbackAuthor
  const articleLabel = isChinese ? '文章' : 'Article'
  const accentColor = getAccentColor(frontmatter.accentColor, frontmatter.title)
  const coverImageAlt = frontmatter.coverImageAlt ?? frontmatter.title
  const postDate = frontmatter.date ?? page.data.date ?? new Date()
  const published = formatter.dateTime(new Date(postDate), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const heroBackdropStyle = {
    backgroundImage: `radial-gradient(circle at 12% 20%, ${hexToRgba(
      mixHexColors(accentColor, '#ffffff', 0.55),
      0.32
    )}, transparent 55%), radial-gradient(circle at 85% 0%, ${hexToRgba(
      mixHexColors(accentColor, '#0f172a', 0.35),
      0.25
    )}, transparent 60%)`,
    backgroundColor: hexToRgba('#0f172a', 0.02),
  }

  const panelHighlight = mixHexColors(accentColor, '#ffffff', 0.4)
  const panelDeep = mixHexColors(accentColor, '#000000', 0.55)
  const panelStyle = {
    backgroundImage: `radial-gradient(circle at 20% 20%, ${hexToRgba(
      panelHighlight,
      0.42
    )}, transparent 60%), radial-gradient(circle at 82% 10%, ${hexToRgba(
      accentColor,
      0.3
    )}, transparent 65%), linear-gradient(135deg, ${hexToRgba(
      accentColor,
      0.85
    )}, ${hexToRgba(panelDeep, 0.85)})`,
  }

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
        <div className="pt-24 pb-12" style={heroBackdropStyle}>
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

            <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/85 shadow-2xl backdrop-blur">
              <div className="pointer-events-none absolute inset-0 opacity-90" style={panelStyle} />
              <div className="relative grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
                <div className="order-2 flex flex-col gap-6 md:order-1">
                  <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-gray-700 shadow-sm backdrop-blur-sm dark:bg-slate-900/70 dark:text-slate-200">
                    {articleLabel}
                  </div>

                  <h1 className="font-bold text-4xl tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    {frontmatter.title}
                  </h1>

                  {frontmatter.description && (
                    <p className="text-muted-foreground text-lg leading-relaxed md:text-xl">
                      {frontmatter.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-6">
                    <AuthorBadge
                      accentColor={accentColor}
                      authorName={authorName}
                      published={published}
                    />
                    <div className="flex flex-col text-sm">
                      <span className="text-muted-foreground">{t('publishedOn')}</span>
                      <time className="font-medium text-foreground">{published}</time>
                    </div>
                  </div>
                </div>

                <div className="order-1 md:order-2">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/40 bg-muted/40 shadow-lg">
                    <CoverArtwork
                      accentColor={accentColor}
                      articleLabel={articleLabel}
                      coverImage={frontmatter.coverImage}
                      coverImageAlt={coverImageAlt}
                      featured
                      title={frontmatter.title}
                    />
                  </div>
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

export function generateStaticParams(): { slug: string; lang: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
    lang: page.locale,
  }))
}
