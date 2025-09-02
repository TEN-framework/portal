'use client'

import { HackathonHero } from './components/HackathonHero'
import { AboutSection } from './components/AboutSection'
import { FrameworkSection } from './components/FrameworkSection'
import { ChallengeSection } from './components/ChallengeSection'
import { PrizesSection } from './components/PrizesSection'
import { TimelineSection } from './components/TimelineSection'
import { ParticipateSection } from './components/ParticipateSection'
import { EligibilitySection } from './components/EligibilitySection'
import { DiscordSection } from './components/DiscordSection'
import { CTASection } from './components/CTASection'
import { FooterSection } from './components/FooterSection'
import { WelcomeHackers } from '@/components/ui/welcome-hackers'

export default function HackathonPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HackathonHero />
      <div className="pb-0">
        <AboutSection />
        <FrameworkSection />
        <ChallengeSection />
        <PrizesSection />
        <TimelineSection />
        <ParticipateSection />
        <EligibilitySection />
        <DiscordSection />
        <CTASection />
        <FooterSection />
      </div>
      <WelcomeHackers />
    </div>
  )
}
