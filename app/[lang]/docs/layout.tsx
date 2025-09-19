import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { ReactNode } from 'react'

import { baseOptions } from '@/app/layout.config'
import { source } from '@/lib/source'

export default async function Layout({
  params,
  children,
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
      tabMode="sidebar"
      tree={source.pageTree[lang]}
    >
      {children}
    </DocsLayout>
  )
}
