import Image from 'next/image'

import { cn } from '@/lib/utils'

type CaptionedImageProps = {
  src: string
  alt: string
  caption: string
  className?: string
  priority?: boolean
}

export function CaptionedImage({
  src,
  alt,
  caption,
  className,
  priority
}: CaptionedImageProps) {
  return (
    <figure
      className={cn(
        'my-10 flex flex-col items-center gap-3 text-center',
        className
      )}
    >
      <div className='relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg'>
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={720}
          className='h-auto w-full object-cover'
          priority={priority}
        />
      </div>
      <figcaption className='text-muted-foreground text-sm'>
        {caption}
      </figcaption>
    </figure>
  )
}
