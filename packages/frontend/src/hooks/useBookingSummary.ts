// hooks/useBookingSummary.ts
import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from '@/hooks/useAppSelector'
import { SECTION_CONFIG } from '@/components/event-detail/schedule/constants'
import type { SeatSection } from '@/types/event.types'

const BOOKING_FEE_RATE = 0.05

export function useBookingSummary() {
  const { currentEvent, seats, selectedSeats } = useAppSelector(s => ({
    currentEvent: s.event.currentEvent,
    seats: s.seat.seats,
    selectedSeats: s.seat.selectedSeats,
  }), shallowEqual)

  const summary = useMemo(() => {
    const selectedSeatObjects = seats.filter(s => selectedSeats.includes(s.id))
    const section = selectedSeatObjects[0]?.section as SeatSection | undefined
    const sectionConfig = section ? SECTION_CONFIG[section] : null
    const priceModifier = selectedSeatObjects[0] ? parseFloat(selectedSeatObjects[0].priceModifier) : 1
    const unitPrice = (currentEvent?.basePrice ?? 0) * priceModifier
    const subtotal = unitPrice * selectedSeatObjects.length
    const bookingFee = Math.round(subtotal * BOOKING_FEE_RATE)
    const total = subtotal + bookingFee
    return { selectedSeatObjects, sectionConfig, unitPrice, subtotal, bookingFee, total, currentEvent }
  }, [seats, selectedSeats, currentEvent?.basePrice])

  return summary
}