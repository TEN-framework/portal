import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { BlogQuickstart } from '@/components/guide/BlogQuickstart'
import { CopyCode } from '@/components/guide/CopyCode'
import { InlineCodeText } from '@/components/guide/InlineCode'
import { GuideSteps } from '@/components/guide/Steps'
import { i18n } from '@/lib/i18n'

const locales = ['en', 'cn'] as const

type Locale = (typeof locales)[number]

const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
  en: {
    hero: {
      eyebrow: 'TEN Community',
      title: 'Zero-to-one contribution guide',
      description:
        'Follow this beginner-friendly playbook to fork the TEN Portal repo, edit blog/docs content, run local checks, open a PR, and land your first merge.',
      primaryCta: {
        label: 'Fork portal repo',
        href: 'https://github.com/TEN-framework/portal/fork'
      },
      secondaryCta: {
        label: 'Join TEN Discord',
        href: 'https://discord.gg/VnPftUzAMJ'
      },
      note: 'The visual diagrams and detailed copy are currently provided in Simplified Chinese — pair them with auto-translation if needed.'
    },
    flow: {
      title: '13 steps from fork to merge',
      description:
        'Each block highlights what to click, which commands to run, and how to avoid the most common GitHub pitfalls.',
      caption:
        'Diagram labels are in Simplified Chinese to mirror the canonical contributor experience.'
    },
    steps: [
      {
        number: '01',
        title: 'Prepare accounts & tools',
        summary:
          'Create or sign in to GitHub, install Git, Node.js 22+, Bun 1.1+, and pick an editor/terminal you are comfortable with.',
        bullets: [
          'macOS/Linux: install Git via package manager; Windows: use Git for Windows.',
          'Install Node (via nvm or nodejs.org) and curl-install Bun, then reopen the terminal.',
          'Recommended setup: VS Code + GitHub Pull Requests extension.'
        ]
      },
      {
        number: '02',
        title: 'Fork the official repository',
        summary:
          'Navigate to github.com/TEN-framework/portal, click Fork, and create a copy under your own account.',
        bullets: [
          'Keep “Copy the default branch only” enabled for a lean fork.',
          'Your fork will live at https://github.com/<you>/portal and accepts pushes from your feature branches.',
          'Treat the fork as a safe playground — the upstream repo stays untouched.'
        ]
      },
      {
        number: '03',
        title: 'Clone & configure remotes',
        summary:
          'Clone your fork, add the upstream remote, and learn how to sync latest updates before working.',
        bullets: [
          '`git clone https://github.com/<you>/portal.git` then `cd portal`.',
          'Add upstream: `git remote add upstream https://github.com/TEN-framework/portal.git`.',
          'Sync workflow: `git fetch upstream && git checkout main && git merge upstream/main && git push origin main`.'
        ]
      },
      {
        number: '04',
        title: 'Install dependencies & preview',
        summary:
          'Install packages with Bun and boot the dev server to verify the site loads locally.',
        bullets: [
          'Run `bun install` once after cloning (re-run when dependencies change).',
          'Start `bun dev` and open http://localhost:3000 to preview docs/blog.',
          'Fix “command not found” errors by re-opening the terminal so the Bun binary is on PATH.'
        ]
      },
      {
        number: '05',
        title: 'Create a feature branch',
        summary:
          'Keep every contribution isolated on its own branch for easy reviews.',
        bullets: [
          'Use `git checkout -b feature/add-my-story` (or `fix/...`, `docs/...`).',
          'One topic per branch keeps your PR minimal and easy to review.',
          'Never commit directly to `main` on your fork.'
        ]
      },
      {
        number: '06',
        title: 'Understand the content folders',
        summary:
          'Blog posts live under `content/blog`, docs live under `content/docs`, and shared images belong in `public/images`.',
        bullets: [
          '`content/blog`: MDX with React-friendly components; filename becomes the blog slug.',
          '`content/docs`: Markdown/MDX for docs with optional `*.cn.md` counterparts and navigation via `meta.json`.',
          '`public/images`: host SVG/PNG assets so they are reachable through `/images/...` URLs.'
        ]
      },
      {
        number: '07',
        title: 'Write or edit Blog content',
        summary:
          'Copy an existing `.mdx` post, update the frontmatter, add sections, and preview via `/blog/<slug>`.',
        bullets: [
          'Required frontmatter: `title`, `description`, `author`, `date`; optional `articleLabel`, `accentWords`.',
          'Use MDX (Markdown + JSX) and import UI components when needed.',
          'Host screenshots in `public/images/<folder>/` or paste public URLs.'
        ]
      },
      {
        number: '08',
        title: 'Write or edit Docs content',
        summary:
          'Add paired English/Chinese files when possible and register new pages inside `content/docs/meta.json`.',
        bullets: [
          'At minimum, frontmatter needs `title` + `description`.',
          'Use GitHub-style callouts (`> [!TIP] ...`) for warnings or reminders.',
          'Images use `/images/...` paths; keep binary assets under 10 MB.'
        ]
      },
      {
        number: '09',
        title: 'Preview & self-check',
        summary:
          'Preview the page in the browser and run `bun run check` before committing.',
        bullets: [
          '`bun dev` → open the exact route (blog slug or docs page).',
          '`bun run check` executes lint, type-check, and link validation.',
          'If formatting fails, run `bun run format` and stage the fixes.'
        ]
      },
      {
        number: '10',
        title: 'Commit & push',
        summary:
          'Stage files in logical chunks, write semantic commit messages, and push to your fork.',
        bullets: [
          '`git status` to inspect changes; `git add` specific files or folders.',
          'Commit format suggestion: `feat(content): add real-time voice blog in zh`.',
          'Push via `git push -u origin feature/add-my-story`.'
        ]
      },
      {
        number: '11',
        title: 'Open a pull request',
        summary:
          'Compare your branch with `TEN-framework/portal:main`, describe the change, attach screenshots/tests, and submit.',
        bullets: [
          'Use “Compare & pull request” from your fork or create a PR manually.',
          'Fill in what changed + how you tested (`bun run check`, screenshots, previews).',
          'New commits pushed to the same branch automatically update the PR.'
        ]
      },
      {
        number: '12',
        title: 'Review, CI & merge',
        summary:
          'Address reviewer comments, wait for CI to pass, then maintainers will merge. Afterwards, sync your `main` branch.',
        bullets: [
          'CI runs `bun run check`; open failed jobs to see logs.',
          'Reply to review comments or push fixes; each push re-triggers CI.',
          'After merge: `git checkout main && git pull upstream main && git push origin main` and delete the feature branch.'
        ]
      }
    ],
    blogChecklist: [
      'Filename ends with `.mdx`; the filename becomes the blog slug.',
      'Frontmatter must include `title`, `description`, `author`, `date`.',
      'Optional extras: `articleLabel`, `accentWords`, cover images.',
      'Images must be publicly accessible (S3/CDN) or stored under `public/images`.',
      'MDX supports React components—remember to import the ones you use.',
      'Preview via `http://localhost:3000/blog/<slug>` while `bun dev` is running.'
    ],
    docsChecklist: [
      'Use `.md` / `.mdx` for English and `.cn.md` / `.cn.mdx` for Chinese versions.',
      'Frontmatter should declare `title` and `description`.',
      'Register new pages inside `content/docs/meta.json` to show them in the sidebar.',
      'Use Fumadocs callouts (`> [!WARNING] ...`) for emphasis.',
      'Place shared assets in `public/images` and link with `/images/...` paths.',
      'Preview pages from the Docs sidebar while `bun dev` is running.'
    ],
    commands: [
      {
        title: 'Clone & stay in sync',
        description:
          'Run these once to clone your fork and wire up the upstream remote. Re-run the sync block whenever main receives new commits.',
        code: `git clone https://github.com/<you>/portal.git\ncd portal\ngit remote add upstream https://github.com/TEN-framework/portal.git\n\n# keep your fork up to date\ngit fetch upstream\ngit checkout main\ngit merge upstream/main\ngit push origin main`
      },
      {
        title: 'Install & preview locally',
        description:
          'Bun handles both dependency installation and the dev server.',
        code: `bun install\nbun dev  # open http://localhost:3000`
      },
      {
        title: 'Quality checks',
        description:
          'Linting, type-checking, and link validation in a single command.',
        code: `bun run check\n# or run individually\nbun run lint\nbun run typecheck\nbun run format`
      },
      {
        title: 'Commit & push',
        description:
          'Stage files intentionally, craft a semantic commit, then push the branch.',
        code: `git status\ngit add content/blog/my-story.mdx public/images/*\ngit commit -m "feat(content): add real-time voice blog in zh"\ngit push -u origin feature/add-my-story`
      }
    ],
    faq: [
      {
        question: 'Bun command not found?',
        answer:
          'Re-run the Bun install script, then reopen your terminal (or `source ~/.bashrc`) so the PATH is refreshed.'
      },
      {
        question: 'Remote “upstream” already exists?',
        answer:
          'You previously added it; verify with `git remote -v` or update using `git remote set-url upstream <url>`.'
      },
      {
        question: 'Permission denied (publickey)?',
        answer:
          'Your SSH key is missing. Switch to HTTPS URLs or add a new SSH key following the GitHub guide.'
      },
      {
        question: 'Images show 404 locally?',
        answer:
          'Ensure the file is under `public/images/...` and referenced with `/images/<path>` in Markdown/MDX.'
      },
      {
        question: 'Docs/blog page not appearing?',
        answer:
          'Confirm the filename extension is correct and `bun dev` shows no compile errors. For docs, double-check `meta.json` contains the page slug.'
      }
    ],
    resources: [
      {
        label: 'Portal repository',
        description: 'Source code, issues, and pull requests',
        href: 'https://github.com/TEN-framework/portal'
      },
      {
        label: 'TEN Framework docs',
        description: 'Product documentation powered by Fumadocs',
        href: 'https://theten.ai/docs'
      },
      {
        label: 'Discord community',
        description: 'Real-time support from the TEN team & community',
        href: 'https://discord.gg/VnPftUzAMJ'
      },
      {
        label: 'Contribution checklist',
        description: 'Run `bun run check` before every PR',
        href: 'https://github.com/TEN-framework/portal/blob/main/CONTRIBUTING.md'
      }
    ]
  },
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
  title: 'TEN Contribution Guide',
  description:
    'Step-by-step instructions for contributing blog and documentation updates to the TEN Portal, from forking the repo to merging a PR.'
}

type GuidePageProps = {
  params: { lang: string }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { lang } = params
  const locale: Locale = (locales as readonly string[]).includes(lang)
    ? (lang as Locale)
    : (i18n.defaultLanguage as Locale)
  const t = guideContent[locale]

  return (
    <div className={`${inter.className} guide-theme flex flex-col`}>
      <section className='guide-hero'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20 sm:py-24'>
          <span className='guide-chip inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1 font-medium text-sm'>
            <SparkIcon />
            {t.hero.eyebrow}
          </span>
          <h1 className='font-semibold text-4xl leading-tight sm:text-5xl lg:text-6xl'>
            {t.hero.title}
          </h1>
          <p className='guide-text-muted max-w-3xl text-lg'>
            {t.hero.description}
          </p>
          <div className='flex flex-wrap gap-3'>
            <a
              href='#steps'
              className='guide-cta-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm'
            >
              {locale === 'cn' ? '开始指南' : 'Start guide'}
            </a>
            <a
              href='#commands'
              className='guide-cta-secondary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm'
            >
              {locale === 'cn' ? '常用命令' : 'Commands'}
            </a>
            <a
              href='#quickstart'
              className='guide-cta-secondary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm'
            >
              {locale === 'cn' ? '快速上手' : 'Quickstart'}
            </a>
          </div>
          {t.hero.note ? (
            <p className='guide-text-muted text-sm'>{t.hero.note}</p>
          ) : null}
          <div className='mt-4 flex flex-wrap gap-4'>
            <Link
              href={t.hero.primaryCta.href}
              target='_blank'
              rel='noreferrer'
              className='guide-cta-primary inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm shadow-sm transition hover:opacity-90'
            >
              <Github className='size-4' />
              {t.hero.primaryCta.label}
              <ArrowRight className='size-4' />
            </Link>
            <Link
              href={t.hero.secondaryCta.href}
              target='_blank'
              rel='noreferrer'
              className='guide-cta-secondary inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold text-sm transition'
            >
              <ExternalLink className='size-4' />
              {t.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      <section id='steps' className='guide-section py-16'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-10 px-6'>
          <div>
            <p className='guide-text-muted font-medium text-sm uppercase tracking-[0.2em]'>
              Guide Flow
            </p>
            <h2 className='mt-2 font-semibold text-3xl'>{t.flow.title}</h2>
            <p className='guide-text-muted mt-3 text-lg'>
              {t.flow.description}
            </p>
          </div>
          <div className='guide-panel rounded-3xl p-6'>
            <ol className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
              {t.steps.map((s) => (
                <li
                  key={`flow-${s.number}`}
                  className='flex items-center gap-3'
                >
                  <span className='guide-step-badge inline-flex size-8 items-center justify-center rounded-full'>
                    {s.number}
                  </span>
                  <span className='font-medium'>{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className='guide-text-muted text-sm'>{t.flow.caption}</p>
        </div>
      </section>

      <section id='quickstart' className='guide-section py-16'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6'>
          <BlogQuickstart locale={locale} />
        </div>
      </section>

      <section id='commands' className='guide-section py-16'>
        <div className='mx-auto w-full max-w-5xl px-6'>
          <div className='flex flex-col gap-6'>
            <h2 className='font-semibold text-3xl'>
              {locale === 'cn' ? '逐步完成以下任务' : 'Work through each step'}
            </h2>
            <GuideSteps steps={t.steps} locale={locale} />
          </div>
        </div>
      </section>

      <section className='guide-muted-section py-16'>
        <div className='mx-auto grid w-full max-w-5xl gap-10 px-6 lg:grid-cols-2'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-2xl'>Blog Checklist</h3>
            <ul className='space-y-3 text-sm'>
              {t.blogChecklist.map((item) => (
                <li
                  key={`blog-${item}`}
                  className='guide-text-muted flex gap-3'
                >
                  <span className='guide-dot mt-1 size-2 rounded-full' />
                  <InlineCodeText text={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className='space-y-4'>
            <h3 className='font-semibold text-2xl'>Docs Checklist</h3>
            <ul className='space-y-3 text-sm'>
              {t.docsChecklist.map((item) => (
                <li
                  key={`docs-${item}`}
                  className='guide-text-muted flex gap-3'
                >
                  <span className='guide-dot mt-1 size-2 rounded-full' />
                  <InlineCodeText text={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className='lg:col-span-2'>
            <div className='guide-panel overflow-hidden rounded-3xl p-6'>
              <h3 className='font-semibold text-xl'>
                {locale === 'cn'
                  ? 'Blog vs. Docs 修改清单'
                  : 'Blog vs. Docs checklist'}
              </h3>
              <p className='guide-text-muted mt-2 text-sm'>
                {locale === 'cn'
                  ? '对照确认 Frontmatter、文件命名、预览路径等关键动作'
                  : 'Cross-check frontmatter, filenames, preview paths and common steps'}
              </p>
              <div className='mt-6 grid gap-6 md:grid-cols-2'>
                <div className='rounded-2xl border p-4'>
                  <h4 className='font-semibold'>
                    {locale === 'cn'
                      ? 'Blog（content/blog）'
                      : 'Blog (content/blog)'}
                  </h4>
                  <ul className='mt-3 space-y-2 text-sm'>
                    {t.blogChecklist.map((item) => (
                      <li
                        key={`card-blog-${item}`}
                        className='guide-text-muted flex gap-3'
                      >
                        <span className='guide-dot mt-1 size-2 rounded-full' />
                        <InlineCodeText text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='rounded-2xl border p-4'>
                  <h4 className='font-semibold'>
                    {locale === 'cn'
                      ? 'Docs（content/docs）'
                      : 'Docs (content/docs)'}
                  </h4>
                  <ul className='mt-3 space-y-2 text-sm'>
                    {t.docsChecklist.map((item) => (
                      <li
                        key={`card-docs-${item}`}
                        className='guide-text-muted flex gap-3'
                      >
                        <span className='guide-dot mt-1 size-2 rounded-full' />
                        <InlineCodeText text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='guide-section py-16'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6'>
          <div>
            <h3 className='font-semibold text-3xl'>
              {locale === 'cn' ? '常用命令速查' : 'Command cheat sheet'}
            </h3>
            <p className='guide-text-muted mt-2 text-sm md:text-base'>
              {locale === 'cn'
                ? '提交前依次完成以下命令，可以有效避免 PR 被退回。'
                : 'Use these snippets as your go-to checklist before every pull request.'}
            </p>
          </div>
          <div className='grid gap-6 md:grid-cols-2'>
            {t.commands.map((snippet) => (
              <div
                key={snippet.title}
                className='guide-panel guide-panel--soft flex flex-col rounded-3xl p-6 shadow-inner'
              >
                <h4 className='font-semibold text-lg'>{snippet.title}</h4>
                <p className='guide-text-muted mt-2 text-sm'>
                  {snippet.description}
                </p>
                <CopyCode code={snippet.code} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='guide-muted-section py-16'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-10 px-6'>
          <div>
            <h3 className='font-semibold text-3xl'>FAQ</h3>
            <p className='guide-text-muted mt-2 text-sm md:text-base'>
              {locale === 'cn'
                ? '遇到报错可先参考以下解法，再到 Discord 寻求帮助。'
                : 'Start with these quick fixes before asking for help.'}
            </p>
          </div>
          <div className='space-y-4'>
            {t.faq.map((item) => (
              <details
                key={item.question}
                className='guide-panel guide-panel--soft group rounded-3xl p-5 shadow-sm'
                open
              >
                <summary className='flex cursor-pointer items-center justify-between font-semibold text-lg'>
                  {item.question}
                  <span className='guide-text-muted group-open:rotate-45'>
                    +
                  </span>
                </summary>
                <p className='guide-text-muted mt-3 text-sm leading-relaxed'>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className='guide-section py-16'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-6'>
          <h3 className='font-semibold text-3xl'>
            {locale === 'cn' ? '继续深入' : 'Keep exploring'}
          </h3>
          <div className='grid gap-4 md:grid-cols-2'>
            {t.resources.map((resource) => (
              <Link
                key={resource.label}
                href={resource.href}
                target='_blank'
                rel='noreferrer'
                className='guide-link-card rounded-3xl p-5'
              >
                <div className='flex items-center justify-between'>
                  <span className='font-semibold'>{resource.label}</span>
                  <ExternalLink className='guide-text-muted size-4' />
                </div>
                <p className='guide-text-muted mt-2 text-sm'>
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SparkIcon() {
  return (
    <svg
      className='size-4'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        d='M12 2L13.76 8.24L20 10L13.76 11.76L12 18L10.24 11.76L4 10L10.24 8.24L12 2Z'
        fill='currentColor'
      />
    </svg>
  )
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}
