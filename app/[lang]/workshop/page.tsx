import { CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

type LinkItem = {
  label: string
  href: string
}

type PrerequisiteItem = {
  title: string
  description: string
  link: LinkItem
}

type StepItem = {
  title: string
  description: string
  link?: LinkItem
  extra?: ReactNode
}

const prerequisites: PrerequisiteItem[] = [
  {
    title: '准备一台电脑',
    description:
      'TEN Workshop 全程在浏览器中进行，建议使用稳定的网络与最新版 Chrome 或 Edge。',
    link: {
      label: '查看 Codespaces 环境要求',
      href: 'https://docs.github.com/zh/codespaces/overview#system-requirements'
    }
  },
  {
    title: '注册 GitHub 账户',
    description:
      '所有操作都在 GitHub 上完成，如果你还没有账户，请先注册并完成邮箱验证。',
    link: {
      label: '快速注册 GitHub',
      href: 'https://github.com/signup'
    }
  },
  {
    title: '申请 ElevenLabs API Key',
    description:
      '工作坊需要实时语音能力，请提前在 ElevenLabs 官方申请个人 API Key，并妥善保管。',
    link: {
      label: '申请 ElevenLabs Key',
      href: 'https://elevenlabs.io/app/speech-synthesis'
    }
  }
]

const envSnippet = [
  'AGORA_APP_ID=d83b679bc7b3406c83f63864cb74aa99',
  'DEEPSEEK_API_KEY=sk-61a43a61c84e45078a1ade4ef5113af0',
  'DEEPGRAM_API_KEY=2e79a064da8d2041105445702140edb37aca1cb3',
  'ELEVENLABS_API_KEY=<请填入你申请的 Key>'
].join('\n')

const workspaceCommands = [
  'cd agents/examples',
  'task install',
  'task run'
].join('\n')

const steps: StepItem[] = [
  {
    title: 'Fork TEN 代码仓库',
    description:
      '打开 TEN Framework 的 GitHub 仓库，点击右上角的 Fork，将项目复制到你的个人空间，方便后续使用 Codespaces。',
    link: {
      label: '打开 TEN Framework 仓库',
      href: 'https://github.com/TEN-framework/TEN-framework'
    }
  },
  {
    title: '创建 Codespace 在线开发环境',
    description:
      "在你的 Fork 页面点击 'Code' → 'Create codespace on main'，等待几分钟即可在浏览器内打开开发环境。",
    link: {
      label: '了解 Codespaces 创建流程',
      href: 'https://docs.github.com/zh/codespaces/getting-started/quickstart'
    }
  },
  {
    title: '配置环境变量',
    description:
      '在 Codespaces 根目录创建 `.env` 文件，将以下密钥贴入。前三个值已为你准备好，ElevenLabs 需要使用你刚申请的 Key。',
    extra: (
      <pre className='mt-4 overflow-auto rounded-xl bg-slate-900/60 p-4 text-slate-100 text-sm shadow-inner dark:bg-slate-900'>
        <code className='whitespace-pre'>{envSnippet}</code>
      </pre>
    )
  },
  {
    title: '安装依赖并启动示例',
    description:
      '密钥准备完毕后，进入 `agents/examples` 目录，依次执行 `task install` 与 `task run`，即可在终端看到工作坊示例运行日志。',
    extra: (
      <pre className='mt-4 overflow-auto rounded-xl bg-slate-100 p-4 text-slate-900 text-sm shadow-inner dark:bg-slate-800 dark:text-slate-100'>
        <code className='whitespace-pre'>{workspaceCommands}</code>
      </pre>
    )
  },
  {
    title: '完结撒花',
    description:
      '示例运行成功后，你已经完成 TEN Workshop 的所有准备。接下来可以根据导师指引继续扩展、调试或部署自己的智能体。'
  }
]

export const metadata: Metadata = {
  title: 'TEN Workshop 全流程指南',
  description:
    '使用 GitHub Codespaces 一站式完成 TEN Framework 工作坊准备，从 Fork 仓库、配置密钥到运行示例。'
}

export default function WorkshopPage() {
  return (
    <div className='flex flex-col'>
      <section className='relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'>
        <div className='-top-24 -left-24 absolute size-[420px] rounded-full bg-sky-500/10 blur-3xl' />
        <div className='-bottom-32 -right-6 absolute size-[520px] rounded-full bg-emerald-400/10 blur-3xl' />

        <div className='relative mx-auto w-full max-w-5xl px-6 py-20 sm:py-24'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/80 backdrop-blur'>
            <Sparkles className='size-4' />
            TEN Workshop 指南
          </div>
          <h1 className='mt-6 font-semibold text-4xl leading-tight sm:text-5xl lg:text-6xl'>
            TEN Framework 工作坊
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-white/80'>
            按照下方步骤操作，从 Fork 仓库、配置 Codespaces，到填入所需密钥，
            让我们一起快速进入 AI 智能体的实战环节。
          </p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <a
              href='https://github.com/TEN-framework/TEN-framework'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 text-sm shadow-sm transition hover:bg-slate-100'
            >
              前往 GitHub 仓库
              <ExternalLink className='size-4' />
            </a>
            <a
              href='https://discord.gg/VnPftUzAMJ'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-sm text-white transition hover:border-white hover:bg-white/10'
            >
              加入 TEN Discord
              <ExternalLink className='size-4' />
            </a>
          </div>
        </div>
      </section>

      <section className='bg-white py-16 dark:bg-slate-950/90 dark:text-white'>
        <div className='mx-auto w-full max-w-5xl px-6'>
          <div className='max-w-3xl'>
            <h2 className='font-semibold text-3xl'>
              前置条件：准备好你的工具箱
            </h2>
            <p className='mt-3 text-slate-600 dark:text-slate-200'>
              在正式开工前，请先确认以下准备事项都已完成。每一项都附上了便捷链接，方便你快速跳转查看详情。
            </p>
          </div>

          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            {prerequisites.map((item) => (
              <div
                key={item.title}
                className='hover:-translate-y-1 flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900'
              >
                <div className='inline-flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200'>
                  <CheckCircle2 className='size-5' />
                </div>
                <h3 className='mt-6 font-semibold text-lg text-slate-900 dark:text-white'>
                  {item.title}
                </h3>
                <p className='mt-3 flex-1 text-slate-600 text-sm dark:text-slate-300'>
                  {item.description}
                </p>
                <a
                  href={item.link.href}
                  target='_blank'
                  rel='noreferrer'
                  className='mt-4 inline-flex items-center gap-2 font-semibold text-emerald-600 text-sm hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'
                >
                  {item.link.label}
                  <ExternalLink className='size-4' />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-slate-950 py-16 text-white'>
        <div className='mx-auto w-full max-w-5xl px-6'>
          <div className='max-w-3xl'>
            <h2 className='font-semibold text-3xl'>正式开工：跟着步骤动手做</h2>
            <p className='mt-3 text-white/70'>
              按顺序完成以下五个步骤，你就能在浏览器内跑起来 TEN Framework
              的示例智能体，并在工作坊中与导师保持同频。
            </p>
          </div>

          <ol className='mt-10 space-y-8'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className='rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur'
              >
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                  <span className='inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/20 font-semibold text-emerald-200 text-lg sm:mt-1'>
                    {index + 1}
                  </span>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-xl'>{step.title}</h3>
                    <p className='mt-3 text-sm text-white/80'>
                      {step.description}
                    </p>
                    {step.link ? (
                      <a
                        href={step.link.href}
                        target='_blank'
                        rel='noreferrer'
                        className='mt-4 inline-flex items-center gap-2 font-semibold text-emerald-300 text-sm hover:text-emerald-200'
                      >
                        {step.link.label}
                        <ExternalLink className='size-4' />
                      </a>
                    ) : null}
                    {step.extra}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className='fixed bottom-6 right-6 z-50 flex max-w-xs flex-col gap-2 rounded-2xl bg-amber-400/90 px-5 py-4 text-slate-950 shadow-2xl ring-4 ring-amber-300/40 backdrop-blur'>
        <span className='text-xs font-semibold uppercase tracking-widest text-amber-900/80'>
          Wi-Fi 信息
        </span>
        <div className='space-y-1 text-sm font-medium'>
          <p>账号：多瑙厅</p>
          <p>密码：DN20251101</p>
        </div>
      </div>
    </div>
  )
}
