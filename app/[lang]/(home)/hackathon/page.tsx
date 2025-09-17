'use client'

import { useEffect } from 'react'
import { AboutSection } from './components/AboutSection'
import { CTASection } from './components/CTASection'
import { ChallengeSection } from './components/ChallengeSection'
import { DiscordSection } from './components/DiscordSection'
import { EligibilitySection } from './components/EligibilitySection'
import { FooterSection } from './components/FooterSection'
import { FrameworkSection } from './components/FrameworkSection'
import { HackathonHero } from './components/HackathonHero'
import { JudgesSection } from './components/JudgesSection'
import { ParticipateSection } from './components/ParticipateSection'
import { PrizesSection } from './components/PrizesSection'
import { TimelineSection } from './components/TimelineSection'
import { WorkshopSection } from './components/WorkshopSection'

const ASCII_EASTER_EGG = [
  ' __    __     _                            _                        ',
  '/ / /\\ \\ \\___| | ___ ___  _ __ ___   ___  | |_ ___                  ',
  "\\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | __/ _ \\                 ",
  ' \\  /\\  /  __/ | (_| (_) | | | | | |  __/ | || (_) |                ',
  '  \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  \\__\\___/                 ',
  '                                                                    ',
  ' _____  __    __                    _         _   _                 ',
  '/__   \\/__\\/\\ \\ \\   /\\  /\\__ _  ___| | ____ _| |_| |__   ___  _ __  ',
  "  / /\\/_\\ /  \\/ /  / /_/ / _` |/ __| |/ / _` | __| '_ \\ / _ \\| '_ \\ ",
  ' / / //__/ /\\  /  / __  / (_| | (__|   < (_| | |_| | | | (_) | | | |',
  ' \\/  \\__/\\_\\ \\/   \\/ /_/ \\__,_|\\___|_|\\_\\\\__,_|\\__|_| |_|\\___/|_| |_|',
].join('\n')

export default function HackathonPage() {
  useEffect(() => {
    console.log(`\n${ASCII_EASTER_EGG}`)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HackathonHero />
      <div className="pb-0">
        <AboutSection />
        <FrameworkSection />
        <ChallengeSection />
        <PrizesSection />
        <JudgesSection />
        <TimelineSection />
        <WorkshopSection />
        <ParticipateSection />
        <EligibilitySection />
        <DiscordSection />
        <CTASection />
        <FooterSection />
      </div>
    </div>
  )
}
