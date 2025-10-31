import { CalendarRange, Clock, MapPin, Ticket } from 'lucide-react'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import type { Workshop, WorkshopCategory } from '@/constants'
import { workshopCategories } from '@/constants'
import { formatWorkshopDateRange, getTimeZoneAbbreviation } from '@/lib/date'
import { cn } from '@/lib/utils'

import { LocalTimeNotice } from './local-time'

const getCategoryLabel = (category: WorkshopCategory) =>
  workshopCategories.find((item) => item.id === category)?.label ?? category

const StatItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
}) => (
  <div className='flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur dark:border-white/10'>
    <div className='flex size-10 items-center justify-center rounded-full bg-white/10 text-white'>
      <Icon className='size-5' />
    </div>
    <div>
      <p className='text-white/70 text-xs uppercase tracking-wide'>{label}</p>
      <p className='font-semibold text-white'>{value}</p>
    </div>
  </div>
)

export function WorkshopHero({ workshop }: { workshop: Workshop }) {
  const { dateLabel, timeLabel } = formatWorkshopDateRange(
    workshop.start,
    workshop.end,
    workshop.timezone
  )
  const durationMinutes =
    (new Date(workshop.end).getTime() - new Date(workshop.start).getTime()) /
    60000
  const durationHours = Math.floor(durationMinutes / 60)
  const durationRem = Math.round(durationMinutes % 60)
  const durationParts = []
  if (durationHours) durationParts.push(`${durationHours}h`)
  if (durationRem) durationParts.push(`${durationRem}m`)
  const durationLabel =
    durationParts.length > 0
      ? durationParts.join(' ')
      : `${Math.round(durationMinutes)} minutes`
  const timezoneLabel = getTimeZoneAbbreviation(
    new Date(workshop.start),
    workshop.timezone
  )

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'>
      <div className='-top-24 -left-24 absolute size-[420px] rounded-full bg-sky-500/10 blur-3xl' />
      <div className='-bottom-32 -right-6 absolute size-[520px] rounded-full bg-emerald-400/10 blur-3xl' />

      <div className='relative mx-auto flex w-full max-w-[1100px] flex-col gap-12 px-6 py-20 lg:flex-row lg:py-24'>
        <div className='flex-1 space-y-6'>
          <span className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 font-medium text-sm text-white/80 backdrop-blur'>
            <span className='size-2 rounded-full bg-emerald-400' />
            Upcoming workshop · {getCategoryLabel(workshop.category)}
          </span>

          <h1 className='font-semibold text-4xl leading-tight sm:text-5xl lg:text-6xl'>
            {workshop.title}
          </h1>

          <p className='max-w-2xl text-lg text-white/80'>{workshop.headline}</p>

          <div className='flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur md:flex-row md:items-start md:justify-between'>
            <div>
              <p className='text-sm text-white/60 uppercase tracking-wide'>
                When
              </p>
              <p className='font-semibold text-white'>{dateLabel}</p>
              <p className='text-sm text-white/70'>{timeLabel}</p>
              <LocalTimeNotice
                start={workshop.start}
                end={workshop.end}
                className='mt-2'
              />
            </div>
            <div>
              <p className='text-sm text-white/60 uppercase tracking-wide'>
                Format
              </p>
              <p className='font-semibold text-white'>{workshop.format}</p>
              <p className='text-sm text-white/70'>{workshop.location}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <Button
              variant='default'
              size='lg'
              className='bg-white text-black hover:bg-white/90'
              asChild
            >
              <a
                href={workshop.registrationUrl}
                target='_blank'
                rel='noreferrer'
              >
                {workshop.ctaLabel}
              </a>
            </Button>
            {workshop.heroCallout ? (
              <p className='text-sm text-white/70'>{workshop.heroCallout}</p>
            ) : null}
          </div>
        </div>

        <div className='flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur'>
          <div>
            <p className='text-white/70 text-xs uppercase tracking-wide'>
              What you&apos;ll ship
            </p>
            <ul className='mt-3 space-y-2 text-sm text-white/80'>
              {workshop.takeaways.map((item) => (
                <li key={item} className='flex items-start gap-2'>
                  <span className='mt-1 size-1.5 rounded-full bg-emerald-400' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <StatItem icon={CalendarRange} label='Date' value={dateLabel} />
            <StatItem icon={Clock} label='Duration' value={durationLabel} />
            <StatItem icon={MapPin} label='Timezone' value={timezoneLabel} />
            <StatItem
              icon={Ticket}
              label='Seats'
              value={workshop.seats ?? 'Open enrollment'}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
