import type { Metadata } from 'next'
import GuidePage from '@/app/[lang]/guide/page'

export const metadata: Metadata = {
  title: '内部贡献指南',
  description:
    'TEN Portal 内容贡献指南：Fork、编写 Blog/Docs、本地检查、提交 PR 并完成合并'
}

export default async function GuideDefaultPage() {
  return GuidePage({ params: Promise.resolve({ lang: 'cn' }) })
}
