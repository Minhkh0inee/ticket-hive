import { memo } from 'react'

interface HeroGalleryProps {
  images: string[]
  title: string
}

export const HeroGallery = memo(function HeroGallery({ images, title }: HeroGalleryProps) {
  const [img0, img1, img2] = images

  return (
    <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px]">
      <div className="grid h-full" style={{ gridTemplateColumns: '2fr 1.4fr 2fr' }}>
        {/* Image 1 */}
        <div className="relative overflow-hidden">
          <img
            src={img0}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Image 2 — middle */}
        <div className="relative overflow-hidden border-x border-[oklch(0.12_0_0)]">
          <img
            src={img1 ?? img0}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Image 3 — title overlay */}
        <div className="relative overflow-hidden">
          <img
            src={img2 ?? img0}
            alt=""
            aria-hidden="true"
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
      </div>
    </div>
  )
})
