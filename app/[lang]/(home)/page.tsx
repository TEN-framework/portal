import { AuroraBackground, Hero } from '@/app/[lang]/(home)/_components'

export default function HomePage() {
  return (
    <>
      <AuroraBackground className="flex h-[calc(100dvh-56px)] flex-1 flex-col justify-center text-center">
        <Hero className="z-1" />
      </AuroraBackground>
    </>
  )
}
