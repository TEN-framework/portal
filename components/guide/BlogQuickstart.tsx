"use client"

import { CopyCode } from "@/components/guide/CopyCode"

export function BlogQuickstart({ locale }: { locale: "en" | "cn" }) {
  const isCn = locale === "cn"
  const slug = "my-story"
  const frontmatter = `---
title: ${isCn ? "我的故事" : "My Story"}
description: ${isCn ? "一句话简介" : "One-line summary"}
author: ${isCn ? "你的名字" : "Your Name"}
date: ${new Date().toISOString().slice(0, 10)}
articleLabel: Example
accentWords: [TEN, Portal]
---

${isCn ? "这里写正文，可以使用 MDX 组件。" : "Write your content here. You can use MDX components."}
`

  return (
    <div className="guide-panel rounded-3xl p-6">
      <h3 className="font-semibold text-2xl">
        {isCn ? "快速上手：新增或修复 Blog" : "Quickstart: Add or fix a Blog"}
      </h3>
      <ol className="mt-4 space-y-6 text-sm">
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "Fork 仓库，然后克隆到本地并创建分支"
              : "Fork the repo, then clone locally and create a branch"}
          </p>
          <CopyCode
            code={`git clone https://github.com/<you>/portal.git\ncd portal\ngit checkout -b feature/add-${slug}`}
          />
        </li>
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "安装依赖并启动开发服务器"
              : "Install dependencies and start the dev server"}
          </p>
          <CopyCode code={`pnpm install\npnpm dev`} />
        </li>
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "在 content/blog 下创建 MDX 文件，填入 Frontmatter"
              : "Create an MDX file under content/blog with required frontmatter"}
          </p>
          <CopyCode code={`content/blog/${slug}.mdx`} />
          <CopyCode code={frontmatter} />
        </li>
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "浏览器预览页面"
              : "Preview the page in your browser"}
          </p>
          <CopyCode code={`http://localhost:3000/${locale}/blog/${slug}`} />
        </li>
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "运行检查并提交代码"
              : "Run checks and commit your changes"}
          </p>
          <CopyCode code={`pnpm check\ngit add .\ngit commit -m "feat(blog): add ${slug}"\ngit push -u origin feature/add-${slug}`} />
        </li>
        <li className="space-y-2">
          <p className="guide-text-muted">
            {isCn
              ? "在 GitHub 上发起 Pull Request"
              : "Open a Pull Request on GitHub"}
          </p>
          <CopyCode code={`https://github.com/TEN-framework/portal/compare`} />
        </li>
      </ol>
    </div>
  )
}