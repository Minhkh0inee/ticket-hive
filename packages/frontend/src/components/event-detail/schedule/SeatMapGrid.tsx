import type { Seat, SeatSection } from '@/types/event.types'
import { SeatButton } from './SeatButton'

interface SeatMapGridProps {
  allRowsGrouped: Record<string, Seat[]>
  selectedSection: SeatSection
  selectedSeats: string[]
  color: string
  onSeatClick: (seatId: string, isSelected: boolean) => void
}

const MAX_SEATS = 4

export function SeatMapGrid({
  allRowsGrouped, selectedSection, selectedSeats, color, onSeatClick
}: SeatMapGridProps) {
  return (
    <div className="space-y-2 flex flex-col items-center">
      {Object.entries(allRowsGrouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-4 text-[oklch(0.45_0_0)] text-[10px] font-bold shrink-0 text-center">
              {row}
            </span>
            <div className="flex gap-1.5">
              {rowSeats.sort((a, b) => a.number - b.number).map(seat => (
                <SeatButton
                  key={seat.id}
                  seatId={seat.id}
                  number={seat.number}
                  label={seat.label}
                  status={seat.status}
                  isLocked={seat.isLocked}
                  isCurrentSection={seat.section === selectedSection}
                  isSelected={selectedSeats.includes(seat.id)}
                  isMaxed={!selectedSeats.includes(seat.id) && selectedSeats.length >= MAX_SEATS}
                  color={color}
                  onClick={onSeatClick}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}