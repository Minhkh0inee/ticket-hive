import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, CalendarDays, MapPin, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { fmtPrice, fmtDate } from '@/lib/format'
import { useAppSelector } from '@/hooks/useAppSelector'
import { clearSelection, unlockSeatRequest } from '@/stores/slices/seat.slice'
import { createBookingRequest, resetCreateBooking } from '@/stores/slices/booking.slice'
import { SECTION_CONFIG } from '@/components/event-detail/schedule/constants'
import type { SeatSection } from '@/types/event.types'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0[0-9]{9,10}$/, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutLocationState {
  lockExpiresAt?: string
  lockToken?: string
}

const BOOKING_FEE_RATE = 0.05

function useCountdown(lockExpiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!lockExpiresAt) return 0
    return Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000))
  })

  useEffect(() => {
    if (!lockExpiresAt) return
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [lockExpiresAt])

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  return { secondsLeft, display: `${mins}:${secs}`, isExpired: secondsLeft === 0 }
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as CheckoutLocationState
  const dispatch = useAppDispatch()
  const confirmedRef = useRef(false)
  const warnedRef = useRef(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)

  const { isCreating, createSuccess, createError, currentBooking } = useAppSelector(s => s.booking)

  const [fallbackExpiry] = useState(() =>
    new Date(Date.now() + 10 * 60 * 1000).toISOString()
  )
  const lockExpiresAt = state.lockExpiresAt ?? fallbackExpiry

  const { secondsLeft, display: countdownDisplay, isExpired } = useCountdown(lockExpiresAt)

  const currentEvent = useAppSelector(s => s.event.currentEvent)
  const { seats, selectedSeats } = useAppSelector(s => s.seat)

  const selectedSeatsRef = useRef(selectedSeats)
  const eventIdRef = useRef(currentEvent?.id)
  useEffect(() => { selectedSeatsRef.current = selectedSeats }, [selectedSeats])
  useEffect(() => { eventIdRef.current = currentEvent?.id }, [currentEvent])

  function handleBack() {
    if (!confirmedRef.current && currentEvent?.id && selectedSeats.length > 0) {
      dispatch(unlockSeatRequest({
        eventId: currentEvent.id,
        seatIds: selectedSeats,
      }))
    }
    dispatch(clearSelection())
    navigate(-1)
  }

  const selectedSeatObjects = seats.filter(s => selectedSeats.includes(s.id))
  const section = selectedSeatObjects[0]?.section as SeatSection | undefined
  const sectionConfig = section ? SECTION_CONFIG[section] : null

  const priceModifier = selectedSeatObjects[0]
    ? parseFloat(selectedSeatObjects[0].priceModifier)
    : 1
  const unitPrice = (currentEvent?.basePrice ?? 0) * priceModifier
  const subtotal = unitPrice * selectedSeatObjects.length
  const bookingFee = Math.round(subtotal * BOOKING_FEE_RATE)
  const total = subtotal + bookingFee

  useEffect(() => {
    if (isExpired && state.lockExpiresAt) {
      setShowExpiredModal(true)
    }
  }, [isExpired, state.lockExpiresAt])

  // Warn user at T-2 min remaining (once)
  useEffect(() => {
    if (secondsLeft <= 120 && secondsLeft > 0 && !warnedRef.current) {
      warnedRef.current = true
      toast.warning('Ghế sắp hết hạn giữ — còn 2 phút!')
    }
  }, [secondsLeft])

  useEffect(() => {
    function handleBeforeUnload() {
      if (confirmedRef.current || !eventIdRef.current || selectedSeatsRef.current.length === 0) return
      const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
      const token = localStorage.getItem('accessToken')
      fetch(`${apiUrl}/seats/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ eventId: eventIdRef.current, seatIds: selectedSeatsRef.current }),
        keepalive: true,
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Navigate to confirmation on successful booking
  useEffect(() => {
    if (createSuccess && currentBooking) {
      confirmedRef.current = true
      dispatch(clearSelection())
      dispatch(resetCreateBooking())
      navigate(`/confirmation/${currentBooking.id}`, { replace: true })
    }
  }, [createSuccess, currentBooking, dispatch, navigate])

  // Reset slice on unmount so stale state doesn't linger
  useEffect(() => {
    return () => { dispatch(resetCreateBooking()) }
  }, [dispatch])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  })

  function onSubmit(data: CheckoutFormData) {
    if (isExpired || isCreating || !currentEvent) return
    dispatch(createBookingRequest({
      eventId: currentEvent.id,
      seatIds: selectedSeats,
      attendeeName: data.fullName,
      attendeeEmail: data.email,
      attendeePhone: data.phone,
    }))
  }

  const canPay = !isExpired && isValid
  return (
    <div className="min-h-screen bg-[oklch(0.13_0_0)] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack} 
            className="text-[oklch(0.5_0_0)] hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
          >
            ← Quay lại
          </Button>
          <h1 className="text-white font-bold text-2xl">Thanh toán</h1>
          <p className="text-[oklch(0.5_0_0)] text-sm mt-1">Hoàn tất đặt vé của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ── Left: Payment Form ── */}
          <div className="space-y-5">

            {/* Seat-lock countdown notice */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              isExpired
                ? 'bg-[oklch(0.18_0.05_25)] border-[oklch(0.35_0.1_25)] text-[oklch(0.7_0.1_25)]'
                : 'bg-[oklch(0.17_0.04_250)] border-[oklch(0.3_0.08_250)] text-[oklch(0.7_0.15_250)]'
            }`}>
              <Lock size={15} className="shrink-0" />
              {isExpired ? (
                <span className="text-sm font-medium">Ghế đã hết thời gian giữ — đang chuyển hướng...</span>
              ) : (
                <span className="text-sm">
                  Ghế được giữ trong{' '}
                  <span className="font-bold tabular-nums">{countdownDisplay}</span>
                </span>
              )}
            </div>

            <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard size={16} className="text-[oklch(0.6_0.2_250)]" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-[oklch(0.7_0_0)] text-xs">Họ và tên</Label>
                      <Input
                        id="fullName"
                        placeholder="Nguyễn Văn A"
                        {...register('fullName')}
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                      {errors.fullName && (
                        <p className="text-[oklch(0.7_0.15_25)] text-xs">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[oklch(0.7_0_0)] text-xs">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        {...register('email')}
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                      {errors.email && (
                        <p className="text-[oklch(0.7_0.15_25)] text-xs">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-[oklch(0.7_0_0)] text-xs">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      inputMode="tel"
                      {...register('phone')}
                      className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                    />
                    {errors.phone && (
                      <p className="text-[oklch(0.7_0.15_25)] text-xs">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-[oklch(0.7_0_0)] text-xs">Số thẻ</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={form.cardNumber}
                      onChange={handleCardNumber}
                      inputMode="numeric"
                      className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10 font-mono tracking-widest"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-[oklch(0.7_0_0)] text-xs">Hạn thẻ (MM/YY)</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={handleExpiry}
                        inputMode="numeric"
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-[oklch(0.7_0_0)] text-xs">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="•••"
                        value={form.cvv}
                        onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        inputMode="numeric"
                        type="password"
                        className="bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] text-white placeholder:text-[oklch(0.4_0_0)] focus-visible:ring-[oklch(0.6_0.2_250)] h-10"
                      />
                    </div>
                  </div> */}

                  {createError && (
                    <p className="text-[oklch(0.7_0.15_25)] text-xs">{createError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={!canPay || isCreating || isExpired}
                    className="w-full h-11 rounded-xl font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white disabled:opacity-40 gap-2 mt-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Đang xử lý...
                      </>
                    ) : isExpired ? (
                      'Ghế đã hết hạn'
                    ) : (
                      <>
                        <CreditCard size={15} />
                        Thanh toán {total > 0 ? fmtPrice(String(total)) : ''}
                      </>
                    )}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* ── Right: Order Summary ── */}
          <div>
            <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Event info */}
                <div>
                  <p className="font-semibold text-sm leading-snug">
                    {currentEvent?.title ?? 'Sự kiện'}
                  </p>
                  <div className="mt-2 space-y-1">
                    {currentEvent?.eventDate && (
                      <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                        <CalendarDays size={11} />
                        {fmtDate(currentEvent.eventDate)}
                      </p>
                    )}
                    {currentEvent?.venue && (
                      <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                        <MapPin size={11} />
                        {currentEvent.venue}
                        {currentEvent.city && `, ${currentEvent.city}`}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                {/* Seat info */}
                <div>
                  <p className="text-[oklch(0.55_0_0)] text-xs mb-2">Ghế đã chọn</p>
                  {selectedSeatObjects.length === 0 ? (
                    <p className="text-[oklch(0.4_0_0)] text-xs italic">Chưa có ghế được chọn</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {sectionConfig && (
                        <Badge
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ color: sectionConfig.color, backgroundColor: sectionConfig.bg }}
                        >
                          {sectionConfig.label}
                        </Badge>
                      )}
                      {selectedSeatObjects.map(s => (
                        <Badge
                          key={s.id}
                          variant="outline"
                          className="text-[10px] border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]"
                        >
                          {s.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[oklch(0.55_0_0)]">
                    <span>{selectedSeatObjects.length} vé × {fmtPrice(String(unitPrice))}</span>
                    <span>{fmtPrice(String(subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[oklch(0.55_0_0)]">
                    <span>Phí đặt vé (5%)</span>
                    <span>{fmtPrice(String(bookingFee))}</span>
                  </div>
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Tổng cộng</span>
                  <span className="text-white font-bold text-lg tabular-nums">
                    {total > 0 ? fmtPrice(String(total)) : '—'}
                  </span>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {showExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4">
            <h2 className="text-white font-semibold text-lg">Ghế đã hết thời gian giữ</h2>
            <p className="text-[oklch(0.55_0_0)] text-sm">
              Thời gian giữ ghế đã hết. Vui lòng quay lại và chọn ghế mới.
            </p>
            <Button onClick={handleBack} className="w-full h-10 bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)]">
              Chọn lại ghế
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
