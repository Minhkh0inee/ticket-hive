import { memo } from 'react'

interface HeroGalleryProps {
  images: string | string[]
  title: string
}

export const HeroGallery = memo(function HeroGallery({ images, title }: HeroGalleryProps) {
  const img = Array.isArray(images) ? images[0] : images
  console.log(img)
  return (
    <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px]">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white font-black text-2xl sm:text-3xl leading-tight uppercase tracking-wide drop-shadow-2xl line-clamp-3">
          {title}
        </p>
      </div>
    </div>
  )
})