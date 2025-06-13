import { getTranslations, getFormatter } from 'next-intl/server'

import { Link } from '@/lib/next-intl-navigation'
import { blog } from '@/lib/source'
import { Button } from '@/components/ui/button'

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

  return (
    <div className="relative min-h-[calc(100dvh-56px)] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 z-0 h-screen w-full object-cover opacity-37"
      >
        <source
          src="https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 container mx-auto mt-14 px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl leading-normal font-bold tracking-tight">
            {t('latestPosts')}
          </h1>
          <p className="text-fd-muted-foreground mx-auto max-w-2xl text-lg">
            {t('discoverLatestArticles')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <Link
              locale={locale}
              key={post.url}
              href={post.url}
              className="group border-border/30 bg-background/90 hover:bg-background relative flex flex-col overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl"
            >
              <div className="border-border/30 relative h-56 w-full overflow-hidden border-b">
                <div
                  className="absolute inset-0 transition-all duration-700 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(
                      110deg,
                      hsl(${(post.data.title.length * 7) % 360}, 40%, 45%),
                      hsl(${(post.data.title.length * 13) % 360}, 40%, 40%),
                      hsl(${(post.data.title.length * 19) % 360}, 40%, 42%)
                    )`,
                  }}
                />
                <div className="from-background/80 via-background/20 absolute inset-0 bg-gradient-to-b to-transparent" />
                <div className="from-background/10 absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] via-transparent to-transparent" />
                <div className="from-background/5 absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h2 className="text-foreground mb-4 text-xl font-semibold tracking-tight">
                  {post.data.title}
                </h2>
                <p className="text-fd-muted-foreground line-clamp-3 text-sm leading-relaxed">
                  {post.data.description}
                </p>
              </div>

              <div className="bg-background/30 flex flex-col px-8">
                <div className="py-4">
                  <Button size="lg" className="gap-2" asChild>
                    <Link href={post.url} locale={locale}>
                      Read more
                    </Link>
                  </Button>
                </div>
                <div className="border-border/30 flex flex-col border-t py-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-background/60 ring-border/20 h-10 w-10 overflow-hidden rounded-full ring-1">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.data.author}&backgroundColor=transparent&textColor=1e293b`}
                        alt={post.data.author}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm font-medium">
                        {post.data.author}
                      </span>
                      <span className="text-fd-muted-foreground text-xs">
                        {formatter.dateTime(new Date(post.data.date), {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
