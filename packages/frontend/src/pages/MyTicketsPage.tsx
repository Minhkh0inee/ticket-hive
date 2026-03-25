import { useEffect, useState } from 'react'
import { Calendar, MapPin, Hash, Ticket, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchBookingsRequest } from '@/stores/slices/booking.slice'
import { fmtDate, fmtPrice } from '@/lib/format'
import type { Booking } from '@/types/event.types'
import { BookingDetailDialog } from '@/components/common/BookingDetailDialog'

export function MyTicketsPage() {
  const dispatch = useAppDispatch()
  const { bookings, bookingsLoading, bookingsError } = useAppSelector(s => s.booking)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    dispatch(fetchBookingsRequest())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="size-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.6 0.2 250), oklch(0.5 0.22 270))',
              }}
            >
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
          </div>
          {!bookingsLoading && !bookingsError && (
            <p className="text-sm text-gray-500 ml-13">
              {bookings.length} confirmed booking{bookings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* States */}
        {bookingsLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading tickets...</span>
          </div>
        ) : bookingsError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-gray-500">{bookingsError}</p>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <TicketCard key={booking.id} booking={booking} onClick={() => setSelectedBooking(booking)} />
            ))}
          </div>
        )}
      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  )
}

function TicketCard({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const statusColor =
    booking.status === 'confirmed'
      ? 'oklch(0.55 0.18 160)'
      : booking.status === 'cancelled'
      ? 'oklch(0.55 0.18 25)'
      : 'oklch(0.55 0.12 80)'

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden border-gray-100 shadow-sm bg-white cursor-pointer transition-shadow hover:shadow-md"
    >
      <div className="flex">
        {/* Accent stripe */}
        <div
          className="w-1.5 flex-shrink-0"
          style={{
            background:
              'linear-gradient(to bottom, oklch(0.6 0.2 250), oklch(0.5 0.22 270))',
          }}
        />

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: event info */}
            <div className="flex-1 min-w-0">
              <Badge
                className="mb-2 text-white text-[10px] px-2 py-0 h-5 font-medium capitalize"
                style={{ background: statusColor }}
              >
                {booking.status}
              </Badge>

              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3">
                {booking.event.title}
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>{fmtDate(booking.event.eventDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>{booking.event.venue}{booking.event.city && `, ${booking.event.city}`}</span>
                </div>
              </div>
            </div>

            {/* Right: price + booking code */}
            <div className="flex-shrink-0 text-right flex flex-col items-end justify-between h-full gap-4">
              <p className="text-2xl font-bold text-gray-900">
                {fmtPrice(booking.totalPrice)}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Hash className="w-3 h-3" />
                <span className="font-mono tracking-wide">
                  {booking.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="size-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'oklch(0.95 0.05 250)' }}
      >
        <Ticket className="w-8 h-8" style={{ color: 'oklch(0.6 0.2 250)' }} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        No tickets yet
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Once you complete a booking, your confirmed tickets will appear here.
      </p>
    </div>
  )
}
