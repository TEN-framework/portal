import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { source } from '@/lib/source'

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
        style: 'clerk',
      }}
      tableOfContentPopover={{
        style: 'clerk',
      }}
      editOnGithub={{
        owner: 'TEN-framework',
        repo: 'portal',
        sha: gitSha,
        path: `content/docs/${page.file.path}`,
      }}
      lastUpdate={page.data.lastModified}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? (
        <DocsDescription>{page.data.description}</DocsDescription>
      ) : null}
      <DocsBody>
        <MDXContent
          components={{
            ...defaultMdxComponents,
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
            // you can add other MDX components here
          }}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug, params.lang)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
