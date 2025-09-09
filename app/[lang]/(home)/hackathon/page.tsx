'use client'

import { WelcomeHackers } from '@/components/ui/welcome-hackers'
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

export default function HackathonPage() {
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
			<WelcomeHackers />
		</div>
	)
}
