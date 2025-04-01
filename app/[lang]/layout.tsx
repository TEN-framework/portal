import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider'
import { I18nProvider, type Translations } from 'fumadocs-ui/i18n'
import { Inter } from 'next/font/google'
import { NextProvider } from 'fumadocs-core/framework/next';

import '../global.css'

const inter = Inter({
  subsets: ['latin'],
})

const cn: Partial<Translations> = {
  search: '搜索',
  searchNoResult: '未找到结果',
  toc: '目录',
  tocNoHeadings: '没有标题',
  lastUpdate: '最后更新',
  chooseLanguage: '选择语言',
  nextPage: '下一页',
  previousPage: '上一页',
  chooseTheme: '选择主题',
  editOnGithub: '在 GitHub 上编辑'
}

// available languages that will be displayed on UI
// make sure `locale` is consistent with your i18n config
const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: '中文',
    locale: 'cn',
  },
]

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const lang = (await params).lang

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <NextProvider>
          <I18nProvider
            locale={lang}
            locales={locales}
            translations={{ cn }[lang]}
        >
            <RootProvider>{children}</RootProvider>
          </I18nProvider>
        </NextProvider>
      </body>
    </html>
  )
}
