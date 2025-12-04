export type WorkshopStatus = 'upcoming' | 'completed'

export type WorkshopCategory =
  | 'voice-agents'
  | 'real-time-ai'
  | 'infrastructure'
  | 'ux'

export interface WorkshopSpeaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  avatar?: string
  pronouns?: string
  social?: {
    type: 'x' | 'linkedin' | 'github' | 'website'
    url: string
  }[]
}

export interface WorkshopResource {
  id: string
  label: string
  description: string
  url: string
  status: 'available' | 'locked'
  kind: 'prerequisite' | 'post'
}

export interface WorkshopSession {
  id: string
  start: string
  end: string
  title: string
  description: string
  type: 'welcome' | 'talk' | 'demo' | 'lab' | 'qa' | 'wrap'
  speakerIds: string[]
  tags?: string[]
}

export interface Workshop {
  slug: string
  title: string
  headline: string
  description: string
  start: string
  end: string
  timezone: string
  status: WorkshopStatus
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  format: 'Virtual live-coding' | 'In-person' | 'Hybrid'
  category: WorkshopCategory
  registrationUrl: string
  ctaLabel: string
  location: string
  seats?: string
  heroCallout?: string
  takeaways: string[]
  prerequisites: WorkshopResource[]
  resources: WorkshopResource[]
  sessions: WorkshopSession[]
  speakerIds: string[]
}

export const workshopSpeakers: Record<string, WorkshopSpeaker> = {
  elliotChen: {
    id: 'elliotChen',
    name: 'Elliot Chen',
    title: 'Developer Relations Lead',
    company: 'TEN Framework',
    bio: 'Leads the TEN Framework developer community and builds hands-on voice agent demos that ship to production.',
    avatar:
      'https://avatar.vercel.sh/elliot-chen?background=1e293b&color=38bdf8',
    pronouns: 'he/him',
    social: [
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/elliotc'
      },
      {
        type: 'github',
        url: 'https://github.com/elliotc'
      }
    ]
  },
  mayaRios: {
    id: 'mayaRios',
    name: 'Maya Rios',
    title: 'Solutions Engineer',
    company: 'Speechmatics',
    bio: 'Works with real-time speech teams to wire diarization, speaker ID, and transcription into production voice stacks.',
    avatar: 'https://avatar.vercel.sh/maya-rios?background=1e40af&color=facc15',
    pronouns: 'she/her',
    social: [
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/in/mayarios'
      }
    ]
  },
  devinPark: {
    id: 'devinPark',
    name: 'Devin Park',
    title: 'Senior Frontend Engineer',
    company: 'TEN Framework',
    bio: 'Designs the real-time UI surfaces powering TEN demo agents and mentors teams on live data-stream UX.',
    avatar:
      'https://avatar.vercel.sh/devin-park?background=0f172a&color=22d3ee',
    pronouns: 'they/them',
    social: [
      {
        type: 'github',
        url: 'https://github.com/devin-park'
      },
      {
        type: 'x',
        url: 'https://x.com/devin_codes'
      }
    ]
  }
}

export const workshops: Workshop[] = [
  {
    slug: 'speechmatics-speaker-id-agent',
    title: 'Speechmatics Speaker-ID Agent Lab',
    headline:
      'Wire Speechmatics diarization into TEN and ship a speaker-labelled voice agent in 90 minutes.',
    description:
      'A hands-on lab that pairs the TEN agent runtime, Speechmatics diarization, and a Next.js UI. We will stream real-time transcripts, attach speaker metadata, and polish the front-end experience together.',
    start: '2025-03-12T17:00:00.000Z',
    end: '2025-03-12T18:30:00.000Z',
    timezone: 'America/Los_Angeles',
    status: 'upcoming',
    level: 'Intermediate',
    format: 'Virtual live-coding',
    category: 'voice-agents',
    registrationUrl: 'https://lu.ma/ten-workshop-001',
    ctaLabel: 'Save your seat',
    location: 'Live on Zoom + TEN Discord',
    seats: 'Limited to 120 seats',
    heroCallout: 'Live coding + guided lab',
    takeaways: [
      'Deploy Speechmatics diarization inside a TEN agent graph.',
      'Stream chunked transcripts with speaker metadata to a Next.js client.',
      'Ship a polished UX with active-speaker states and replayable transcripts.'
    ],
    prerequisites: [
      {
        id: 'ten-cli',
        label: 'Install TEN CLI & runtime',
        description:
          'Follow the quickstart to set up the TEN Agent runtime locally.',
        url: 'https://theten.ai/docs/getting-started/install',
        status: 'available',
        kind: 'prerequisite'
      },
      {
        id: 'speechmatics-key',
        label: 'Speechmatics API key',
        description:
          'Create a Speechmatics account and generate a diarization-enabled key.',
        url: 'https://portal.speechmatics.com/manage',
        status: 'available',
        kind: 'prerequisite'
      },
      {
        id: 'agora-setup',
        label: 'Agora RTC dev app',
        description:
          'Provision an Agora project and grab the App ID for audio streaming.',
        url: 'https://console.agora.io/',
        status: 'available',
        kind: 'prerequisite'
      }
    ],
    resources: [
      {
        id: 'workshop-slides',
        label: 'Slides & diagrams',
        description:
          'PDF of the architecture deck used during the walkthrough.',
        url: '#',
        status: 'locked',
        kind: 'post'
      },
      {
        id: 'demo-repo',
        label: 'Sample agent repo',
        description: 'Full TEN agent + Next.js UI with diarization wiring.',
        url: 'https://github.com/TEN-framework/ten-speechmatics-agent',
        status: 'available',
        kind: 'post'
      },
      {
        id: 'recording',
        label: 'Workshop recording',
        description:
          'On-demand replay arrives 48 hours after the live session.',
        url: '#',
        status: 'locked',
        kind: 'post'
      }
    ],
    sessions: [
      {
        id: 'welcome',
        start: '2025-03-12T17:00:00.000Z',
        end: '2025-03-12T17:10:00.000Z',
        title: 'Kick-off & architecture overview',
        description:
          'Live walkthrough of how TEN, Speechmatics, and Agora connect, plus tooling checklist.',
        type: 'welcome',
        speakerIds: ['elliotChen'],
        tags: ['overview']
      },
      {
        id: 'graph-build',
        start: '2025-03-12T17:10:00.000Z',
        end: '2025-03-12T17:35:00.000Z',
        title: 'Building the TEN agent graph',
        description:
          'Configure the Speechmatics diarization node, wire metadata forwarding, and emit transcript events.',
        type: 'demo',
        speakerIds: ['elliotChen', 'mayaRios'],
        tags: ['agent-runtime', 'speechmatics']
      },
      {
        id: 'frontend-stream',
        start: '2025-03-12T17:35:00.000Z',
        end: '2025-03-12T18:00:00.000Z',
        title: 'Streaming speaker-labelled transcripts to React',
        description:
          'Implement chunk reconstruction, UTF-8 decoding, and active-speaker UI states in Next.js.',
        type: 'lab',
        speakerIds: ['devinPark'],
        tags: ['frontend', 'real-time']
      },
      {
        id: 'lab-breakout',
        start: '2025-03-12T18:00:00.000Z',
        end: '2025-03-12T18:20:00.000Z',
        title: 'Guided lab & Q&A',
        description:
          'Hands-on coding with mentors on standby inside breakout rooms and the TEN Discord channel.',
        type: 'qa',
        speakerIds: ['elliotChen', 'mayaRios', 'devinPark'],
        tags: ['hands-on']
      },
      {
        id: 'wrap',
        start: '2025-03-12T18:20:00.000Z',
        end: '2025-03-12T18:30:00.000Z',
        title: 'Wrap-up & next steps',
        description:
          'Recap integration patterns, share deployment tips, and highlight upcoming TEN community events.',
        type: 'wrap',
        speakerIds: ['elliotChen'],
        tags: ['next-steps']
      }
    ],
    speakerIds: ['elliotChen', 'mayaRios', 'devinPark']
  }
]

export const workshopCategories: { id: WorkshopCategory; label: string }[] = [
  { id: 'voice-agents', label: 'Voice Agents' },
  { id: 'real-time-ai', label: 'Real-time AI' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'ux', label: 'Experience Design' }
]
