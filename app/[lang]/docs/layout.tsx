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

  return (
    <DocsLayout
      {...baseOptions(lang)}
      // nav={{ ...baseOptions(lang).nav, mode: 'top' }}
      tabMode="sidebar"
      tree={source.pageTree[lang]}
    >
      {children}
    </DocsLayout>
  )
}
