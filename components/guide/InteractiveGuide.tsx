'use client'

import confetti from 'canvas-confetti'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Github,
  Sparkles
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { CopyCode } from '@/components/guide/CopyCode'

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

type InteractiveGuideProps = {
  t: GuideCopy
  locale: 'cn'
}

type StepOverride = {
  action?: string
  hint?: string
  visual?: ReactNode
}

type InteractiveStep = {
  id: number
  title: string
  subtitle: string
  concept: string
  action: string
  hint: string
  visual: ReactNode
}

export default function InteractiveGuide({ t }: InteractiveGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'cheat' | 'standards' | 'manual'>(
    'cheat'
  )
  const [showFinale, setShowFinale] = useState(false)

  const frontmatterSnippet = useMemo(
    () => `---
title: 我的故事
description: 一句话简介
author: 你的名字
date: ${new Date().toISOString().slice(0, 10)}
articleLabel: Example
accentWords: [TEN, Portal]
---`,
    []
  )

  const baseOverrides = useMemo<Record<number, StepOverride>>(
    () => ({
      3: {
        action: `git clone https://github.com/<you>/portal.git
cd portal
git remote add upstream https://github.com/TEN-framework/portal.git`,
        hint: 'Fork 保护 upstream，保持同步再动手更安全。',
        visual: (
          <div className='flex items-center gap-8'>
            <div className='flex h-28 w-24 flex-col items-center justify-center rounded border-2 border-slate-300 bg-white shadow-sm'>
              <span className='font-bold text-[10px] text-slate-800'>TEN</span>
              <span className='font-mono text-[9px] text-slate-400'>REPO</span>
            </div>
            <div className='relative h-[1px] w-20 overflow-hidden bg-slate-200'>
              <div className='absolute inset-0 animate-slide bg-emerald-600' />
            </div>
            <div className='flex h-28 w-24 flex-col items-center justify-center rounded border-2 border-emerald-500 bg-emerald-50 shadow-lg'>
              <span className='font-bold text-[10px] text-emerald-800'>
                YOU
              </span>
              <span className='font-mono text-[9px] text-emerald-400'>
                FORK
              </span>
            </div>
          </div>
        )
      },
      4: {
        action: `bun install
bun dev  # 打开 http://localhost:3000`,
        hint: '看到 Ready 输出，就可以在浏览器预览 Docs/Blog 了。',
        visual: (
          <div className='w-full max-w-md rounded-2xl border border-slate-800 bg-[#0A0A0A] shadow-2xl'>
            <div className='flex h-6 items-center gap-1.5 border-slate-800 border-b bg-black/60 px-3'>
              <div className='h-2 w-2 rounded-full bg-red-500/50' />
              <div className='h-2 w-2 rounded-full bg-yellow-500/50' />
            </div>
            <div className='flex h-56 flex-col items-center justify-center gap-3 p-8 text-center'>
              <p className='font-semibold text-3xl text-white tracking-tight'>
                TEN <span className='text-emerald-400'>Framework</span>
              </p>
              <p className='font-mono text-slate-400 text-xs'>
                The Agentic AI Framework
              </p>
              <span className='animate-pulse rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 font-mono text-[11px] text-emerald-300'>
                localhost:3000
              </span>
            </div>
          </div>
        )
      },
      5: {
        action: `git checkout -b feature/my-story
# 在 content/blog 下创建 *.mdx
accentWords: [TEN, AI]`,
        hint: '一个分支只处理一个主题，PR 会更聚焦。',
        visual: (
          <div className='relative w-64 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg'>
            <div className='font-semibold text-slate-800 text-xs'>
              my-story.mdx
            </div>
            <div className='mt-4 space-y-2'>
              <div className='h-1 w-full bg-slate-100' />
              <div className='h-1 w-3/4 bg-slate-100' />
              <div className='h-1 w-full bg-slate-100' />
              <div className='rounded border border-emerald-100 bg-emerald-50 p-2'>
                <div className='font-mono text-[10px] text-emerald-800'>
                  accentWords: [TEN]
                </div>
              </div>
            </div>
            <div className='absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-semibold text-[11px] text-white shadow-lg'>
              Save
            </div>
          </div>
        )
      },
      9: {
        action: `bun run check
bun run format`,
        hint: 'bun run check 会一次性跑 lint、typecheck 和链接校验。',
        visual: (
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center gap-2 text-emerald-600'>
              <svg
                aria-hidden='true'
                className='h-7 w-7 animate-spin'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                />
              </svg>
            </div>
            <p className='font-mono text-slate-500 text-xs'>
              CHECKING TYPES...
            </p>
            <div className='h-2 w-48 overflow-hidden rounded-full bg-slate-200'>
              <div className='h-full animate-slide bg-emerald-500' />
            </div>
          </div>
        )
      },
      11: {
        action: `git push -u origin feature/my-story
# 在 GitHub 上创建 PR`,
        hint: '描述清楚改动与自测结果，等待合并即可。',
        visual: (
          <div className='text-center'>
            <button
              type='button'
              className='mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-sm text-white shadow-xl transition hover:scale-[1.02]'
            >
              OPEN PULL REQUEST
              <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        )
      }
    }),
    []
  )

  const genericVisual = useCallback(
    (id: number, title: string) => (
      <div className='w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm'>
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white'>
          {String(id).padStart(2, '0')}
        </div>
        <p className='mt-3 font-semibold text-slate-900 text-sm'>{title}</p>
        <p className='mt-1 text-slate-500 text-xs'>逐项完成，保持节奏</p>
      </div>
    ),
    []
  )

  const interactiveSteps = useMemo<InteractiveStep[]>(
    () =>
      t.steps.map((s, index) => {
        const id = index + 1
        const override = baseOverrides[id]
        const action =
          override?.action ??
          (s.bullets.length
            ? s.bullets.map((b) => `- ${b}`).join('\n')
            : s.summary)
        return {
          id,
          title: s.title,
          subtitle: `Step ${String(id).padStart(2, '0')}`,
          concept: s.summary,
          action,
          hint:
            override?.hint ?? '对照要点逐步完成，提交前跑一遍自检命令更安心。',
          visual: override?.visual ?? genericVisual(id, s.title)
        }
      }),
    [baseOverrides, genericVisual, t.steps]
  )

  const step = interactiveSteps[currentStep]
  const progress = Math.round(
    ((currentStep + 1) / Math.max(1, interactiveSteps.length)) * 100
  )

  const toggleDrawer = () => setDrawerOpen((prev) => !prev)
  const switchTab = (tab: 'cheat' | 'standards' | 'manual') => setActiveTab(tab)

  const isLikelyCode = (value: string) => {
    const trimmed = value.trim()
    return (
      trimmed.includes('\n') ||
      /^(`?)(bun|git|npm|pnpm|yarn|cd|mkdir|curl|npx)\b/.test(trimmed)
    )
  }

  const handleNext = () => {
    if (currentStep < interactiveSteps.length - 1) {
      setCurrentStep((p) => p + 1)
    } else {
      confetti({
        particleCount: 160,
        spread: 90,
        startVelocity: 40,
        gravity: 0.8,
        origin: { y: 0.3 }
      })
      setShowFinale(true)
      setTimeout(() => setShowFinale(false), 1400)
    }
  }

  const handlePrev = () => {
    setCurrentStep((p) => Math.max(0, p - 1))
  }

  const isLastStep = currentStep === interactiveSteps.length - 1

  return (
    <div className='relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900'>
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.07]'
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")"
        }}
      />

      <nav className='relative z-20 flex h-16 items-center justify-between border-white/60 border-b bg-white/70 px-6 backdrop-blur'>
        <div className='font-semibold text-base text-slate-900 tracking-tight'>
          Portal Guide
        </div>
        <div className='flex items-center gap-5 font-medium text-slate-400 text-xs uppercase tracking-[0.2em]'>
          <span className='text-slate-900'>Contribution</span>
          <a
            className='transition hover:text-emerald-600'
            href={t.hero.primaryCta.href}
            target='_blank'
            rel='noreferrer'
          >
            GitHub
          </a>
          <a
            className='flex items-center gap-1 transition hover:text-emerald-500'
            href={t.hero.secondaryCta.href}
            target='_blank'
            rel='noreferrer'
          >
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            Discord
          </a>
        </div>
      </nav>

      <main className='relative z-10 grid min-h-[75vh] grid-cols-1 lg:grid-cols-2'>
        <div className='relative flex flex-col justify-center px-6 py-10 sm:px-12 md:px-16'>
          <div className='absolute top-6 left-6 flex items-center gap-3 sm:left-12'>
            <span className='font-bold text-emerald-800 text-xs tracking-[0.2em]'>
              STEP {String(step.id).padStart(2, '0')}/
              {String(interactiveSteps.length).padStart(2, '0')}
            </span>
            <div className='h-[2px] w-16 bg-slate-200'>
              <div
                className='h-full bg-emerald-600 transition-all duration-500'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className='mt-12 space-y-4'>
            <span className='inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1 font-medium text-emerald-600 text-xs'>
              <Sparkles className='h-4 w-4' />
              TEN Portal 内部指南
            </span>
            <div className='space-y-2'>
              <h1 className='font-semibold text-4xl leading-tight tracking-tight sm:text-5xl'>
                {step.title}
              </h1>
              <p className='text-lg text-slate-400'>{step.subtitle}</p>
            </div>
            <p className='max-w-xl border-emerald-100 border-l-2 pl-4 text-base text-slate-600 leading-relaxed'>
              {step.concept}
            </p>
            <div className='flex flex-wrap items-center gap-2 text-slate-500 text-xs'>
              <span className='font-semibold text-slate-700'>快速跳转</span>
              <select
                value={currentStep}
                onChange={(e) => setCurrentStep(Number(e.target.value))}
                className='rounded border border-slate-200 bg-white px-2 py-1 font-medium text-[11px] text-slate-700 shadow-sm'
              >
                {interactiveSteps.map((s, index) => (
                  <option key={s.id} value={index}>
                    Step {String(s.id).padStart(2, '0')} · {s.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type='button'
              className='group hover:-translate-y-0.5 relative w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-slate-50'
              onClick={handleNext}
            >
              <div className='-top-3 absolute left-6 rounded-full bg-white px-2 font-bold text-[11px] text-emerald-600 uppercase tracking-[0.2em]'>
                Action
              </div>
              <div className='font-mono text-[11px] text-slate-400'>
                {/* 点击执行指令 */}
              </div>
              {isLikelyCode(step.action) ? (
                <div className='mt-3'>
                  <CopyCode code={step.action} />
                </div>
              ) : (
                <pre className='mt-2 whitespace-pre-wrap font-mono text-slate-800 text-sm leading-relaxed'>
                  {step.action}
                </pre>
              )}
              <div className='absolute right-4 bottom-4 text-emerald-500 opacity-0 transition-opacity duration-300 group-active:opacity-100'>
                <CheckCircle2 className='h-6 w-6' />
              </div>
            </button>

            <div className='flex items-start gap-3 text-slate-400 text-xs'>
              <span className='mt-1 h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
              <p className='italic'>{step.hint}</p>
            </div>

            <div className='flex flex-wrap gap-3 pt-2'>
              <button
                type='button'
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-semibold text-sm transition ${
                  currentStep === 0
                    ? 'cursor-not-allowed border-slate-200 text-slate-300'
                    : 'border-slate-300 text-slate-700 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                上一步
              </button>
              <button
                type='button'
                onClick={handleNext}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 font-semibold text-sm shadow-sm transition ${
                  isLastStep
                    ? 'bg-emerald-600 text-white hover:scale-[1.01]'
                    : 'bg-slate-900 text-white hover:scale-[1.01]'
                }`}
              >
                {isLastStep ? '完成' : '下一步'}
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>

            <div className='flex flex-wrap gap-5 pt-3'>
              <a
                href={t.hero.primaryCta.href}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 font-semibold text-sm text-white shadow-sm transition hover:scale-[1.01]'
              >
                <Github className='h-4 w-4' />
                {t.hero.primaryCta.label}
              </a>
              <a
                href={t.hero.secondaryCta.href}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2 font-semibold text-slate-700 text-sm transition hover:border-emerald-300 hover:text-emerald-600'
              >
                <ExternalLink className='h-4 w-4' />
                {t.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>

        <div className='relative flex min-h-[480px] items-center justify-center overflow-hidden border-slate-200 border-t bg-slate-100/60 lg:border-t-0 lg:border-l'>
          <div className='pointer-events-none absolute inset-0 opacity-[0.03]'>
            <div className='absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)]' />
          </div>
          <div className='relative z-10 flex w-full max-w-xl items-center justify-center p-10'>
            <div
              key={step.id}
              className='flex w-full animate-visual-in items-center justify-center'
            >
              {step.visual}
            </div>
          </div>
        </div>
      </main>

      <section className='relative z-10 border-white/70 border-t bg-white/70 px-6 py-10 pb-20 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl flex-col gap-4'>
          <p className='font-medium text-slate-400 text-sm uppercase tracking-[0.25em]'>
            {t.flow.title}
          </p>
          <p className='text-lg text-slate-600'>{t.flow.description}</p>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {t.steps.map((s) => (
              <span
                key={s.number}
                className='rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 text-xs'
              >
                {s.number} · {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`fixed right-0 bottom-0 left-0 z-30 transition-transform duration-700 ${drawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-64px)]'}`}
      >
        <button
          type='button'
          className='flex h-16 w-full cursor-pointer items-center justify-center border-slate-200 border-b bg-white/90 backdrop-blur transition hover:bg-white'
          onClick={toggleDrawer}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDrawer()
            }
          }}
        >
          <div className='flex items-center gap-2 font-semibold text-slate-500 text-xs uppercase tracking-[0.25em]'>
            <span className='h-10 w-1 rounded-full bg-slate-200' />
            Blueprint / 技术蓝图
            <ChevronDown
              className={`h-4 w-4 transition ${drawerOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        <div className='border-slate-200 border-b bg-white/90 px-4 backdrop-blur sm:px-10'>
          <div className='flex gap-4 text-sm'>
            {['cheat', 'standards', 'manual'].map((tab) => (
              <button
                type='button'
                key={tab}
                onClick={() => switchTab(tab as typeof activeTab)}
                className={`border-b-2 px-4 py-3 font-semibold transition ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'cheat'
                  ? '速查表'
                  : tab === 'standards'
                    ? '规范'
                    : '全流程'}
              </button>
            ))}
          </div>
        </div>

        <div className='max-h-[70vh] overflow-y-auto border-slate-100 border-t bg-[#f9fafb] px-4 py-10 shadow-2xl sm:px-10'>
          {activeTab === 'cheat' ? (
            <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-2xl text-slate-900'>
                  常用命令
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  {t.commands.map((cmd) => (
                    <div
                      key={cmd.title}
                      className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'
                    >
                      <p className='font-semibold text-slate-400 text-xs uppercase tracking-[0.2em]'>
                        {cmd.title}
                      </p>
                      <p className='mt-2 text-slate-600 text-sm'>
                        {cmd.description}
                      </p>
                      <div className='mt-3'>
                        <CopyCode code={cmd.code} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='space-y-4 border-slate-200 border-t pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6'>
                <h3 className='font-semibold text-2xl text-slate-900'>FAQ</h3>
                <div className='space-y-3 text-slate-700 text-sm'>
                  {t.faq.slice(0, 4).map((item) => (
                    <div
                      key={item.question}
                      className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm'
                    >
                      <p className='font-semibold text-slate-900'>
                        {item.question}
                      </p>
                      <p className='mt-1 text-slate-600'>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'standards' ? (
            <div className='mx-auto grid max-w-6xl gap-8 lg:grid-cols-2'>
              <div>
                <h3 className='font-semibold text-2xl text-slate-900'>
                  Blog Frontmatter
                </h3>
                <div className='mt-4 rounded-xl bg-slate-950 p-6 text-slate-100 text-sm shadow-lg ring-1 ring-slate-800'>
                  <pre className='whitespace-pre-wrap font-mono text-[13px] leading-relaxed'>
                    {frontmatterSnippet}
                  </pre>
                </div>
              </div>
              <div className='space-y-4'>
                <h3 className='font-semibold text-2xl text-slate-900'>
                  路径与检查
                </h3>
                <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
                  <ul className='space-y-2 font-mono text-slate-700 text-sm'>
                    <li>📂 content/blog/*.mdx</li>
                    <li>📂 content/docs/*.md / *.mdx</li>
                    <li>📂 public/images/</li>
                  </ul>
                </div>
                <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
                  <p className='font-semibold text-slate-900 text-sm'>
                    Blog vs. Docs 检查清单
                  </p>
                  <div className='mt-3 grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2 text-slate-600 text-xs'>
                      {t.blogChecklist.map((item) => (
                        <div key={item} className='flex items-start gap-2'>
                          <span className='mt-1 h-2 w-2 rounded-full bg-emerald-500' />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className='space-y-2 text-slate-600 text-xs'>
                      {t.docsChecklist.map((item) => (
                        <div key={item} className='flex items-start gap-2'>
                          <span className='mt-1 h-2 w-2 rounded-full bg-emerald-500' />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'manual' ? (
            <div className='mx-auto max-w-5xl space-y-4'>
              <h3 className='text-center font-semibold text-3xl text-slate-900'>
                完整操作手册
              </h3>
              <div className='grid gap-4 md:grid-cols-2'>
                {t.steps.map((s) => (
                  <div
                    key={s.number}
                    className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                  >
                    <div className='flex items-center gap-3 font-semibold text-slate-900 text-sm'>
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white'>
                        {s.number}
                      </span>
                      <span>{s.title}</span>
                    </div>
                    <p className='mt-2 text-slate-600 text-sm'>{s.summary}</p>
                    <ul className='mt-3 space-y-1 text-slate-500 text-xs'>
                      {s.bullets.map((b) => (
                        <li key={b} className='flex gap-2'>
                          <span className='mt-1 h-1.5 w-1.5 rounded-full bg-slate-400' />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {showFinale ? (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-slate-950/90 text-white'>
          <div className='text-center'>
            <p className='font-bold text-4xl tracking-tight'>全部步骤完成</p>
            <p className='mt-2 font-mono text-slate-400 text-sm tracking-[0.25em]'>
              感谢为 TEN Portal 贡献内容
            </p>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-slide {
          animation: slide 1.6s linear infinite;
        }
        @keyframes visual-in {
          0% {
            opacity: 0;
            transform: translateX(36px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-visual-in {
          animation: visual-in 320ms ease;
        }
      `}</style>
    </div>
  )
}
