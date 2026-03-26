import { memo, useMemo } from 'react'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { fmtDateRange, fmtPrice } from '@/lib/format'

interface EventInfoPanelProps {
  title: string
  eventDate: string
  endDate?: string
  venue: string
  venueAddress?: string
  basePrice: string
  isSoldOut?: boolean
}

export const EventInfoPanel = memo(function EventInfoPanel({
  title,
  eventDate,
  endDate,
  venue,
  venueAddress,
  basePrice,
  isSoldOut,
}: EventInfoPanelProps) {
  const dateText = useMemo(() => fmtDateRange(eventDate, endDate), [eventDate, endDate])
  const priceNum = useMemo(() => parseInt(basePrice, 10), [basePrice])

  return (
    <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6 flex flex-col h-full">
      {/* Title */}
      <h1 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-5">
        {title}
      </h1>

      {/* Date */}
      <div className="flex items-start gap-3 mb-4">
        <Calendar size={18} className="text-[oklch(0.6_0.2_250)] mt-0.5 shrink-0" aria-hidden="true" />
        <time dateTime={eventDate} className="text-[oklch(0.6_0.2_250)] text-sm font-medium leading-relaxed">
          {dateText}
        </time>
      </div>

      {/* Venue */}
      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-[oklch(0.6_0.2_250)] mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-[oklch(0.6_0.2_250)] text-sm font-semibold hover:underline cursor-pointer">
            {venue}
          </p>
          {venueAddress && (
            <p className="text-[oklch(0.6_0_0)] text-xs mt-0.5 leading-relaxed">
              {venueAddress}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1" />

      <Separator className="my-5 bg-[oklch(0.28_0_0)]" />

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[oklch(0.75_0_0)] text-sm font-medium">Giá từ</span>
        <span className="text-[oklch(0.6_0.2_250)] text-xl font-bold">
          {fmtPrice(basePrice)}
        </span>
        {priceNum > 0 && (
          <ChevronRight size={18} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
        )}
      </div>

      {/* CTA */}
      <Button
        disabled={isSoldOut}
        className={`w-full h-11 rounded-xl text-sm font-semibold ${
          isSoldOut
            ? 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed hover:bg-[oklch(0.28_0_0)]'
            : 'bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] active:bg-[oklch(0.5_0.2_250)] text-white'
        }`}
        aria-disabled={isSoldOut}
      >
        {isSoldOut ? 'Vé ngừng bán online' : 'Mua vé ngay'}
      </Button>
    </div>
  )
})
