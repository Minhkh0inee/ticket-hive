import { Calendar, MapPin, Tag, Hash, Ticket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Booking {
  id: string
  eventName: string
  eventDate: string
  venue: string
  ticketType: string
  seatNumber: string
  price: number
  bookingCode: string
}

const mockBookings: Booking[] = [
  {
    id: '1',
    eventName: 'Taylor Swift — The Eras Tour',
    eventDate: 'Sat, Apr 12, 2025 · 7:30 PM',
    venue: 'SoFi Stadium, Los Angeles',
    ticketType: 'VIP Floor',
    seatNumber: 'GA Floor — Zone A',
    price: 450,
    bookingCode: 'TH-2025-00418',
  },
  {
    id: '2',
    eventName: 'Coldplay — Music of the Spheres',
    eventDate: 'Fri, May 23, 2025 · 8:00 PM',
    venue: 'MetLife Stadium, New Jersey',
    ticketType: 'Premium Seating',
    seatNumber: 'Section 104, Row C, Seat 12',
    price: 280,
    bookingCode: 'TH-2025-00631',
  },
  {
    id: '3',
    eventName: 'UEFA Champions League Final',
    eventDate: 'Sat, Jun 1, 2025 · 8:00 PM',
    venue: 'Wembley Stadium, London',
    ticketType: 'Category 1',
    seatNumber: 'Block N11, Row 8, Seat 22',
    price: 650,
    bookingCode: 'TH-2025-00887',
  },
  {
    id: '4',
    eventName: 'Dua Lipa — Radical Optimism Tour',
    eventDate: 'Wed, Jul 9, 2025 · 7:00 PM',
    venue: 'Madison Square Garden, New York',
    ticketType: 'Standard',
    seatNumber: 'Section 201, Row M, Seat 7',
    price: 175,
    bookingCode: 'TH-2025-01024',
  },
]

export function MyTicketsPage() {
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
          <p className="text-sm text-gray-500 ml-13">
            {mockBookings.length} confirmed booking{mockBookings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Ticket list */}
        {mockBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TicketCard({ booking }: { booking: Booking }) {
  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm bg-white">
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
                className="mb-2 text-white text-[10px] px-2 py-0 h-5 font-medium"
                style={{ background: 'oklch(0.55 0.18 160)' }}
              >
                Confirmed
              </Badge>

              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3">
                {booking.eventName}
              </h3>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>{booking.eventDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>{booking.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                  <span>
                    {booking.ticketType} &middot; {booking.seatNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: price + booking code */}
            <div className="flex-shrink-0 text-right flex flex-col items-end justify-between h-full gap-4">
              <p className="text-2xl font-bold text-gray-900">
                ${booking.price}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <Hash className="w-3 h-3" />
                <span className="font-mono tracking-wide">
                  {booking.bookingCode}
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
