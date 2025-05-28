import { Hero } from '@/app/[lang]/(home)/_components'

export default function HomePage() {
  return (
    <div className="relative flex h-[calc(100dvh-56px)] flex-1 flex-col justify-center text-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-37"
      >
        <source src="https://ten-framework-assets.s3.us-east-1.amazonaws.com/bg2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Hero className="relative z-10" />
    </div>
  )
}
