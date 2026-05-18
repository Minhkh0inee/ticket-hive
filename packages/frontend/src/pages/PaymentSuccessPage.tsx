import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, CalendarDays, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchBookingDetailRequest } from '@/stores/slices/booking.slice'
import { fmtDate, fmtPrice } from '@/lib/format'

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { currentBooking, currentBookingLoading, currentBookingError } =
    useAppSelector((s) => s.booking)

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingDetailRequest(bookingId))
    }
  }, [bookingId, dispatch])

  if (!bookingId) {
    navigate('/', { replace: true })
    return null
  }

  if (currentBookingLoading) {
    return (
      <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[oklch(0.6_0.2_250)]" />
      </div>
    )
  }

  if (currentBookingError || !currentBooking) {
    return (
      <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-[oklch(0.6_0_0)] text-sm">
            {currentBookingError ?? 'Không thể tải thông tin đặt vé.'}
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center px-4 py-10">
      <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white w-full max-w-md">
        <CardContent className="pt-10 pb-8 flex flex-col items-center text-center space-y-5">

          <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0.08_145)] flex items-center justify-center">
            <CheckCircle2 size={36} className="text-[oklch(0.7_0.18_145)]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-white font-bold text-xl">Thanh toán thành công!</h1>
            <p className="text-[oklch(0.55_0_0)] text-sm">
              Email xác nhận sẽ được gửi đến{' '}
              <span className="text-[oklch(0.7_0_0)]">{currentBooking.attendeeEmail}</span>
            </p>
          </div>

          <Separator className="bg-[oklch(0.26_0_0)] w-full" />

          <div className="w-full space-y-1">
            <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-wider font-semibold">
              Mã đặt vé
            </p>
            <p className="text-white font-mono font-bold text-base tracking-widest">
              {currentBooking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <Separator className="bg-[oklch(0.26_0_0)] w-full" />

          <div className="w-full space-y-2 text-left">
            <p className="font-semibold text-sm">{currentBooking.event?.title}</p>
            {currentBooking.event?.eventDate && (
              <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                <CalendarDays size={11} />
                {fmtDate(currentBooking.event.eventDate)}
              </p>
            )}
            {currentBooking.event?.venue && (
              <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                <MapPin size={11} />
                {currentBooking.event.venue}
                {currentBooking.event.city && `, ${currentBooking.event.city}`}
              </p>
            )}
          </div>

          <Separator className="bg-[oklch(0.26_0_0)] w-full" />

          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-[oklch(0.55_0_0)]">Tổng tiền</span>
            <span className="text-white font-bold text-lg tabular-nums">
              {fmtPrice(String(currentBooking.totalPrice))}
            </span>
          </div>

          <Button
            onClick={() => navigate('/my-tickets')}
            className="w-full h-10 rounded-xl font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
          >
            Xem vé của tôi
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full h-10 text-[oklch(0.55_0_0)] hover:text-white text-sm"
          >
            Về trang chủ
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
