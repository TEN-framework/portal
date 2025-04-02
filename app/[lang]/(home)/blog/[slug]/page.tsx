import { notFound } from 'next/navigation'
import Link from 'next/link'
import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { blog } from '@/lib/source'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function Page(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = blog.getPage([params.slug])

  if (!page) notFound()
  const Mdx = page.data.body

  return (
    <main className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent pb-12 pt-24">
        <div className="container relative">
          <Link 
            href="/blog"
            className="group mb-8 inline-flex items-center text-sm font-medium text-fd-muted-foreground transition-colors hover:text-primary"
          >
            <svg
              className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
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
            Back to Blog
          </Link>
          
          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background/80 via-background/50 to-background/30 p-8 shadow-lg backdrop-blur-sm">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">{page.data.title}</h1>
            <p className="text-fd-muted-foreground text-lg">{page.data.description}</p>
            
            <div className="mt-6 flex items-center gap-6 border-t pt-6 text-sm">
              <div>
                <p className="text-fd-muted-foreground mb-1">Written by</p>
                <p className="font-medium">{page.data.author}</p>
              </div>
              <div>
                <p className="text-fd-muted-foreground mb-1">Published on</p>
                <p className="font-medium">
                  {new Date(page.data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
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
    </main>
  )
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
    lang: page.locale,
  }))
}
