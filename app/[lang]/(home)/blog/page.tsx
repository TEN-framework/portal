import { ArrowRight } from 'lucide-react'
import { getFormatter, getTranslations } from 'next-intl/server'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'

import {
  AuthorBadge,
  CoverArtwork,
  getAccentColor,
  type BlogFrontmatterMeta,
} from './components/visuals'

export default async function BlogHomePage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const locale = await params.lang

  const posts = blog.getPages()

  const t = await getTranslations({ locale, namespace: 'blog' })
  const formatter = await getFormatter({ locale })

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date((a.data as BlogFrontmatterMeta).date ?? 0)
    const dateB = new Date((b.data as BlogFrontmatterMeta).date ?? 0)
    return dateB.getTime() - dateA.getTime()
  })

  const [featuredPost, ...standardPosts] = sortedPosts

  const isChinese = locale === 'cn'
  const badgeText = isChinese ? '博客' : 'Blog'
  const buttonLabel = isChinese ? '浏览所有文章' : 'View all articles'
  const fallbackLabel = isChinese ? '文章' : 'Article'
  const featuredLabel = isChinese ? '精选' : 'Featured'
  const fallbackAuthor = isChinese ? 'TEN 团队' : 'TEN Team'

  return (
    <section className="py-20 md:py-24 lg:py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 px-4 lg:px-16">
        <div className="w-full max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6">
            {badgeText}
          </Badge>
          <h1 className="mb-3 text-pretty font-semibold text-3xl md:mb-4 md:text-4xl lg:mb-6 lg:text-5xl">
            {t('latestPosts')}
          </h1>
          <p className="mb-8 text-muted-foreground md:text-base lg:text-lg">
            {t('discoverLatestArticles')}
          </p>
          <Button variant="link" className="gap-2 text-base" asChild>
            <Link href={`/${locale}/blog`} locale={locale} scroll>
              {buttonLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {featuredPost && (
          (() => {
            const frontmatter = featuredPost.data as BlogFrontmatterMeta
            const authorName = frontmatter.author ?? fallbackAuthor
            const postDate = frontmatter.date ?? new Date()
            const published = formatter.dateTime(new Date(postDate), {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            const accentColor = getAccentColor(frontmatter.accentColor, frontmatter.title)
            const coverImageAlt = frontmatter.coverImageAlt ?? frontmatter.title

            return (
              <Card className="group w-full overflow-hidden border-border/60 bg-background/80 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="grid gap-0 md:grid-cols-[1.6fr_1fr]">
                  <Link
                    href={featuredPost.url}
                    locale={locale}
                    className="group/cover relative block h-full"
                  >
                    <div className="relative aspect-[3/2] md:h-full">
                      <CoverArtwork
                        accentColor={accentColor}
                        articleLabel={featuredLabel}
                        coverImage={frontmatter.coverImage}
                        coverImageAlt={coverImageAlt}
                        featured
                        title={frontmatter.title}
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col gap-6 p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                      <time className="text-[0.8rem] font-medium uppercase tracking-wide text-muted-foreground">
                        {published}
                      </time>
                      <h2 className="text-left font-semibold text-2xl leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                        <Link
                          href={featuredPost.url}
                          locale={locale}
                          className="hover:underline"
                        >
                          {frontmatter.title}
                        </Link>
                      </h2>
                      {frontmatter.description && (
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {frontmatter.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                      <AuthorBadge
                        accentColor={accentColor}
                        authorName={authorName}
                        published={published}
                      />
                      <Link
                        href={featuredPost.url}
                        locale={locale}
                        className="inline-flex items-center gap-2 font-semibold text-primary text-sm transition-transform duration-300 hover:translate-x-1"
                      >
                        {t('readMore')}
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })()
        )}

        {standardPosts.length > 0 && (
          <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
            {standardPosts.map((post, index) => {
              const frontmatter = post.data as BlogFrontmatterMeta
              const description = frontmatter.description ?? ''
              const authorName = frontmatter.author ?? fallbackAuthor
              const postDate = frontmatter.date ?? new Date()
              const published = formatter.dateTime(new Date(postDate), {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              const accentColor = getAccentColor(
                frontmatter.accentColor,
                frontmatter.title
              )
              const coverImageAlt = frontmatter.coverImageAlt ?? frontmatter.title

              return (
                <Card
                  key={post.url}
                  className="group flex h-full flex-col overflow-hidden border-border/60 bg-background/70 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <Link
                    href={post.url}
                    locale={locale}
                    className="group/cover relative block"
                  >
                    <div className="relative aspect-[16/9]">
                      <CoverArtwork
                        accentColor={accentColor}
                        articleLabel={fallbackLabel}
                        coverImage={frontmatter.coverImage}
                        coverImageAlt={coverImageAlt}
                        title={frontmatter.title}
                      />
                    </div>
                  </Link>

                  <CardHeader className="flex flex-col gap-3 px-6 pt-6">
                    <time className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
                      {published}
                    </time>
                    <h2 className="text-left font-semibold text-xl leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                      <Link
                        href={post.url}
                        locale={locale}
                        className="hover:underline"
                      >
                        {frontmatter.title}
                      </Link>
                    </h2>
                  </CardHeader>

                  <CardContent className="px-6">
                    <p className="line-clamp-3 text-muted-foreground text-sm md:text-base">
                      {description}
                    </p>
                  </CardContent>

                  <CardFooter className="mt-auto flex items-center justify-between px-6 pb-6">
                    <AuthorBadge
                      accentColor={accentColor}
                      authorName={authorName}
                      published={published}
                    />
                    <Link
                      href={post.url}
                      locale={locale}
                      className="inline-flex items-center gap-2 font-semibold text-primary text-sm transition-transform duration-300 hover:translate-x-1"
                    >
                      {t('readMore')}
                      <ArrowRight className="size-4" />
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
