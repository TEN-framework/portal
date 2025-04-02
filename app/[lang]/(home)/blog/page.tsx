import Link from 'next/link'
import { blog } from '@/lib/source'

// Array of gradient color combinations
const gradients = [
  'from-rose-50 via-rose-100/20 to-rose-200/30 dark:from-rose-950 dark:via-rose-900/20 dark:to-rose-800/30',
  'from-blue-50 via-blue-100/20 to-blue-200/30 dark:from-blue-950 dark:via-blue-900/20 dark:to-blue-800/30',
  'from-amber-50 via-amber-100/20 to-amber-200/30 dark:from-amber-950 dark:via-amber-900/20 dark:to-amber-800/30',
  'from-emerald-50 via-emerald-100/20 to-emerald-200/30 dark:from-emerald-950 dark:via-emerald-900/20 dark:to-emerald-800/30',
  'from-violet-50 via-violet-100/20 to-violet-200/30 dark:from-violet-950 dark:via-violet-900/20 dark:to-violet-800/30',
  'from-cyan-50 via-cyan-100/20 to-cyan-200/30 dark:from-cyan-950 dark:via-cyan-900/20 dark:to-cyan-800/30'
]

const hoverGradients = [
  'from-transparent to-rose-200/20 dark:to-rose-800/20',
  'from-transparent to-blue-200/20 dark:to-blue-800/20',
  'from-transparent to-amber-200/20 dark:to-amber-800/20',
  'from-transparent to-emerald-200/20 dark:to-emerald-800/20',
  'from-transparent to-violet-200/20 dark:to-violet-800/20',
  'from-transparent to-cyan-200/20 dark:to-cyan-800/20'
]

export default function Home() {
  const posts = blog.getPages()
  // Sort posts by date in descending order
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.data.date)
    const dateB = new Date(b.data.date)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          Latest Blog Posts
        </h1>
        <p className="text-fd-muted-foreground mx-auto max-w-2xl text-lg">
          Discover our latest articles about TEN Framework, AI development, and more
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedPosts.map((post, index) => (
          <Link
            key={post.url}
            href={post.url}
            className={`group relative flex min-h-[320px] flex-col overflow-hidden rounded-xl border bg-gradient-to-br ${gradients[index % gradients.length]} p-6 shadow-md transition-all duration-300 hover:shadow-xl`}
          >
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${hoverGradients[index % hoverGradients.length]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            
            <div className="grow">
              <h2 className="mb-3 text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                {post.data.title}
              </h2>
              <p className="text-fd-muted-foreground line-clamp-3">
                {post.data.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-fd-muted-foreground flex flex-col text-sm">
                <time dateTime={new Date(post.data.date).toISOString()}>
                  {new Date(post.data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="mt-1">{post.data.author}</span>
              </div>
              
              <div className="text-fd-muted-foreground flex items-center text-sm">
                <span className="group-hover:text-primary group-hover:underline">
                  Read more
                </span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
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
    </main>
  )
}
