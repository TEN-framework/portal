'use client'

import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Workshop, WorkshopCategory } from '@/constants'
import { formatWorkshopDateRange } from '@/lib/date'
import { cn } from '@/lib/utils'

interface WorkshopArchiveProps {
  workshops: Workshop[]
  categories: { id: WorkshopCategory; label: string }[]
}

export function WorkshopArchive({
  workshops,
  categories
}: WorkshopArchiveProps) {
  const [activeCategory, setActiveCategory] = useState<
    WorkshopCategory | 'all'
  >('all')

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return workshops
    return workshops.filter((workshop) => workshop.category === activeCategory)
  }, [activeCategory, workshops])

  return (
    <section className='border-slate-200 border-t bg-white py-16 dark:border-slate-800 dark:bg-slate-950'>
      <div className='mx-auto max-w-5xl px-6'>
        <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='font-semibold text-3xl text-slate-900 tracking-tight dark:text-white'>
              Past workshops
            </h2>
            <p className='mt-2 text-slate-600 dark:text-slate-300'>
              Catch up on previous labs and deep dives. Replays unlock 48 hours
              after we wrap.
            </p>
          </div>

          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setActiveCategory('all')}
              className={cn(
                'rounded-full border px-4 py-2 font-medium text-sm transition',
                activeCategory === 'all'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-400/80 dark:bg-emerald-500/10 dark:text-emerald-200'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200'
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type='button'
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'rounded-full border px-4 py-2 font-medium text-sm transition',
                  activeCategory === category.id
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-400/80 dark:bg-emerald-500/10 dark:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length ? (
          <div className='grid gap-6 md:grid-cols-2'>
            {filtered.map((workshop) => {
              const { dateLabel, timeLabel } = formatWorkshopDateRange(
                workshop.start,
                workshop.end,
                workshop.timezone
              )

              return (
                <article
                  key={workshop.slug}
                  className='flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-400/40'
                >
                  <span className='inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600 text-xs uppercase tracking-wide dark:bg-slate-800 dark:text-slate-300'>
                    {workshop.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                  <h3 className='mt-4 font-semibold text-slate-900 text-xl dark:text-white'>
                    {workshop.title}
                  </h3>
                  <p className='mt-2 text-slate-600 text-sm dark:text-slate-300'>
                    {workshop.description}
                  </p>
                  <div className='mt-4 text-slate-500 text-sm dark:text-slate-400'>
                    <p>{dateLabel}</p>
                    <p>{timeLabel}</p>
                  </div>
                  <div className='mt-auto pt-5'>
                    <a
                      href={workshop.registrationUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='inline-flex items-center gap-2 font-semibold text-emerald-600 text-sm transition hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'
                    >
                      View details
                      <ArrowUpRight className='size-4' />
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className='rounded-3xl border border-slate-300 border-dashed bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/40'>
            <p className='font-medium text-lg text-slate-700 dark:text-slate-200'>
              No archived workshops yet
            </p>
            <p className='mt-2 text-slate-500 text-sm dark:text-slate-400'>
              This is our inaugural session—check back soon for replays and new
              categories.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
