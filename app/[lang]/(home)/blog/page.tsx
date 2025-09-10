import { getFormatter, getTranslations } from 'next-intl/server'

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

      <div className="container relative z-10 mx-auto mt-14 px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-5xl leading-normal tracking-tight">
            {t('latestPosts')}
          </h1>
          <p className="mx-auto max-w-2xl text-fd-muted-foreground text-lg">
            {t('discoverLatestArticles')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              locale={locale}
              className="group hover:-translate-y-2 relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
            >
              {/* Top row - Article type and date */}
              <div className="mb-8 flex items-center justify-between px-8 pt-8">
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 text-xs dark:bg-slate-700 dark:text-gray-300">
                  General
                </span>
                <time className="text-gray-500 text-sm dark:text-gray-400">
                  {formatter.dateTime(new Date(post.data.date), {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Left-aligned content */}
              <div className="flex flex-1 flex-col px-8 pb-8">
                <h2 className="mb-4 line-clamp-3 text-2xl text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {post.data.title}
                </h2>

                <p className="mb-8 line-clamp-3 text-base text-gray-600 leading-relaxed dark:text-gray-300">
                  {post.data.description}
                </p>

                {/* Bottom - Author info */}
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 font-medium text-gray-700 text-sm dark:bg-slate-700 dark:text-gray-300">
                    {post.data.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-600 text-sm dark:text-gray-400">
                    {post.data.author}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
