import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { ReactNode } from 'react'
import { Banner } from '@/components/layout/sidebar'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default async function Layout({
  params,
  children
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang } = await params

  const { nav, ...layoutProps } = baseOptions(lang)

  return (
    <DocsLayout
      {...layoutProps}
      nav={{ ...nav, mode: 'top' }}
      tabMode='sidebar'
      tree={source.pageTree[lang]}
      sidebar={{
        banner: Banner,
        tabs: {
          transform: (option) => {
            if (option?.description?.toString().startsWith('v')) return null
            return option
          }
        }
      }}
    >
      {children}
    </DocsLayout>
  )
}
