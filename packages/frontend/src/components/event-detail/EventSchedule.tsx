import { memo, useMemo, useState, type ElementType } from 'react'
import { Calendar, Crown, Music2, Layers, Users, Ticket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fmtDateRange, fmtPrice } from '@/lib/format'
import type { SeatSection, TicketType } from '@/types/event.types'

const SECTION_CONFIG: Record<SeatSection, {
  label: string; color: string; bg: string; Icon: ElementType
  rows: string[]; cols: number
}> = {
  vip:     { label: 'VIP',       color: 'oklch(0.75 0.18 85)',  bg: 'oklch(0.22 0.04 85)',  Icon: Crown,  rows: ['A','B','C'],               cols: 8  },
  floor:   { label: 'Sàn',       color: 'oklch(0.6 0.2 250)',   bg: 'oklch(0.2 0.04 250)',  Icon: Music2, rows: ['A','B','C','D','E'],        cols: 10 },
  balcony: { label: 'Ban công',  color: 'oklch(0.65 0.18 300)', bg: 'oklch(0.2 0.04 300)',  Icon: Layers, rows: ['A','B','C','D'],            cols: 9  },
  general: { label: 'Phổ thông', color: 'oklch(0.6 0 0)',       bg: 'oklch(0.22 0 0)',      Icon: Users,  rows: ['A','B','C','D','E','F'],    cols: 10 },
}

const MAX_SEATS = 8

// Deterministic "booked" seats: every seat whose (rowIndex * cols + colIndex) % 7 === 3
function isMockBooked(rowIdx: number, colIdx: number) {
  return (rowIdx * 13 + colIdx * 7) % 11 === 0
}

interface EventScheduleProps {
  eventDate: string
  endDate?: string
  ticketTypes: TicketType[]
}

export const EventSchedule = memo(function EventSchedule({ eventDate, endDate, ticketTypes }: EventScheduleProps) {
  const dateText = useMemo(() => fmtDateRange(eventDate, endDate), [eventDate, endDate])
  const hasAvailable = useMemo(() => ticketTypes.some(t => t.available), [ticketTypes])

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [chosenSeats, setChosenSeats] = useState<string[]>([])

  function openDialog(ticket: TicketType) {
    setSelectedTicket(ticket)
    setChosenSeats([])
  }

  function closeDialog() {
    setSelectedTicket(null)
    setChosenSeats([])
  }

  function toggleSeat(label: string, booked: boolean) {
    if (booked) return
    setChosenSeats(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : prev.length < MAX_SEATS ? [...prev, label] : prev
    )
  }

  const totalPrice = selectedTicket
    ? Number(selectedTicket.price) * chosenSeats.length
    : 0

  return (
    <>
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
            {ticketTypes.map(ticket => {
              const { Icon, label, color, bg } = SECTION_CONFIG[ticket.section]
              return (
                <li
                  key={ticket.id}
                  className="flex items-center justify-between gap-3 py-3 border-b border-[oklch(0.23_0_0)] last:border-0"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span
                      className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap flex items-center gap-1"
                      style={{ color, backgroundColor: bg }}
                    >
                      <Icon size={10} aria-hidden="true" />
                      {label}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-[oklch(0.5_0_0)] text-xs mt-0.5">{ticket.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[oklch(0.6_0.2_250)] text-sm font-semibold whitespace-nowrap">
                      {fmtPrice(ticket.price)}
                    </span>
                    {ticket.available ? (
                      <Button
                        size="sm"
                        onClick={() => openDialog(ticket)}
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
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Seat map dialog ───────────────────────────────────────────────── */}
      {selectedTicket && (() => {
        const { Icon, label, color, bg, rows, cols } = SECTION_CONFIG[selectedTicket.section]
        return (
          <Dialog open onOpenChange={open => { if (!open) closeDialog() }}>
            <DialogContent className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-lg rounded-2xl p-0 gap-0 overflow-hidden">

              {/* Header */}
              <DialogHeader className="px-5 pt-5 pb-4 pr-12 border-b border-[oklch(0.26_0_0)]">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"
                    style={{ color, backgroundColor: bg }}
                  >
                    <Icon size={10} aria-hidden="true" />
                    {label}
                  </span>
                  <DialogTitle className="text-white text-sm font-bold">
                    {selectedTicket.name} — {fmtPrice(selectedTicket.price)}<span className="text-[oklch(0.5_0_0)] font-normal"> / ghế</span>
                  </DialogTitle>
                </div>
                <p className="text-[oklch(0.45_0_0)] text-xs mt-0.5">
                  Chọn tối đa {MAX_SEATS} ghế
                </p>
              </DialogHeader>

              {/* Seat map */}
              <div className="px-5 pt-4 pb-3 overflow-y-auto max-h-[52vh]">
                {/* Stage */}
                <div className="mb-4 flex justify-center">
                  <div className="w-2/3 h-6 rounded-t-full bg-[oklch(0.26_0_0)] flex items-center justify-center">
                    <span className="text-[oklch(0.5_0_0)] text-[10px] uppercase tracking-widest font-semibold">Sân khấu</span>
                  </div>
                </div>

                {/* Rows */}
                <div className="space-y-2 flex flex-col items-center">
                  {rows.map((row, rowIdx) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-4 text-[oklch(0.45_0_0)] text-[10px] font-bold shrink-0 text-center">{row}</span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: cols }, (_, colIdx) => {
                          const seatLabel = `${row}${colIdx + 1}`
                          const booked = isMockBooked(rowIdx, colIdx)
                          const chosen = chosenSeats.includes(seatLabel)
                          const maxed = !chosen && chosenSeats.length >= MAX_SEATS

                          return (
                            <button
                              key={seatLabel}
                              onClick={() => toggleSeat(seatLabel, booked)}
                              disabled={booked || maxed}
                              aria-label={`Ghế ${seatLabel}${booked ? ' (đã đặt)' : chosen ? ' (đang chọn)' : ''}`}
                              aria-pressed={chosen}
                              className={[
                                'w-7 h-7 rounded text-[10px] font-bold transition-all duration-150',
                                booked
                                  ? 'bg-[oklch(0.24_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed'
                                  : chosen
                                    ? 'text-white scale-105 shadow-lg'
                                    : maxed
                                      ? 'bg-[oklch(0.22_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed'
                                      : 'bg-[oklch(0.28_0_0)] text-[oklch(0.65_0_0)] hover:bg-[oklch(0.32_0_0)] hover:text-white cursor-pointer',
                              ].join(' ')}
                              style={chosen ? { backgroundColor: color } : undefined}
                            >
                              {colIdx + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-4 justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[oklch(0.28_0_0)]" />
                    <span className="text-[oklch(0.5_0_0)] text-[10px]">Còn trống</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                    <span className="text-[oklch(0.5_0_0)] text-[10px]">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[oklch(0.24_0_0)]" />
                    <span className="text-[oklch(0.5_0_0)] text-[10px]">Đã đặt</span>
                  </div>
                </div>
              </div>

              {/* Summary + actions */}
              <div className="border-t border-[oklch(0.26_0_0)] px-5 py-4 space-y-3">
                {/* Chosen seat chips */}
                <div className="min-h-[28px] flex flex-wrap gap-1.5 items-center">
                  {chosenSeats.length === 0 ? (
                    <span className="text-[oklch(0.45_0_0)] text-xs">Chưa chọn ghế nào</span>
                  ) : (
                    chosenSeats.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSeat(s, false)}
                        aria-label={`Bỏ chọn ghế ${s}`}
                        className="flex items-center gap-1 text-[10px] font-bold pl-2 pr-1 py-0.5 rounded-full transition-opacity hover:opacity-75"
                        style={{ backgroundColor: bg, color }}
                      >
                        {s}
                        <X size={9} />
                      </button>
                    ))
                  )}
                </div>

                {/* Price row + confirm */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[oklch(0.5_0_0)] text-[10px]">
                      {chosenSeats.length} ghế × {fmtPrice(selectedTicket.price)}
                    </p>
                    <p className="text-white font-bold text-base tabular-nums leading-tight">
                      {chosenSeats.length > 0 ? fmtPrice(String(totalPrice)) : '—'}
                    </p>
                  </div>
                  <Button
                    disabled={chosenSeats.length === 0}
                    className="rounded-xl h-10 px-5 font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white gap-2 disabled:opacity-40"
                  >
                    <Ticket size={14} aria-hidden="true" />
                    Đặt {chosenSeats.length > 0 ? `${chosenSeats.length} ghế` : 'vé'}
                  </Button>
                </div>
              </div>

            </DialogContent>
          </Dialog>
        )
      })()}
    </>
  )
})
