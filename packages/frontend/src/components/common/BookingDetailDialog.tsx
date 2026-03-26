import { Calendar, MapPin, Mail, Phone, User, Hash, Ticket } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { fmtDate, fmtPrice } from '@/lib/format'
import type { Booking } from '@/types/event.types'
import { BookingStatus } from '@/types/event.types'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useEffect } from 'react'
import { fetchBookingDetailRequest } from '@/stores/slices/booking.slice'

interface BookingDetailDialogProps {
  booking: Booking | null
  onClose: () => void
}

const STATUS_STYLE: Record<BookingStatus, { bg: string; label: string }> = {
  [BookingStatus.CONFIRMED]: { bg: 'oklch(0.55 0.18 160)', label: 'Confirmed' },
  [BookingStatus.PENDING]: { bg: 'oklch(0.55 0.12 80)', label: 'Pending' },
  [BookingStatus.CANCELLED]: { bg: 'oklch(0.55 0.18 25)', label: 'Cancelled' },
}

export function BookingDetailDialog({ booking, onClose }: BookingDetailDialogProps) {
  const dispatch = useAppDispatch()
  const { currentBooking, currentBookingLoading } = useAppSelector(s => s.booking)

  useEffect(() => {
    if (booking?.id) {
      dispatch(fetchBookingDetailRequest(booking.id))
    }
  }, [dispatch, booking?.id])

  const detail = (currentBooking?.id === booking?.id ? currentBooking : booking)
  const statusStyle = detail ? (STATUS_STYLE[detail.status] ?? STATUS_STYLE[BookingStatus.PENDING]) : null
  return (
    <Dialog open={!!booking} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white sm:max-w-md p-0 gap-0 overflow-hidden">

        {/* Banner */}
        {detail?.event.bannerUrl ? (
          <div className="h-36 w-full overflow-hidden">
            <img
              src={detail.event.bannerUrl}
              alt={detail.event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-24 w-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.25 0.08 250), oklch(0.2 0.06 270))' }}
          >
            <Ticket className="w-10 h-10 text-[oklch(0.5_0.15_250)]" />
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Header */}
          <DialogHeader className="gap-1.5">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-white text-base font-bold leading-snug pr-6">
                {currentBookingLoading ? '...' : detail?.event.title}
              </DialogTitle>
              {statusStyle && (
                <Badge
                  className="shrink-0 text-white text-[10px] px-2 py-0 h-5 font-medium capitalize"
                  style={{ background: statusStyle.bg }}
                >
                  {statusStyle.label}
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              {detail?.event.eventDate && (
                <p className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0_0)]">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {fmtDate(detail.event.eventDate)}
                </p>
              )}
              {detail?.event.venue && (
                <p className="flex items-center gap-1.5 text-xs text-[oklch(0.55_0_0)]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {detail.event.venue}{detail.event.city && `, ${detail.event.city}`}
                </p>
              )}
            </div>
          </DialogHeader>

          <Separator className="bg-[oklch(0.26_0_0)]" />

          {/* Attendee info */}
          <div className="space-y-2">
            <p className="text-[oklch(0.45_0_0)] text-[10px] uppercase tracking-wider font-semibold">Attendee</p>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-xs text-[oklch(0.75_0_0)]">
                <User className="w-3.5 h-3.5 shrink-0 text-[oklch(0.5_0_0)]" />
                {detail?.attendeeName}
              </p>
              <p className="flex items-center gap-2 text-xs text-[oklch(0.75_0_0)]">
                <Mail className="w-3.5 h-3.5 shrink-0 text-[oklch(0.5_0_0)]" />
                {detail?.attendeeEmail}
              </p>
              {detail?.attendeePhone && (
                <p className="flex items-center gap-2 text-xs text-[oklch(0.75_0_0)]">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[oklch(0.5_0_0)]" />
                  {detail.attendeePhone}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-[oklch(0.26_0_0)]" />

          {/* Seats */}
          <div className="space-y-2">
            <p className="text-[oklch(0.45_0_0)] text-[10px] uppercase tracking-wider font-semibold">
              Seats ({detail?.seatIds.length ?? 0})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {detail?.seatIds.map(id => (
                <Badge
                  key={id}
                  variant="outline"
                  className="text-[10px] border-[oklch(0.3_0_0)] text-[oklch(0.65_0_0)] font-mono"
                >
                  {id}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-[oklch(0.26_0_0)]" />

          {/* Booking meta */}
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-xs text-[oklch(0.5_0_0)]">
              <Hash className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono tracking-wide">{detail?.id}</span>
            </p>
            {detail?.createdAt && (
              <p className="text-xs text-[oklch(0.45_0_0)] pl-5">
                Booked on {fmtDate(detail.createdAt)}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="bg-[oklch(0.16_0_0)] border-t border-[oklch(0.26_0_0)] px-5 py-4 flex-row items-center justify-between sm:justify-between gap-0">
          <div className='p-4'>
            <p className="text-[10px] text-[oklch(0.45_0_0)] uppercase tracking-wider font-semibold">Total</p>
            <p className="text-white font-bold text-lg tabular-nums">
              {detail ? fmtPrice(detail.totalPrice) : '—'}
            </p>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
