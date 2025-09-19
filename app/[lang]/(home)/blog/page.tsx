import { ArrowRight } from 'lucide-react'
import { getFormatter, getTranslations } from 'next-intl/server'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'

export default async function BlogHomePage(props: {
  params: Promise<{ lang: string }>
}) {
  const params = await props.params
  const locale = await params.lang

  const posts = blog.getPages()

  const t = await getTranslations({ locale, namespace: 'blog' })
  const formatter = await getFormatter({ locale })

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.data.date)
    const dateB = new Date(b.data.date)
    return dateB.getTime() - dateA.getTime()
  })

  const isChinese = locale === 'cn'
  const badgeText = isChinese ? '博客' : 'Blog'
  const buttonLabel = isChinese ? '浏览所有文章' : 'View all articles'
  const fallbackLabel = isChinese ? '文章' : 'Article'
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

        <div className="grid w-full gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => {
            const description = post.data.description ?? ''
            const authorName = (post.data as { author?: string }).author ?? fallbackAuthor
            const postDate = (post.data as { date?: Date | string }).date ?? new Date()
            const published = formatter.dateTime(new Date(postDate), {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

            const articleLabel = fallbackLabel
            const authorInitial = authorName.charAt(0).toUpperCase() || 'T'

            return (
              <Card
                key={post.url}
                className="group hover:-translate-y-1 grid h-full grid-rows-[auto_auto_1fr_auto] overflow-hidden border-border/60 bg-background/70 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Link
                    href={post.url}
                    locale={locale}
                    className="flex h-full w-full items-center justify-center bg-muted"
                  >
                    <Logo height={72} variant="mark" />
                  </Link>
                </div>

                <CardHeader className="flex flex-col gap-3 px-6 pt-6">
                  <div className="flex items-center justify-between font-medium text-muted-foreground text-xs uppercase tracking-wide">
                    <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium text-xs">
                      {articleLabel}
                    </span>
                    <time>{published}</time>
                  </div>
                  <h2 className="text-left font-semibold text-lg leading-tight transition-colors group-hover:text-primary md:text-xl">
                    <Link
                      href={post.url}
                      locale={locale}
                      className="hover:underline"
                    >
                      {post.data.title}
                    </Link>
                  </h2>
                </CardHeader>

                <CardContent className="px-6">
                  <p className="line-clamp-3 text-muted-foreground text-sm md:text-base">
                    {description}
                  </p>
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between px-6 pb-6">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-semibold text-foreground">
                      {authorInitial}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground text-sm">
                        {authorName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {published}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={post.url}
                    locale={locale}
                    className="inline-flex items-center gap-2 font-semibold text-primary text-sm hover:underline"
                  >
                    {t('readMore')}
                    <ArrowRight className="size-4" />
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
