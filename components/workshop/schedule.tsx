import { Layers, PencilRuler, Sparkles, UsersRound } from 'lucide-react'
import type * as React from 'react'
import type { WorkshopSpeaker } from '@/constants'
import type { WorkshopSession } from '@/constants/workshops'
import { formatSessionTimeRange, getTimeZoneAbbreviation } from '@/lib/date'

const typeMeta: Record<
  WorkshopSession['type'],
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  welcome: { label: 'Welcome', icon: Sparkles },
  talk: { label: 'Talk', icon: Layers },
  demo: { label: 'Live Demo', icon: Layers },
  lab: { label: 'Hands-on Lab', icon: PencilRuler },
  qa: { label: 'Q&A', icon: UsersRound },
  wrap: { label: 'Wrap-up', icon: Sparkles }
}

interface WorkshopScheduleProps {
  sessions: WorkshopSession[]
  timezone: string
  speakers: Record<string, WorkshopSpeaker>
  title?: string
  description?: string
}

export function WorkshopSchedule({
  sessions,
  timezone,
  speakers,
  title = 'Live agenda',
  description = 'Every block is designed so you can follow along and ship the full workflow by the end of the session.'
}: WorkshopScheduleProps) {
  if (!sessions.length) return null

  const timezoneLabel = getTimeZoneAbbreviation(
    new Date(sessions[0].start),
    timezone
  )

  return (
    <section className='border-slate-200 border-t bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950'>
      <div className='mx-auto max-w-5xl px-6'>
        <div className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='font-semibold text-3xl text-slate-900 tracking-tight dark:text-white'>
              {title}
            </h2>
            <p className='mt-2 max-w-2xl text-slate-600 dark:text-slate-300'>
              {description}
            </p>
          </div>
          <div className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'>
            <span className='size-2 rounded-full bg-emerald-400' />
            Times shown in {timezoneLabel}
          </div>
        </div>

        <ol className='relative space-y-6 border-slate-200 border-l pl-6 dark:border-slate-800'>
          {sessions.map((session, index) => {
            const MetaIcon = typeMeta[session.type]?.icon ?? Layers
            const typeLabel = typeMeta[session.type]?.label ?? 'Session'
            const timeLabel = formatSessionTimeRange(
              session.start,
              session.end,
              timezone
            )
            const speakerNames = session.speakerIds
              .map((id) => speakers[id]?.name)
              .filter(Boolean)
              .join(', ')

            return (
              <li key={session.id} className='relative ml-4'>
                <span className='-left-8 absolute top-2 flex size-4 items-center justify-center rounded-full border border-emerald-400 bg-white dark:border-emerald-500 dark:bg-slate-950' />
                <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50'>
                  <div className='mb-4 flex flex-wrap items-center gap-3 text-slate-500 text-sm dark:text-slate-300'>
                    <span className='rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200'>
                      {timeLabel}
                    </span>
                    <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 text-xs uppercase tracking-wide dark:bg-slate-800 dark:text-slate-200'>
                      <MetaIcon className='size-3.5' />
                      {typeLabel}
                    </span>
                    {session.tags?.map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 text-xs uppercase tracking-wide dark:bg-slate-800 dark:text-slate-200'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className='font-semibold text-slate-900 text-xl dark:text-white'>
                    {index + 1}. {session.title}
                  </h3>
                  <p className='mt-2 text-slate-600 text-sm dark:text-slate-300'>
                    {session.description}
                  </p>
                  {speakerNames ? (
                    <p className='mt-4 font-medium text-slate-700 text-sm dark:text-slate-200'>
                      Led by {speakerNames}
                    </p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
