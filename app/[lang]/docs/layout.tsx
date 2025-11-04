import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { ReactNode } from 'react'
import { Footer } from '@/components/ui/footer'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

import './docs.css'

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
    >
      {children}
      <Footer />
    </DocsLayout>
  )
}
