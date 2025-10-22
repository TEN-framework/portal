import type { Metadata } from 'next'

import {
  workshopCategories,
  workshopSpeakers,
  workshops,
  type Workshop,
} from '@/constants'
import { WorkshopHero } from '@/components/workshop/hero'
import { WorkshopSchedule } from '@/components/workshop/schedule'
import { WorkshopResources } from '@/components/workshop/resources'
import { WorkshopSpeakers } from '@/components/workshop/speakers'
import { WorkshopArchive } from '@/components/workshop/archive'

const sortByStart = (items: Workshop[]) =>
  [...items].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  )

const UPCOMING_STATUSES: Workshop['status'][] = ['upcoming']

const featuredWorkshop = (() => {
  const upcoming = sortByStart(
    workshops.filter((workshop) => UPCOMING_STATUSES.includes(workshop.status))
  )
  if (upcoming.length) return upcoming[0]
  return sortByStart(workshops)[0]
})()

export const metadata: Metadata = {
  title: 'TEN Workshops',
  description:
    'Hands-on TEN Framework workshops. Ship real-time voice and multimodal agents with live mentors and production case studies.',
}

export default function WorkshopPage() {
  const primary = featuredWorkshop
  const speakerRecords = primary.speakerIds
    .map((id) => workshopSpeakers[id])
    .filter(Boolean)

  const prerequisites = primary.prerequisites
  const postResources = primary.resources

  const pastWorkshops = workshops.filter(
    (workshop) =>
      workshop.status === 'completed' && workshop.slug !== primary.slug
  )

  return (
    <div className="flex flex-col">
      <WorkshopHero workshop={primary} />
      <WorkshopSchedule
        sessions={primary.sessions}
        timezone={primary.timezone}
        speakers={workshopSpeakers}
      />
      <WorkshopResources
        prerequisites={prerequisites}
        resources={postResources}
      />
      <WorkshopSpeakers speakers={speakerRecords} />
      <WorkshopArchive
        workshops={pastWorkshops}
        categories={workshopCategories}
      />
    </div>
  )
}
