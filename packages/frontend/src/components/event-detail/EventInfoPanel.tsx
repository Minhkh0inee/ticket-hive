import { memo, useMemo } from 'react'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { fmtDateRange, fmtPrice } from '@/lib/format'
import { EventStatus } from '@/types/event.types'

interface EventInfoPanelProps {
  title: string
  eventDate: string
  endDate?: string
  venue: string
  venueAddress?: string
  basePrice: string
  eventStatus?: EventStatus
  onBuyClick?: () => void
}

function getCtaConfig(eventStatus?: EventStatus): { label: string; disabled: boolean } {
  switch (eventStatus) {
    case EventStatus.CANCELLED: return { label: 'Sự kiện đã hủy', disabled: true }
    case EventStatus.ENDED:     return { label: 'Sự kiện đã kết thúc', disabled: true }
    case EventStatus.ONGOING:   return { label: 'Đang diễn ra', disabled: true }
    case EventStatus.SOLD_OUT:  return { label: 'Vé ngừng bán online', disabled: true }
    default:                    return { label: 'Mua vé ngay', disabled: false }
  }
}

export const EventInfoPanel = memo(function EventInfoPanel({
  title,
  eventDate,
  endDate,
  venue,
  venueAddress,
  basePrice,
  eventStatus,
  onBuyClick,
}: EventInfoPanelProps) {
  const dateText = useMemo(() => fmtDateRange(eventDate, endDate), [eventDate, endDate])
  const priceNum = useMemo(() => parseInt(basePrice, 10), [basePrice])
  const { label: ctaLabel, disabled: ctaDisabled } = getCtaConfig(eventStatus)

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
        disabled={ctaDisabled}
        onClick={!ctaDisabled ? onBuyClick : undefined}
        className={`w-full h-11 rounded-xl text-sm font-semibold ${
          ctaDisabled
            ? 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed hover:bg-[oklch(0.28_0_0)]'
            : 'bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] active:bg-[oklch(0.5_0.2_250)] text-white'
        }`}
        aria-disabled={ctaDisabled}
      >
        {ctaLabel}
      </Button>
    </div>
  )
})
