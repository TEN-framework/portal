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
      <div className='flex min-h-[100dvh] flex-col'>
        <main className='flex flex-1 items-center justify-center'>
          {children}
        </main>
        <div aria-hidden className='relative z-10 border-border border-t' />
        <Footer />
      </div>
    </HomeLayout>
  )
}
