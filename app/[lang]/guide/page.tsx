import type { Metadata } from 'next'
import InteractiveGuide from '@/components/guide/InteractiveGuide'

const locales = ['cn'] as const
const defaultLocale = 'cn'

type Locale = (typeof locales)[number]

type Step = {
  number: string
  title: string
  summary: string
  bullets: string[]
}

type CommandSnippet = {
  title: string
  description: string
  code: string
}

type FAQ = {
  question: string
  answer: string
}

type GuideCopy = {
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    note?: string
  }
  flow: {
    title: string
    description: string
    caption: string
  }
  steps: Step[]
  blogChecklist: string[]
  docsChecklist: string[]
  commands: CommandSnippet[]
  faq: FAQ[]
  resources: { label: string; href: string; description: string }[]
}

const guideContent: Record<Locale, GuideCopy> = {
  cn: {
    hero: {
      eyebrow: 'TEN 社区',
      title: '零基础内容贡献指南',
      description:
        '按照 13 个步骤完成 Fork 仓库、写 Blog/Docs、运行本地检查、提交 PR 并等待合并，新手也能一次搞定。',
      primaryCta: {
        label: '立即 Fork 仓库',
        href: 'https://github.com/TEN-framework/portal/fork'
      },
      secondaryCta: {
        label: '加入 Discord 社群',
        href: 'https://discord.gg/VnPftUzAMJ'
      }
    },
    flow: {
      title: '从 Fork 到合并的 13 个步骤',
      description:
        '每一步都写了需要点击哪里、输入什么命令，以及最常见的坑位提醒，照着做即可完成首次贡献。',
      caption: '下方示意图展示完整流程（Fork → 本地修改 → PR → 合并）。'
    },
    steps: [
      {
        number: '01',
        title: '准备账号与工具',
        summary:
          '注册或登录 GitHub，安装 Git、Node.js 22+、Bun 1.1+，并准备常用编辑器/终端。',
        bullets: [
          'macOS/Linux 建议用 Homebrew / 包管理器安装 Git；Windows 使用 Git for Windows。',
          'Node 可用 nvm 或官网下载，Bun 执行官方安装脚本后重新打开终端。',
          '推荐 VS Code + GitHub Pull Requests 扩展，方便预览与提交。'
        ]
      },
      {
        number: '02',
        title: 'Fork 官方仓库',
        summary:
          '打开 github.com/TEN-framework/portal，点击右上角 Fork，把仓库复制到自己的账号。',
        bullets: [
          '保持 “Copy the default branch only” 选中，Fork 更干净。',
          'Fork 之后地址类似 https://github.com/<you>/portal，后续推送都指向这里。',
          'Fork 只是副本，官方 upstream 仓库不会被直接修改。'
        ]
      },
      {
        number: '03',
        title: '克隆并配置远程',
        summary: '克隆自己的 Fork，添加 upstream，随时同步官方最新改动。',
        bullets: [
          '`git clone https://github.com/<you>/portal.git` → `cd portal`。',
          '添加 upstream：`git remote add upstream https://github.com/TEN-framework/portal.git`。',
          '同步命令：`git fetch upstream && git checkout main && git merge upstream/main && git push origin main`。'
        ]
      },
      {
        number: '04',
        title: '安装依赖并运行',
        summary: '使用 Bun 安装依赖并启动开发服务器，确认站点能在本地打开。',
        bullets: [
          '首次进入仓库执行 `bun install`，依赖更新时也需重新执行。',
          '运行 `bun dev`，浏览器访问 http://localhost:3000 预览 Docs/Blog。',
          '若提示 “command not found”，重新打开终端让 Bun 路径生效。'
        ]
      },
      {
        number: '05',
        title: '创建工作分支',
        summary: '每个主题使用单独分支，方便提 PR 与代码评审。',
        bullets: [
          '示例：`git checkout -b feature/add-my-story`，也可用 `fix/`、`docs/` 前缀。',
          '一个分支只做一件事，PR 更聚焦。',
          '不要直接在 `main` 上提交。'
        ]
      },
      {
        number: '06',
        title: '熟悉内容目录',
        summary:
          '`content/blog` 存放 Blog，`content/docs` 存放文档，公共图片放在 `public/images`。',
        bullets: [
          '`content/blog` 使用 MDX，文件名决定最终 slug。',
          '`content/docs` 支持中英文版本，导航顺序由 `meta.json` 控制。',
          '`public/images` 存放可公开访问的 SVG/PNG，引用时用 `/images/...` 路径。'
        ]
      },
      {
        number: '07',
        title: '编写或修改 Blog',
        summary:
          '复制一篇 `.mdx` 模板，补全 Frontmatter、正文、插图，然后访问 `/blog/<slug>` 预览。',
        bullets: [
          '必填字段：`title`、`description`、`author`、`date`；可选 `articleLabel`、`accentWords`。',
          'MDX 可直接写 React 组件，需要时在顶部 `import`。',
          '图片放到 `public/images/<folder>/` 或使用公网链接。'
        ]
      },
      {
        number: '08',
        title: '编写或修改 Docs',
        summary:
          '创建中英文文件，记得在 `content/docs/meta.json` 注册页面，才能显示在左侧导航。',
        bullets: [
          'Frontmatter 至少包含 `title` 和 `description`。',
          '支持 GitHub 风格提示块：`> [!TIP]`、`> [!WARNING]`。',
          '图片统一使用 `/images/...` 路径，避免提交超过 10 MB 的大文件。'
        ]
      },
      {
        number: '09',
        title: '本地预览与自检',
        summary: '每次提交前先在浏览器确认页面正常，再运行 `bun run check`。',
        bullets: [
          '保持 `bun dev` 运行，访问对应路由确认样式/内容。',
          '`bun run check` 会一次性执行 lint、类型检查和链接校验。',
          '如果格式化失败，执行 `bun run format` 自动修复。'
        ]
      },
      {
        number: '10',
        title: '提交与推送',
        summary:
          '按模块分批 `git add`，使用语义化 commit 信息，然后推送到自己的远程分支。',
        bullets: [
          '`git status` 查看变更；`git add` 指定文件或目录。',
          'commit 建议：`feat(content): add real-time voice blog in zh`。',
          '推送命令：`git push -u origin feature/add-my-story`。'
        ]
      },
      {
        number: '11',
        title: '在 GitHub 发起 PR',
        summary:
          '选择 `TEN-framework/portal:main` 作为 base，填写改动说明与自测结果后提交。',
        bullets: [
          '可在 Fork 页面点 “Compare & pull request”，也可手动新建。',
          'PR 描述写清楚 “改了什么 + 怎样测试（命令/截图/预览链接）”。',
          '后续如需修改，继续在本地提交并推送，PR 会自动更新。'
        ]
      },
      {
        number: '12',
        title: 'Review、CI 与合并',
        summary:
          '等待 CI（`bun run check`）通过，按 reviewer 建议修改，最终由维护者合并，并同步本地 `main`。',
        bullets: [
          'CI 失败时点击日志查看原因，在本地修复后再次推送。',
          '回复 reviewer 评论或直接推送修复；每次推送都会重新触发 CI。',
          '合并后执行 `git checkout main && git pull upstream main && git push origin main` 并删除分支。'
        ]
      }
    ],
    blogChecklist: [
      '文件名以 `.mdx` 结尾，文件名就是最终 slug。',
      'Frontmatter 必填：`title`、`description`、`author`、`date`。',
      '可选字段：`articleLabel`、`accentWords`、封面图等。',
      '图片需可公开访问，或存放在 `public/images` 后以 `/images/...` 引用。',
      'MDX 可写 React 组件，别忘了正确 import。',
      '启动 `bun dev` 后访问 `http://localhost:3000/blog/<slug>` 预览。'
    ],
    docsChecklist: [
      '英文使用 `.md/.mdx`，中文使用 `.cn.md/.cn.mdx`。',
      'Frontmatter 至少包含 `title` 和 `description`。',
      '新增页面记得在 `content/docs/meta.json` 中登记。',
      '善用提示块：`> [!TIP]`、`> [!WARNING]`。',
      '所有图片都放在 `public/images`，引用 `/images/...` 路径。',
      '保持 `bun dev` 运行，在 Docs 侧边栏点击对应条目预览。'
    ],
    commands: [
      {
        title: '克隆并同步 upstream',
        description:
          '首次克隆与添加 upstream，后续随时执行同步命令保持最新版。',
        code: `git clone https://github.com/<you>/portal.git\ncd portal\ngit remote add upstream https://github.com/TEN-framework/portal.git\n\n# 同步官方 main\ngit fetch upstream\ngit checkout main\ngit merge upstream/main\ngit push origin main`
      },
      {
        title: '安装依赖与本地预览',
        description: 'Bun 负责安装依赖和启动 dev server。',
        code: `bun install\nbun dev  # 打开 http://localhost:3000`
      },
      {
        title: '质量检查',
        description: '提交前务必执行 `bun run check`，也可以按需拆开运行。',
        code: `bun run check\n# 单独执行\nbun run lint\nbun run typecheck\nbun run format`
      },
      {
        title: '提交与推送',
        description: '分批添加文件、语义化 commit，然后推送到个人远程分支。',
        code: `git status\ngit add content/blog/my-story.mdx public/images/*\ngit commit -m "feat(content): add real-time voice blog in zh"\ngit push -u origin feature/add-my-story`
      }
    ],
    faq: [
      {
        question: 'bun: command not found？',
        answer:
          '重新执行 Bun 安装脚本，随后重开终端或 `source ~/.bashrc`，确保 PATH 生效。'
      },
      {
        question: 'upstream 已存在？',
        answer:
          '说明之前添加过，可忽略或用 `git remote set-url upstream <url>` 更新，`git remote -v` 可查看。'
      },
      {
        question: 'Permission denied (publickey)？',
        answer:
          'SSH Key 未配置，可暂时改用 HTTPS 链接，或按 GitHub 文档添加新的公钥。'
      },
      {
        question: '图片 404？',
        answer:
          '确认图片位于 `public/images/...`，Markdown/MDX 中以 `/images/<path>` 引用。'
      },
      {
        question: '页面没有显示？',
        answer:
          '检查文件后缀是否正确，`bun dev` 是否报错；Docs 页面记得在 `meta.json` 中登记 slug。'
      }
    ],
    resources: [
      {
        label: 'Portal 仓库',
        description: '查看源码、Issue 与 PR',
        href: 'https://github.com/TEN-framework/portal'
      },
      {
        label: 'TEN 官方文档',
        description: '更多产品与 API 说明',
        href: 'https://theten.ai/docs'
      },
      {
        label: 'Discord 社群',
        description: '实时解答、活动通知',
        href: 'https://discord.gg/VnPftUzAMJ'
      },
      {
        label: '贡献检查清单',
        description: '提交前跑一遍 `bun run check`',
        href: 'https://github.com/TEN-framework/portal/blob/main/CONTRIBUTING.md'
      }
    ]
  }
}

export const metadata: Metadata = {
  title: 'TEN 内容贡献指南',
  description:
    'TEN Portal 内部内容贡献指南：Fork 仓库、编写 Blog/Docs、运行检查、提交 PR 并完成合并。'
}

type GuidePageProps = {
  params: Promise<{ lang: string }>
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { lang } = await params
  const locale: Locale = lang === 'cn' ? 'cn' : defaultLocale
  const t = guideContent[locale]

  return <InteractiveGuide locale={locale} t={t} />
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}
