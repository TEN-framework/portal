import NextLink from 'next/link'
import { getFormatter, getTranslations } from 'next-intl/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { i18n } from '@/lib/i18n'
import { blog } from '@/lib/source'
import {
  AuthorBadge,
  accentPalette,
  type BlogFrontmatterMeta,
  CoverArtwork,
  getAccentColor
} from './components/visuals'

export default async function BlogHomePage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const locale = await params.lang

  const posts = blog.getPages(locale || i18n.defaultLanguage)

  const t = await getTranslations({ locale, namespace: 'blog' })
  const formatter = await getFormatter({ locale })

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date((a.data as BlogFrontmatterMeta).date ?? 0)
    const dateB = new Date((b.data as BlogFrontmatterMeta).date ?? 0)
    return dateB.getTime() - dateA.getTime()
  })

  const featuredPost =
    sortedPosts.find(
      (p) => (p.data as BlogFrontmatterMeta).featured === true
    ) ?? sortedPosts[0]

  const standardPosts = sortedPosts.filter((p) => p !== featuredPost)

  const isChinese = locale === 'cn'
  const badgeText = isChinese ? '博客' : 'Blog'
  const fallbackLabel = isChinese ? '文章' : 'Article'
  const featuredLabel = isChinese ? '精选' : 'Featured'
  const fallbackAuthor = isChinese ? 'TEN 团队' : 'TEN Team'
  const paletteSize = accentPalette.length
  const usedAccentColors = new Set<string>()

  const pickAccentColor = (frontmatter: BlogFrontmatterMeta) => {
    let offset = 0
    let accent = getAccentColor(
      frontmatter.accentColor,
      frontmatter.title,
      offset
    )

    if (frontmatter.accentColor) {
      usedAccentColors.add(accent)
      return accent
    }

    while (usedAccentColors.has(accent) && offset < paletteSize - 1) {
      offset += 1
      accent = getAccentColor(undefined, frontmatter.title, offset)
    }

    usedAccentColors.add(accent)
    return accent
  }

  return (
    <section className='blog-theme py-20 md:py-24 lg:py-32'>
      <div className='container mx-auto flex flex-col items-center gap-16 px-4 lg:px-16'>
        <div className='w-full max-w-3xl text-center'>
          <Badge variant='secondary' className='mb-6'>
            {badgeText}
          </Badge>
          <h1 className='mb-3 text-pretty font-semibold text-3xl md:mb-4 md:text-4xl lg:mb-6 lg:text-5xl'>
            {t('latestPosts')}
          </h1>
          <p className='mb-8 text-muted-foreground md:text-base lg:text-lg'>
            {t('discoverLatestArticles')}
          </p>
          {/* Removed the view-all link button per request */}
        </div>

        {featuredPost &&
          (() => {
            const frontmatter = featuredPost.data as BlogFrontmatterMeta
            const authorName = frontmatter.author ?? fallbackAuthor
            const postDate = frontmatter.date ?? new Date()
            const published = formatter.dateTime(new Date(postDate), {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })
            const accentColor = pickAccentColor(frontmatter)
            const coverImageAlt = frontmatter.coverImageAlt ?? frontmatter.title
            const featuredBadgeLabel =
              frontmatter.featuredLabel ?? featuredLabel

            return (
              <Card className='group hover:-translate-y-2 w-full overflow-hidden border-border/60 bg-background/80 shadow-lg transition-all duration-500 hover:shadow-2xl'>
                <div className='grid gap-0 md:grid-cols-[1.6fr_1fr]'>
                  <NextLink
                    href={featuredPost.url}
                    locale={locale}
                    className='group/cover relative block h-full'
                  >
                    <div className='relative aspect-[3/2] md:h-full'>
                      <CoverArtwork
                        accentColor={accentColor}
                        accentWords={frontmatter.accentWords}
                        articleLabel={featuredBadgeLabel}
                        coverImage={frontmatter.coverImage}
                        coverImageAlt={coverImageAlt}
                        featured
                        title={frontmatter.title}
                      />
                    </div>
                  </NextLink>

                  <div className='flex flex-col gap-6 p-6 md:p-8'>
                    <div className='flex flex-col gap-4'>
                      <time className='font-medium text-[0.8rem] text-muted-foreground uppercase tracking-wide'>
                        {published}
                      </time>
                      <h2 className='text-left font-semibold text-2xl text-foreground leading-tight transition-colors duration-300 group-hover:text-primary'>
                        <NextLink
                          href={featuredPost.url}
                          locale={locale}
                          className='hover:underline'
                        >
                          {frontmatter.title}
                        </NextLink>
                      </h2>
                      {frontmatter.description && (
                        <p className='text-base text-muted-foreground leading-relaxed'>
                          {frontmatter.description}
                        </p>
                      )}
                    </div>

                    <div className='mt-auto flex flex-wrap items-center gap-4'>
                      <AuthorBadge
                        accentColor={accentColor}
                        authorName={authorName}
                        published={published}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })()}

        {standardPosts.length > 0 && (
          <div className='grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {standardPosts.map((post) => {
              const frontmatter = post.data as BlogFrontmatterMeta
              const description = frontmatter.description ?? ''
              const authorName = frontmatter.author ?? fallbackAuthor
              const postDate = frontmatter.date ?? new Date()
              const published = formatter.dateTime(new Date(postDate), {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })

              const accentColor = pickAccentColor(frontmatter)
              const coverImageAlt =
                frontmatter.coverImageAlt ?? frontmatter.title
              const articleBadgeLabel =
                frontmatter.articleLabel ?? fallbackLabel

              return (
                <Card
                  key={post.url}
                  className='group hover:-translate-y-2 flex h-full flex-col overflow-hidden border-border/60 bg-background/70 shadow-sm transition-all duration-300 hover:shadow-xl'
                >
                  <NextLink
                    href={post.url}
                    locale={locale}
                    className='group/cover relative block'
                  >
                    <div className='relative aspect-[16/9]'>
                      <CoverArtwork
                        accentColor={accentColor}
                        accentWords={frontmatter.accentWords}
                        articleLabel={articleBadgeLabel}
                        coverImage={frontmatter.coverImage}
                        coverImageAlt={coverImageAlt}
                        title={frontmatter.title}
                      />
                    </div>
                  </NextLink>

                  <CardHeader className='flex flex-col gap-3 px-6 pt-6'>
                    <time className='font-medium text-[0.7rem] text-muted-foreground uppercase tracking-wide'>
                      {published}
                    </time>
                    <h2 className='text-left font-semibold text-foreground text-xl leading-snug transition-colors duration-300 group-hover:text-primary'>
                      <NextLink
                        href={post.url}
                        locale={locale}
                        className='hover:underline'
                      >
                        {frontmatter.title}
                      </NextLink>
                    </h2>
                  </CardHeader>

                  <CardContent className='px-6'>
                    <p className='line-clamp-3 text-muted-foreground text-sm md:text-base'>
                      {description}
                    </p>
                  </CardContent>

                  <CardFooter className='mt-auto flex items-center px-6 pb-6'>
                    <AuthorBadge
                      accentColor={accentColor}
                      authorName={authorName}
                      published={published}
                    />
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
