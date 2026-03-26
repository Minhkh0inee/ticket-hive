import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import type { Event } from '@/types/event.types'

interface EventGridCardProps {
  event: Event
}

export const EventGridCard = memo(function EventGridCard({ event }: EventGridCardProps) {
  const isPast = useMemo(() => new Date(event.eventDate) < new Date(), [event.eventDate])

  const formattedDate = useMemo(
    () =>
      new Date(event.eventDate).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [event.eventDate]
  )

  const formattedPrice = useMemo(() => {
    const price = parseInt(event.basePrice, 10)
    return price === 0
      ? 'Miễn phí'
      : `Từ ${price.toLocaleString('vi-VN')}đ`
  }, [event.basePrice])

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.2_250)] rounded-xl"
      aria-label={`${event.title} - ${formattedDate}`}
    >
      <article className="rounded-xl overflow-hidden bg-[oklch(0.19_0_0)] border border-[oklch(0.25_0_0)] transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 hover:border-[oklch(0.35_0_0)]">
        {/* Image */}
        <div className="relative overflow-hidden bg-[oklch(0.16_0_0)]" style={{ aspectRatio: '3/2' }}>
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
              loading="lazy"
              width={400}
              height={267}
            />
          ) : (
            <div className="w-full h-full bg-[oklch(0.22_0_0)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {isPast && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide shadow-md">
              Đã diễn ra
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {event.title}
          </h3>
          <p
            className={`text-sm font-medium ${parseInt(event.basePrice) === 0 ? 'text-[oklch(0.65_0.15_145)]' : 'text-[oklch(0.7_0.17_145)]'}`}
          >
            {formattedPrice}
          </p>
          <div className="flex items-center gap-1.5 text-[oklch(0.55_0_0)] text-xs">
            <Calendar size={11} aria-hidden="true" />
            <time dateTime={event.eventDate}>{formattedDate}</time>
          </div>
        </div>
      </article>
    </Link>
  )
})
