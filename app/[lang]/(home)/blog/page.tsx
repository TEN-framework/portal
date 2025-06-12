import { getTranslations, getFormatter } from 'next-intl/server'

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
              className="group bg-background/40 hover:bg-background/60 relative flex flex-col overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300"
            >
              <div className="flex flex-1 flex-col p-8">
                <div className="text-fd-muted-foreground mb-3 text-xs">
                  {formatter.dateTime(new Date(post.data.date), {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h2 className="mb-4 text-2xl font-medium tracking-tight">
                  {post.data.title}
                </h2>
                <p className="text-fd-muted-foreground line-clamp-3 text-sm">
                  {post.data.description}
                </p>
              </div>

              <div className="border-border/40 bg-background/20 flex items-center justify-between border-t px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-background/40 h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.data.author}&backgroundColor=transparent&textColor=64748b`}
                      alt={post.data.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-fd-muted-foreground text-sm">
                    {post.data.author}
                  </span>
                </div>
                <div className="text-fd-muted-foreground flex items-center text-sm">
                  <span>{t('readMore')}</span>
                  <svg
                    className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
