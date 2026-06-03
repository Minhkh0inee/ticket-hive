import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchSeatsRequest } from '@/stores/slices/seat.slice'
import type { Seat, SeatSection } from '@/types/event.types'

const SECTIONS: SeatSection[] = ['floor', 'balcony', 'vip', 'general']

const SECTION_LABELS: Record<SeatSection, string> = {
  floor: 'Floor',
  balcony: 'Balcony',
  vip: 'VIP',
  general: 'General',
}

function getSeatBg(seat: Seat): string {
  if (seat.isLocked) return 'oklch(0.55 0.12 80)'
  if (seat.status === 'booked') return 'oklch(0.25 0 0)'
  return 'oklch(0.35 0.12 145)'
}

function getSeatTextColor(seat: Seat): string {
  if (seat.status === 'booked') return 'oklch(0.45 0 0)'
  return 'white'
}

function SeatGridSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 w-24 bg-[oklch(0.22_0_0)] rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 16 }).map((_, j) => (
              <div key={j} className="w-10 h-8 bg-[oklch(0.22_0_0)] rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminSeatsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { seats, isLoading, error } = useAppSelector((s) => s.seat)

  useEffect(() => {
    if (id) dispatch(fetchSeatsRequest(id))
  }, [dispatch, id])

  const total = seats.length
  const available = seats.filter((s) => !s.isLocked && s.status === 'available').length
  const locked = seats.filter((s) => s.isLocked).length
  const booked = seats.filter((s) => s.status === 'booked').length

  const seatsBySection = SECTIONS.reduce<Record<SeatSection, Seat[]>>(
    (acc, section) => {
      acc[section] = seats.filter((s) => s.section === section)
      return acc
    },
    { floor: [], balcony: [], vip: [], general: [] },
  )

  return (
    <div>
      <button
        onClick={() => navigate('/admin/events')}
        className="flex items-center gap-2 text-sm text-[oklch(0.55_0_0)] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Seat Management</h1>
        <p className="text-sm text-[oklch(0.5_0_0)] mt-0.5">Event ID: {id}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total', value: total, color: 'oklch(0.6 0.2 250)' },
          { label: 'Available', value: available, color: 'oklch(0.55 0.18 160)' },
          { label: 'Locked', value: locked, color: 'oklch(0.55 0.12 80)' },
          { label: 'Booked', value: booked, color: 'oklch(0.5 0 0)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[oklch(0.2_0_0)] bg-[oklch(0.16_0_0)] p-4"
          >
            <p className="text-xs text-[oklch(0.5_0_0)] mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <SeatGridSkeleton />
      ) : seats.length === 0 && !error ? (
        <p className="text-[oklch(0.45_0_0)] text-sm">No seats found for this event.</p>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map((section) => {
            const sectionSeats = seatsBySection[section]
            if (sectionSeats.length === 0) return null

            const rows = [...new Set(sectionSeats.map((s) => s.row))].sort()

            return (
              <div key={section}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white">{SECTION_LABELS[section]}</h2>
                  <span className="text-xs text-[oklch(0.5_0_0)]">
                    {sectionSeats.filter((s) => !s.isLocked && s.status === 'available').length}/
                    {sectionSeats.length} available
                  </span>
                </div>
                <div className="rounded-xl border border-[oklch(0.2_0_0)] bg-[oklch(0.15_0_0)] p-4 space-y-2">
                  {rows.map((row) => {
                    const rowSeats = sectionSeats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.number - b.number)
                    return (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-5 text-xs text-[oklch(0.45_0_0)] font-mono text-right flex-shrink-0">
                          {row}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rowSeats.map((seat) => (
                            <div
                              key={seat.id}
                              title={`${seat.label} — ${seat.isLocked ? 'locked' : seat.status}`}
                              className="w-9 h-7 rounded text-[10px] font-medium flex items-center justify-center"
                              style={{
                                background: getSeatBg(seat),
                                color: getSeatTextColor(seat),
                              }}
                            >
                              {seat.number}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-4 mt-8 text-xs text-[oklch(0.5_0_0)]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: 'oklch(0.35 0.12 145)' }} />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: 'oklch(0.55 0.12 80)' }} />
          Locked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: 'oklch(0.25 0 0)' }} />
          Booked
        </div>
      </div>
    </div>
  )
}
