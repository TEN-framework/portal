import type * as React from 'react'
import { Github, Globe, Linkedin, MessageCircle } from 'lucide-react'

import type { WorkshopSpeaker } from '@/constants'

const socialIcons: Record<
  NonNullable<WorkshopSpeaker['social']>[number]['type'],
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  github: Github,
  linkedin: Linkedin,
  x: MessageCircle,
  website: Globe,
}

export function WorkshopSpeakers({
  speakers,
}: {
  speakers: WorkshopSpeaker[]
}) {
  if (!speakers.length) return null

  return (
    <section className="bg-slate-900 py-16 text-white dark:bg-[#050510]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Meet your guides
          </h2>
          <p className="mt-3 text-white/70">
            Live mentors from TEN and Speechmatics will be on call to unblock
            you during the lab.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {speakers.map((speaker) => (
            <article
              key={speaker.id}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition hover:border-emerald-400/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-purple-500/20">
                  {speaker.avatar ? (
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="size-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-white/90">
                      {speaker.name
                        .split(' ')
                        .map((part) => part[0]?.toUpperCase())
                        .join('')
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">{speaker.name}</p>
                  <p className="text-sm text-white/70">
                    {speaker.title}, {speaker.company}
                  </p>
                  {speaker.pronouns ? (
                    <p className="text-xs text-white/60">{speaker.pronouns}</p>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm text-white/80">
                {speaker.bio}
              </p>

              {speaker.social?.length ? (
                <div className="mt-4 flex gap-3">
                  {speaker.social.map((link) => {
                    const Icon = socialIcons[link.type]
                    if (!Icon) return null
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:border-emerald-400/60 hover:text-emerald-200"
                      >
                        <Icon className="size-5" />
                      </a>
                    )
                  })}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
