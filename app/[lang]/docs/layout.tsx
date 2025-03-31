import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'

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
    <DocsLayout {...baseOptions(lang)} tree={source.pageTree[lang]}>
      {children}
    </DocsLayout>
  )
}
