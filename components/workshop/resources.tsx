import { ArrowUpRight, CheckCircle2, Lock } from 'lucide-react'

import type { WorkshopResource } from '@/constants'
import { cn } from '@/lib/utils'

const ResourceCard = ({
  resource,
}: {
  resource: WorkshopResource
}) => {
  const isLocked = resource.status === 'locked'

  return (
    <li
      className={cn(
        'group relative rounded-2xl border p-5 transition',
        isLocked
          ? 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400'
          : 'border-slate-200 bg-white shadow-sm hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-400/40'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {resource.label}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {resource.description}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            isLocked
              ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
          )}
        >
          {isLocked ? (
            <>
              <Lock className="size-3.5" />
              Soon
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5" />
              Ready
            </>
          )}
        </span>
      </div>

      <a
        href={resource.url === '#' ? undefined : resource.url}
        aria-disabled={resource.url === '#'}
        className={cn(
          'mt-4 inline-flex items-center gap-2 text-sm font-medium',
          isLocked
            ? 'text-slate-400'
            : 'text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200'
        )}
      >
        {isLocked ? 'Available after the live session' : 'Open resource'}
        {!isLocked ? <ArrowUpRight className="size-4" /> : null}
      </a>
    </li>
  )
}

export function WorkshopResources({
  prerequisites,
  resources,
}: {
  prerequisites: WorkshopResource[]
  resources: WorkshopResource[]
}) {
  return (
    <section className="py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-12 px-6 lg:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Build with confidence
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Come prepared with the essentials and leave with production-ready
            assets. Everything you need—before, during, and after the workshop.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <p className="mb-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Before the session
            </p>
            <ul className="space-y-4">
              {prerequisites.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              After we go live
            </p>
            <ul className="space-y-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
