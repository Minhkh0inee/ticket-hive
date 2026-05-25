import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'
import { clearSelection, unlockSeatRequest } from '@/stores/slices/seat.slice'
import { resetCreateBooking } from '@/stores/slices/booking.slice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { shallowEqual } from 'react-redux'
import { useCheckoutExpiry } from '@/hooks/useCheckoutExpire'
import CountDown from '@/components/checkout/CountDown'
import ExpireModal from '@/components/checkout/ExpireModal'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentForm from '@/components/checkout/PaymentForm'

interface CheckoutLocationState {
  lockExpiresAt?: string
  lockToken?: string
}



export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as CheckoutLocationState
  const dispatch = useAppDispatch()
  const confirmedRef = useRef(false)
  
  
  const { isCreating, createSuccess, createError, currentBooking, paymentUrl, currentEvent, selectedSeats } = useAppSelector(s => ({
    isCreating: s.booking.isCreating,
    createSuccess: s.booking.createSuccess,
    createError: s.booking.createError,
    currentBooking: s.booking.currentBooking,
    paymentUrl: s.booking.paymentUrl,
    currentEvent: s.event.currentEvent,
    seats: s.seat.seats,
    selectedSeats: s.seat.selectedSeats,
  }), shallowEqual)

  const [fallbackExpiry] = useState(() =>
    new Date(Date.now() + 10 * 60 * 1000).toISOString()
  )
  const lockExpiresAt = state.lockExpiresAt ?? fallbackExpiry
  const { isExpired } = useCheckoutExpiry(lockExpiresAt)  
  const shouldShowExpiredModal = isExpired && !!state.lockExpiresAt

  const selectedSeatsRef = useRef(selectedSeats)
  const eventIdRef = useRef(currentEvent?.id)
  useEffect(() => { selectedSeatsRef.current = selectedSeats }, [selectedSeats])
  useEffect(() => { eventIdRef.current = currentEvent?.id }, [currentEvent])

  const handleBack = useCallback(() => {
    if (!confirmedRef.current && currentEvent?.id && selectedSeats.length > 0) {
      dispatch(unlockSeatRequest({ eventId: currentEvent.id, seatIds: selectedSeats }))
    }
    dispatch(clearSelection())
    navigate(-1)
  }, [currentEvent, selectedSeats, dispatch, navigate])

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

  // Redirect to PayOS checkout on successful booking creation
  useEffect(() => {
    if (createSuccess && currentBooking && paymentUrl) {
      confirmedRef.current = true
      dispatch(clearSelection())
      dispatch(resetCreateBooking())
      window.location.href = paymentUrl
    }
  }, [createSuccess, currentBooking, paymentUrl, dispatch])


  useEffect(() => {
    return () => { dispatch(resetCreateBooking()) }
  }, [dispatch])


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
          <p className="text-[oklch(0.5_0_0)] text-sm mt-1">
            Hoàn tất đặt vé của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ── Left: Payment Form ── */}
          <div className="space-y-5">
            <CountDown lockExpiresAt={lockExpiresAt} />

            <PaymentForm
              createError={createError}
              isCreating={isCreating}
              currentEvent={currentEvent}
              isExpired={isExpired}
              selectedSeats={selectedSeats}
            />
          </div>

          {/* ── Right: Order Summary ── */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>

      <ExpireModal handleBack={handleBack} showModal={shouldShowExpiredModal} />
    </div>
  );
}
