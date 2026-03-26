import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/types/event.types'

interface EventCardProps {
  event: Event
  className?: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(price: number | string) {
  const num = typeof price === 'number' ? price : parseInt(price, 10)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
}

export function EventCard({ event, className = '' }: EventCardProps) {
  return (
    <Link
      to={`/events/${event.id}`}
      className={`group flex flex-col w-[180px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer ${className}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
        {event.bannerUrl ? (
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-150 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      </div>
      <div className="pt-2 pb-1 flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-[oklch(0.6_0.2_250)] transition-colors">
          {event.title}
        </p>
        <p className="text-xs text-gray-500">{formatDate(event.eventDate)}</p>
        <p className="text-xs text-gray-500 truncate">{event.venue}, {event.city}</p>
        <Badge
          variant="secondary"
          className="self-start mt-1 text-[10px] px-1.5 py-0 bg-blue-50 text-[oklch(0.6_0.2_250)] border-0"
        >
          From {formatPrice(event.basePrice)}
        </Badge>
      </div>
    </Link>
  )
}
