import { createRelativeLink } from 'fumadocs-ui/mdx'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/page'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { LLMCopyButton, ViewOptions } from '@/components/page-actions'
import { getDocPageImage, source } from '@/lib/source'

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug, params.lang)

  if (!page) notFound()

  const MDXContent = page.data.body
  const gitSha =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    'main'

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk'
      }}
      tableOfContentPopover={{
        style: 'clerk'
      }}
      editOnGithub={{
        owner: 'TEN-framework',
        repo: 'portal',
        sha: gitSha,
        path: `content/docs/${page.url}`
      }}
      lastUpdate={page.data.lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription className='mb-0'>
          {page.data.description}
        </DocsDescription>
      ) : null}
      <div className='flex flex-row items-center gap-2 border-b pt-2 pb-6'>
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/TEN-framework/portal/blob/main/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page)
            // you can add other MDX components here
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export const revalidate = 300

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug, params.lang)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getDocPageImage(page).url
    }
  }
}
