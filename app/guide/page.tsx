import type { Metadata } from 'next'
import { GuideClient } from './GuideClient'

export const metadata: Metadata = {
  title: 'Contribution Guide | TEN Framework',
  description: 'Immersive contribution journey for TEN Portal contributors.'
}

export default function GuidePage() {
  return <GuideClient />
}
