'use client'

import Image from 'next/image'
import { useEffect, useState, type ReactNode } from 'react'
import { Inter, Playfair_Display, Fira_Code } from 'next/font/google'
import './guide.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-guide-inter'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-guide-playfair'
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-guide-fira'
})

type Step = {
  id: number
  title: string
  subtitle: string
  concept: string
  code: ReactNode
  hint: string
  visual: ReactNode
}

const steps: Step[] = [
  {
    id: 1,
    title: '注册：建立身份',
    subtitle: 'Sign up',
    concept: '准备贡献前，先完成 GitHub 账号注册、邮箱验证与双重认证，确保身份可信。',
    code: (
      <>
        https://github.com/signup
        <br />
        <span className='text-indigo-600'>启用</span> Two-Factor Auth
        <br />
        <span className='text-indigo-600'>更新</span> profile / email
      </>
    ),
    hint: '强烈建议启用 2FA，后续才能给仓库授予写入或合并权限。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-lg'>
        <p className='text-xs font-bold uppercase tracking-[0.35em] text-gray-400'>GitHub Account</p>
        <div className='mt-4 space-y-2 text-sm text-gray-700'>
          <div className='flex items-center justify-between'>
            <span>Username</span>
            <span className='font-mono text-xs text-gray-400'>@newdev</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Email</span>
            <span className='rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700'>Verified</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>2FA</span>
            <span className='text-indigo-500'>Enabled</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: '连线：SSH 与 Token',
    subtitle: 'Secure channel',
    concept: '创建 SSH Key 或 PAT，让本地 Git 能安全访问你的 GitHub 仓库。',
    code: (
      <>
        <span className='text-indigo-600'>ssh-keygen</span> -t ed25519 -C 'you@example.com'
        <br />
        <span className='text-indigo-600'>gh</span> auth login --web
        <br />
        Settings → SSH and GPG Keys → New SSH key
      </>
    ),
    hint: '如果在公司或 CI 环境，也可以生成 PAT 分别授权。',
    visual: (
      <div className='rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-sm text-indigo-900'>
        <p className='font-semibold'>SSH Key Linked</p>
        <p className='mt-1 font-mono text-xs text-indigo-600'>SHA256:ab12****</p>
        <div className='mt-4 flex items-center gap-2 text-xs text-indigo-500'>
          <span className='h-2 w-2 rounded-full bg-indigo-500' />
          Secure channel ready
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: '复刻：Fork 仓库',
    subtitle: 'Create fork',
    concept: '将 TEN Portal Fork 到你自己的命名空间，方便提交 PR。',
    code: (
      <>
        https://github.com/TEN-framework/portal/fork
        <br />
        <span className='text-indigo-600'>选择</span> “Copy the default branch only”
        <br />
        <span className='text-indigo-600'>命名</span> forks: portal
      </>
    ),
    hint: 'Fork 只复制 main 分支，既轻量也便于保持更新。',
    visual: (
      <div className='flex items-center gap-6'>
        <div className='rounded-2xl border border-gray-200 bg-white p-4 text-center shadow'>
          <p className='text-xs font-semibold text-gray-500'>TEN</p>
          <p className='text-sm font-bold text-gray-900'>portal</p>
        </div>
        <div className='guide-animate-slide h-px w-16 bg-gray-300' />
        <div className='rounded-2xl border border-indigo-300 bg-white p-4 text-center shadow-lg'>
          <p className='text-xs font-semibold text-indigo-500'>YOU</p>
          <p className='text-sm font-bold text-indigo-900'>portal</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: '克隆：拉取到本地',
    subtitle: 'Clone & upstream',
    concept: '把 Fork 代码拉到本地，同时设置 upstream 方便与官方仓库同步。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> clone git@github.com/{'<you>'}/portal.git
        <br />
        <span className='text-indigo-600'>cd</span> portal
        <br />
        <span className='text-indigo-600'>git</span> remote add upstream https://github.com/TEN-framework/portal.git
      </>
    ),
    hint: '后续 `git fetch upstream && git merge upstream/main` 就能保持最新。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-md'>
        <p className='mono text-xs text-gray-500'>$ git remote -v</p>
        <p className='mono text-xs text-gray-800 mt-2'>origin git@github.com:you/portal.git</p>
        <p className='mono text-xs text-gray-800'>upstream https://github.com/TEN-framework/portal.git</p>
      </div>
    )
  },
  {
    id: 5,
    title: '筑基：安装工具',
    subtitle: 'Tooling',
    concept: '确保 Node.js 22+、Bun 1.1+ 与 Git 已就绪，再安装 Portal 依赖。',
    code: (
      <>
        <span className='text-indigo-600'>node</span> --version
        <br />
        <span className='text-indigo-600'>bun</span> --version
        <br />
        <span className='text-indigo-600'>bun</span> install
      </>
    ),
    hint: 'Bun 安装在整个项目中通用。若缺少，先执行 `curl -fsSL https://bun.sh/install`。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 text-center shadow'>
        <p className='text-xs font-semibold text-gray-400'>Environment</p>
        <div className='mt-3 flex items-center justify-around text-sm'>
          <div>
            <p className='font-bold text-gray-900'>Node</p>
            <p className='text-green-500'>22.12</p>
          </div>
          <div>
            <p className='font-bold text-gray-900'>Bun</p>
            <p className='text-green-500'>1.1</p>
          </div>
          <div>
            <p className='font-bold text-gray-900'>Git</p>
            <p className='text-green-500'>OK</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: '运行：本地预览',
    subtitle: 'Preview',
    concept: '用 Bun Dev 启动站点，确认依赖安装完毕且页面可访问。',
    code: (
      <>
        <span className='text-indigo-600'>bun</span> dev
        <br />
        浏览器访问 http://localhost:3000
      </>
    ),
    hint: '`bun dev` 默认使用 Turbopack，热更新非常快。',
    visual: (
      <div className='relative w-[420px] overflow-hidden rounded-3xl border border-gray-200 shadow-2xl'>
        <Image
          src='https://ten-framework-assets.s3.amazonaws.com/local-preview.png'
          alt='TEN Portal local preview screenshot'
          width={840}
          height={520}
          className='h-auto w-full object-cover'
          priority
        />
      </div>
    )
  },
  {
    id: 7,
    title: '创作：分支与编辑',
    subtitle: 'Create branch',
    concept: '任何改动都基于新分支完成，并在 content/docs 或 content/blog 中提交内容。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> checkout -b feature/story
        <br />
        <span className='text-gray-400'># 编辑内容</span>
        <br />
        content/blog/my-story.mdx
      </>
    ),
    hint: 'Blog 记得写 frontmatter，Docs 为 Markdown，均支持 MDX 扩展。',
    visual: (
      <div className='group relative h-72 w-64 rounded border border-gray-200 bg-white p-5 shadow-lg'>
        <div className='mb-3 text-xs font-bold text-gray-800'>my-story.mdx</div>
        <div className='space-y-2'>
          <div className='h-1 w-full bg-gray-100' />
          <div className='h-1 w-3/4 bg-gray-100' />
          <div className='h-1 w-full bg-gray-100' />
          <div className='mt-4 rounded border border-indigo-100 bg-indigo-50 p-2'>
            <div className='text-[8px] font-mono text-indigo-800'>accentWords: [TEN]</div>
          </div>
        </div>
        <div className='absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
          Save
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: '联调：文档 / 博客预览',
    subtitle: 'Preview content',
    concept: '需要查看 Docs 或 Blog 时，分别运行对应的 preview 脚本，确认排版无误。',
    code: (
      <>
        <span className='text-indigo-600'>bun</span> run docs:dev
        <br />
        <span className='text-indigo-600'>bun</span> run blog:dev
      </>
    ),
    hint: 'Docs/Blog 预览是可选步骤，但强烈建议在内容较复杂时执行。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow'>
        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-gray-500'>Preview channels</p>
        <div className='mt-4 space-y-2 text-sm'>
          <div className='flex items-center justify-between'>
            <span>docs:dev</span>
            <span className='rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700'>localhost:3030</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>blog:dev</span>
            <span className='rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700'>localhost:4040</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: '质检：Lint & Check',
    subtitle: 'Quality gate',
    concept: '提交前运行统一的 lint、type-check、格式化命令，保持仓库一致性。',
    code: (
      <>
        <span className='text-indigo-600'>bun</span> run check
        <br />
        <span className='text-indigo-600'>bun</span> run format
      </>
    ),
    hint: '失败时按提示修复，避免在 PR 中反复修改格式。',
    visual: (
      <div className='flex flex-col items-center gap-4'>
        <div className='flex gap-2 text-indigo-600'>
          <svg className='h-6 w-6 animate-spin' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
          </svg>
        </div>
        <div className='text-xs font-mono text-gray-400'>RUNNING CHECKS...</div>
        <div className='h-1 w-48 overflow-hidden rounded-full bg-gray-200'>
          <div className='guide-animate-slide h-full bg-green-500' />
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: '定稿：Commit',
    subtitle: 'Commit',
    concept: '把所有修改以清晰的提交信息记录下来，必要时分多次 commit。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> status
        <br />
        <span className='text-indigo-600'>git</span> add .
        <br />
        <span className='text-indigo-600'>git</span> commit -m 'feat: add blog draft'
      </>
    ),
    hint: 'Commit message 建议遵循 feat/fix/docs 等语义前缀。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow'>
        <p className='mono text-xs text-gray-500'>feat: add blog draft</p>
        <p className='mt-2 text-sm text-gray-700'>+ 1 file changed · 120 insertions</p>
      </div>
    )
  },
  {
    id: 11,
    title: '交付：Push & PR',
    subtitle: 'Deliver',
    concept: '把分支推送到你自己的 Fork，并在 GitHub 上创建 Pull Request。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> push origin feature/story
        <br />
        <span className='text-gray-400'># GitHub → Compare & Pull Request</span>
      </>
    ),
    hint: 'PR 标题建议描述改动成果，描述里可贴预览链接与测试情况。',
    visual: (
      <div className='text-center'>
        <button className='mx-auto flex items-center gap-2 rounded bg-black px-8 py-3 font-mono text-sm text-white shadow-xl transition-transform duration-300 hover:scale-105'>
          OPEN PULL REQUEST
        </button>
      </div>
    )
  },
  {
    id: 12,
    title: '合流：Review & Merge',
    subtitle: 'Review',
    concept: '与维护者沟通、根据反馈进行修改并确保 PR 最终被合并。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> fetch upstream
        <br />
        <span className='text-indigo-600'>git</span> merge upstream/main
        <br />
        <span className='text-indigo-600'>git</span> push origin feature/story
      </>
    ),
    hint: '保持 PR 更新，与 reviewer 保持同步，最终由维护者点击 Merge。',
    visual: (
      <div className='rounded-2xl border border-green-200 bg-green-50 p-5 text-center shadow'>
        <p className='text-sm font-semibold text-green-700'>Reviews Approved ✓</p>
        <p className='mt-2 text-xs text-green-600'>Ready to Merge</p>
      </div>
    )
  },
  {
    id: 13,
    title: '上线：同步主分支',
    subtitle: 'Ship it',
    concept: 'Merge 完成后，sync main 并继续新的创作；生产站点会在管线中自动部署。',
    code: (
      <>
        <span className='text-indigo-600'>git</span> checkout main
        <br />
        <span className='text-indigo-600'>git</span> pull upstream main
        <br />
        <span className='text-indigo-600'>git</span> push origin main
      </>
    ),
    hint: 'TEN Portal 的部署流水线会自动把最新 main 推送到线上。',
    visual: (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 text-center shadow'>
        <p className='text-2xl font-bold text-gray-900'>恭喜，你已经完成了你的第一个 PR</p>
        <p className='mt-2 text-xs text-gray-500'>准备同步 main，迎接下一次贡献</p>
      </div>
    )
  }
]

type TabKey = 'cheat' | 'standards' | 'manual'

export function GuideClient() {
  const [stepIndex, setStepIndex] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('cheat')
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const currentStep = steps[stepIndex]
  const totalSteps = steps.length

  useEffect(() => {
    if (!overlayVisible) return
    const timer = setTimeout(() => {
      console.log('Redirect to https://theten.ai')
    }, 3000)
    return () => clearTimeout(timer)
  }, [overlayVisible])

  useEffect(() => {
    if (overlayVisible && stepIndex < totalSteps - 1) {
      setOverlayVisible(false)
    }
  }, [overlayVisible, stepIndex, totalSteps])

  const handleNext = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 900)
    if (stepIndex < totalSteps - 1) {
      setTimeout(() => setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1)), 400)
    } else {
      setTimeout(() => setOverlayVisible(true), 400)
    }
  }

  const handlePrev = () => {
    if (stepIndex === 0) return
    setOverlayVisible(false)
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const progress = ((stepIndex + 1) / totalSteps) * 100

  const rootClasses = [
    'guide-root',
    'relative',
    'flex',
    'min-h-screen',
    'w-screen',
    'flex-col',
    'overflow-hidden',
    inter.variable,
    playfair.variable,
    firaCode.variable
  ].join(' ')

  return (
    <div className={rootClasses}>
      <div className='guide-noise' />
      <nav className='z-20 flex h-16 w-full items-center justify-between border-b border-gray-200/50 bg-white/50 px-10 backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <div className='flex h-4 w-4 items-center justify-center bg-black text-[8px] font-bold text-white'>T</div>
          <div className='text-lg font-bold tracking-tighter text-gray-900'>
            theten.ai <span className='ml-1 text-sm font-normal italic text-gray-400 serif'>/ portal guide</span>
          </div>
        </div>
        <div className='flex items-center space-x-8 text-xs font-medium uppercase tracking-[0.35em] text-gray-400'>
          <span className='text-black'>Contribution</span>
          <a href='https://github.com/TEN-framework/portal' target='_blank' rel='noreferrer' className='transition hover:text-blue-600'>
            GitHub
          </a>
          <a href='https://discord.gg/tenframework' target='_blank' rel='noreferrer' className='flex items-center gap-1 transition hover:text-[#5865F2]'>
            <span className='h-2 w-2 rounded-full bg-[#5865F2]' />
            Discord
          </a>
        </div>
      </nav>

      <main className='relative z-10 flex flex-1 overflow-hidden'>
        <div className='relative flex w-1/2 flex-col justify-center px-20'>
          <div className='absolute left-20 top-10 flex items-center space-x-3'>
            <span className='text-xs font-bold tracking-[0.35em] text-indigo-800'>
              STEP {String(stepIndex + 1).padStart(2, '0')}/{String(totalSteps).padStart(2, '0')}
            </span>
            <div className='h-px w-16 bg-gray-200'>
              <div className='h-full bg-indigo-600 transition-all duration-500' style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div key={currentStep.id} className='transition-all duration-700'>
            <h1 className='serif mb-4 text-5xl font-bold leading-tight tracking-tight text-gray-900'>{currentStep.title}</h1>
            <h2 className='serif mb-8 text-2xl italic text-gray-300'>{currentStep.subtitle}</h2>
            <p className='mb-8 max-w-md border-l-2 border-indigo-100 pl-4 text-base font-light leading-relaxed text-gray-600'>
              {currentStep.concept}
            </p>

            <div
              className='group relative cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md'
              onClick={handleNext}
            >
              <div className='absolute -top-3 left-6 bg-white px-2 text-xs font-bold uppercase tracking-widest text-indigo-600'>Action</div>
              <div className='mono mb-3 text-xs text-gray-400'>// 点击执行指令</div>
              <div className='mono text-sm leading-loose text-gray-800'>{currentStep.code}</div>
              <div className={`absolute bottom-4 right-4 text-green-500 transition-opacity duration-300 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                </svg>
              </div>
            </div>

            <div className='mt-8 flex items-start gap-3 opacity-70'>
              <div className='mt-2 h-2 w-2 animate-pulse rounded-full bg-indigo-500' />
              <p className='text-xs italic text-gray-400'>{currentStep.hint}</p>
            </div>
            <div className='mt-10 flex flex-wrap items-center justify-between gap-4'>
              <button
                type='button'
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className='inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-gray-400 hover:text-gray-700'
              >
                ← 上一步
              </button>
              <button
                type='button'
                onClick={handleNext}
                className='inline-flex items-center gap-2 rounded-full bg-black px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:opacity-80'
              >
                {stepIndex === totalSteps - 1 ? '完成旅程' : '下一步 →'}
              </button>
            </div>
          </div>
        </div>

        <div className='relative flex w-1/2 items-center justify-center border-l border-gray-200 bg-[#F2F2F4]'>
          <div className='guide-stage-grid absolute inset-0' />
          <div key={currentStep.subtitle} className='relative flex h-full w-full items-center justify-center p-12 transition-opacity duration-700'>
            {currentStep.visual}
          </div>
        </div>
      </main>

      <div className={`guide-drawer fixed bottom-0 left-0 z-40 flex h-[90vh] w-full flex-col rounded-t-3xl border-t border-gray-200 bg-white shadow-2xl ${drawerOpen ? 'open' : ''}`}>
        <button
          type='button'
          className='flex h-[60px] w-full flex-shrink-0 items-center justify-center border-b border-gray-100 transition hover:bg-gray-50'
          onClick={() => setDrawerOpen((prev) => !prev)}
        >
          <div className='flex flex-col items-center gap-1'>
            <div className='h-1 w-12 rounded-full bg-gray-300' />
            <span className='mt-1 text-xs font-bold uppercase tracking-widest text-gray-500'>Blueprint / 技术蓝图</span>
          </div>
        </button>
        <div className='flex h-[50px] w-full flex-shrink-0 border-b border-gray-100 bg-white px-16'>
          {(['cheat', 'standards', 'manual'] as TabKey[]).map((tab) => (
            <button
              type='button'
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`guide-tab-button px-6 text-sm transition ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'cheat' && '速查表 Cheat Sheet'}
              {tab === 'standards' && '规范 Standards'}
              {tab === 'manual' && '全流程 Full Manual'}
            </button>
          ))}
        </div>
        <div className='guide-custom-scroll flex-1 overflow-y-auto bg-[#FAFAFA] p-12'>
          <div className={`guide-tab-content ${activeTab === 'cheat' ? 'active' : ''}`}>
            <div className='mx-auto grid max-w-6xl grid-cols-12 gap-10'>
              <div className='col-span-12 space-y-6 lg:col-span-7'>
                <h3 className='serif text-2xl text-gray-900'>常用命令 Commands</h3>
                <div>
                  <p className='mb-2 text-xs font-bold uppercase tracking-wider text-gray-400'>Sync Workflow</p>
                  <div className='mono rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-sm'>
                    git fetch upstream
                    <br />
                    git checkout main
                    <br />
                    git merge upstream/main
                    <br />
                    git push origin main
                  </div>
                </div>
                <div>
                  <p className='mb-2 text-xs font-bold uppercase tracking-wider text-gray-400'>Checks</p>
                  <div className='mono rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-700 shadow-sm'>
                    bun run check
                    <br />
                    bun run format
                  </div>
                </div>
              </div>
              <div className='col-span-12 border-l border-gray-200 pl-0 lg:col-span-5 lg:pl-10'>
                <h3 className='serif text-2xl text-gray-900'>FAQ</h3>
                <div className='mt-6 space-y-4 text-sm text-gray-600'>
                  <p>
                    <strong>Bun not found?</strong> 重启终端刷新 PATH。
                  </p>
                  <p>
                    <strong>Upstream exists?</strong> 用 <code>git remote -v</code> 检查。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`guide-tab-content ${activeTab === 'standards' ? 'active' : ''}`}>
            <div className='mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2'>
              <div>
                <h3 className='serif text-2xl text-gray-900'>Blog Frontmatter</h3>
                <div className='mt-4 rounded-lg bg-[#1e1e1e] p-6 font-mono text-sm leading-relaxed text-gray-300 shadow-lg'>
                  <span className='text-pink-500'>---</span>
                  <br />
                  <span className='text-blue-400'>title</span>: My Story
                  <br />
                  <span className='text-blue-400'>description</span>: One-line summary
                  <br />
                  <span className='text-blue-400'>author</span>: Your Name
                  <br />
                  <span className='text-blue-400'>date</span>: 2025-11-19
                  <br />
                  <span className='text-gray-500'># TEN 特有字段</span>
                  <br />
                  <span className='text-blue-400'>articleLabel</span>: Example
                  <br />
                  <span className='text-blue-400'>accentWords</span>: [TEN, Portal]
                  <br />
                  <span className='text-pink-500'>---</span>
                </div>
              </div>
              <div>
                <h3 className='serif text-2xl text-gray-900'>路径对照</h3>
                <ul className='mt-4 space-y-2 rounded border border-gray-200 bg-white p-6 font-mono text-sm text-gray-600'>
                  <li>📂 content/blog/*.mdx</li>
                  <li>📂 content/docs/*.md</li>
                  <li>📂 public/images/</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`guide-tab-content ${activeTab === 'manual' ? 'active' : ''}`}>
            <div className='mx-auto max-w-4xl'>
              <h3 className='serif mb-8 text-center text-3xl text-gray-900'>完整操作手册</h3>
              <div className='space-y-8 text-sm leading-relaxed text-gray-600'>
                <p>
                  <span className='font-bold text-gray-900'>01 准备</span>: 安装 Git、Node.js 22+、Bun 1.1+。
                </p>
                <p>
                  <span className='font-bold text-gray-900'>02 Fork</span>: 访问 TEN-framework/portal 点击 Fork。
                </p>
                <p>
                  <span className='font-bold text-gray-900'>03 Clone</span>: 克隆你的 Fork 并配置 upstream。
                </p>
                <p>...（此处包含所有 13 个步骤）</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`guide-transition-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#050505] ${overlayVisible ? 'show' : ''}`}>
        <div className='text-center text-white'>
          <div className='mono mb-4 text-4xl font-bold tracking-tight'>恭喜，你已经完成了你的第一个 PR</div>
          <p className='mono text-sm tracking-[0.25em] text-gray-400'>同步 main，等待上线</p>
        </div>
      </div>
    </div>
  )
}
