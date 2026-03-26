import { memo } from 'react'
import { Calendar } from 'lucide-react'
import { useMemo } from 'react'
import { fmtDateRange } from '@/lib/format'
import { SeatMapDialog } from './SeatMapDialog'
import { useSeatMap } from './useSeatMap'
import { SectionList } from './SectionList'

interface EventScheduleProps {
  eventDate: string
  endDate?: string
  eventId: string
  basePrice: number
}

export const EventSchedule = memo(function EventSchedule({
  eventDate, endDate, eventId, basePrice
}: EventScheduleProps) {
  const dateText = useMemo(() => fmtDateRange(eventDate, endDate), [eventDate, endDate])
  const {
    seats, selectedSeats, isLoading,
    selectedSection, sectionSummaries, allRowsGrouped,
    totalPrice, openSeatMap, closeSeatMap, handleSeatClick,
  } = useSeatMap(eventId, basePrice)

  const modifier = sectionSummaries.find(s => s.section === selectedSection)?.priceModifier ?? 1
  const price = basePrice * modifier

  return (
    <>
      <section
        aria-labelledby="schedule-heading"
        className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6"
      >
        <h2 id="schedule-heading" className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
          Lịch diễn
        </h2>

        <div className="flex items-center gap-2 text-[oklch(0.65_0_0)] text-sm py-3 border-b border-[oklch(0.26_0_0)]">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={eventDate}>{dateText}</time>
        </div>

        <SectionList
          isLoading={isLoading}
          sectionSummaries={sectionSummaries}
          basePrice={basePrice}
          onSelect={openSeatMap}
        />
      </section>

      {selectedSection && (
        <SeatMapDialog
          eventId={eventId}
          selectedSection={selectedSection}
          allRowsGrouped={allRowsGrouped}
          seats={seats}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          price={price}
          onClose={closeSeatMap}
          onSeatClick={handleSeatClick}
          onRemoveSeat={(id) => handleSeatClick(id, true)}
        />
      )}
    </>
  )
})