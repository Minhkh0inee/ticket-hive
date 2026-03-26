import type { Seat } from '@/types/event.types'
import { X } from 'lucide-react'

interface SeatChipsProps {
  selectedSeats: string[]
  seats: Seat[]
  color: string
  bg: string
  onRemove: (seatId: string) => void
}

export function SeatChips({ selectedSeats, seats, color, bg, onRemove }: SeatChipsProps) {
  if (selectedSeats.length === 0) {
    return <span className="text-[oklch(0.45_0_0)] text-xs">Chưa chọn ghế nào</span>
  }

  return (
    <>
      {selectedSeats.map(seatId => {
        const seat = seats.find(s => s.id === seatId)
        return seat ? (
          <button
            key={seatId}
            onClick={() => onRemove(seatId)}
            aria-label={`Bỏ chọn ghế ${seat.label}`}
            className="flex items-center gap-1 text-[10px] font-bold pl-2 pr-1 py-0.5 rounded-full transition-opacity hover:opacity-75"
            style={{ backgroundColor: bg, color }}
          >
            {seat.label}
            <X size={9} />
          </button>
        ) : null
      })}
    </>
  )
}