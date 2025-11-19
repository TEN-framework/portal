'use client'

import { useEffect, useMemo, useState } from 'react'
import { InlineCodeText } from '@/components/guide/InlineCode'

type Step = {
  number: string
  title: string
  summary: string
  bullets: string[]
}

export function GuideSteps({
  steps,
  locale
}: {
  steps: Step[]
  locale: 'en' | 'cn'
}) {
  const storageKey = useMemo(() => `guide:steps:${locale}`, [locale])
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setCompleted(JSON.parse(raw))
    } catch {}
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed))
    } catch {}
  }, [completed, storageKey])

  const total = steps.length
  const doneCount = Object.values(completed).filter(Boolean).length
  const percent = Math.round((doneCount / Math.max(1, total)) * 100)

  return (
    <div className='flex flex-col gap-6'>
      <div className='rounded-3xl border p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='guide-step-badge inline-flex size-10 items-center justify-center rounded-full'>
              {doneCount}
            </span>
            <div>
              <p className='font-semibold text-sm'>
                {locale === 'cn' ? '已完成步骤' : 'Steps completed'}
              </p>
              <p className='guide-text-muted text-xs'>{percent}%</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              className='guide-cta-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs'
              onClick={() => setCompleted({})}
              type='button'
            >
              {locale === 'cn' ? '重置' : 'Reset'}
            </button>
            <button
              className='guide-cta-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs'
              onClick={() =>
                setCompleted(
                  Object.fromEntries(steps.map((s) => [s.number, true]))
                )
              }
              type='button'
            >
              {locale === 'cn' ? '全部完成' : 'Mark all'}
            </button>
          </div>
        </div>
        <div className='mt-3 h-2 w-full overflow-hidden rounded-full border'>
          <div
            className='h-full bg-[--primary]'
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {steps.map((step) => {
          const isDone = Boolean(completed[step.number])
          return (
            <div
              key={step.number}
              className='guide-panel hover:-translate-y-0.5 rounded-3xl p-6 transition-transform'
            >
              <div className='guide-text-muted flex items-center gap-3 font-semibold text-sm'>
                <button
                  aria-pressed={isDone}
                  onClick={() =>
                    setCompleted((prev) => ({
                      ...prev,
                      [step.number]: !isDone
                    }))
                  }
                  className={`inline-flex size-10 items-center justify-center rounded-full ${isDone ? 'guide-step-badge--done' : 'guide-step-badge'}`}
                  type='button'
                >
                  {step.number}
                </button>
                {step.title}
              </div>
              <p className='guide-text-muted mt-4 text-base'>{step.summary}</p>
              <ul className='mt-4 space-y-2 text-sm'>
                {step.bullets.map((entry) => (
                  <li
                    key={`${step.number}-${entry}`}
                    className='guide-text-muted flex gap-2'
                  >
                    <span className='guide-dot mt-0.5 size-2 rounded-full' />
                    <InlineCodeText text={entry} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
