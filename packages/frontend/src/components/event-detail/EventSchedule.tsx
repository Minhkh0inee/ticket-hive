import { memo, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { fmtDateRange, fmtPrice } from '@/lib/format'
import type { TicketType } from '@/types/event.types'

interface EventScheduleProps {
  eventDate: string
  endDate?: string
  ticketTypes: TicketType[]
}

export const EventSchedule = memo(function EventSchedule({ eventDate, endDate, ticketTypes }: EventScheduleProps) {
  const dateText = useMemo(() => fmtDateRange(eventDate, endDate), [eventDate, endDate])
  const hasAvailable = useMemo(() => ticketTypes.some(t => t.available), [ticketTypes])

  return (
    <section
      aria-labelledby="schedule-heading"
      className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6"
    >
      <h2
        id="schedule-heading"
        className="text-white font-bold text-base mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
        Lịch diễn
      </h2>

      {/* Date row */}
      <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-b border-[oklch(0.26_0_0)]">
        <div className="flex items-center gap-2 text-[oklch(0.65_0_0)] text-sm">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={eventDate}>{dateText}</time>
        </div>
        <Button
          size="sm"
          disabled={!hasAvailable}
          className={`rounded-lg text-xs font-semibold ${
            hasAvailable
              ? 'bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white'
              : 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed hover:bg-[oklch(0.28_0_0)]'
          }`}
          aria-disabled={!hasAvailable}
        >
          {hasAvailable ? 'Mua vé' : 'Vé ngừng bán online'}
        </Button>
      </div>

      {/* Ticket types */}
      <div className="mt-4">
        <p className="text-[oklch(0.55_0_0)] text-xs font-semibold uppercase tracking-wider mb-3">
          Thông tin vé
        </p>
        <ul className="space-y-0" role="list">
          {ticketTypes.map(ticket => (
            <li
              key={ticket.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-[oklch(0.23_0_0)] last:border-0"
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{ticket.name}</p>
                {ticket.description && (
                  <p className="text-[oklch(0.5_0_0)] text-xs mt-0.5">{ticket.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[oklch(0.6_0.2_250)] text-sm font-semibold whitespace-nowrap">
                  {fmtPrice(ticket.price)}
                </span>
                {ticket.available ? (
                  <Button
                    size="sm"
                    className="rounded-lg text-xs h-7 bg-[oklch(0.75_0.18_350)] hover:bg-[oklch(0.7_0.18_350)] text-white whitespace-nowrap"
                  >
                    Đặt vé
                  </Button>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] border-0 text-xs"
                  >
                    Hết vé
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
})
