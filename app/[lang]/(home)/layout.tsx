import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'
import { Footer } from '@/components/ui/footer'
import { baseOptions } from '@/lib/layout.shared'

export default async function Layout({
  params,
  children
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang } = await params

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="min-h-[100dvh] flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>
        <Footer />
      </div>
    </HomeLayout>
  )
}
