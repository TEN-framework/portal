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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              locale={locale}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-slate-700 min-h-[320px] flex flex-col"
            >
              {/* Top row - Article type and date */}
               <div className="flex items-center justify-between mb-8 px-8 pt-8">
                 <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-full">
                   General
                 </span>
                 <time className="text-sm text-gray-500 dark:text-gray-400">
                   {formatter.dateTime(new Date(post.data.date), {
                     month: 'short',
                     day: 'numeric'
                   })}
                 </time>
               </div>
 
               {/* Left-aligned content */}
                 <div className="px-8 pb-8 flex-1 flex flex-col">
                   <h2 className="text-2xl text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                      {post.data.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed line-clamp-3 mb-8">
                      {post.data.description}
                    </p>
                    
                    {/* Bottom - Author info */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {post.data.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
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
