import { useEffect, useMemo, useState } from 'react'
import { fetchSeatsRequest, selectSeat, deselectSeat } from '@/stores/slices/seat.slice'
import type { SeatSection } from '@/types/event.types'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'

export function useSeatMap(eventId: string, basePrice: number) {
  const dispatch = useAppDispatch()
  const { seats, selectedSeats, isLoading } = useAppSelector(state => state.seat)
  const [selectedSection, setSelectedSection] = useState<SeatSection | null>(null)

  useEffect(() => {
    if (eventId) dispatch(fetchSeatsRequest(eventId))
  }, [dispatch, eventId])

  const sectionSummaries = useMemo(() => {
    const grouped = seats.reduce((acc, seat) => {
      if (!acc[seat.section]) acc[seat.section] = []
      acc[seat.section].push(seat)
      return acc
    }, {} as Record<SeatSection, typeof seats>)

    return (Object.entries(grouped) as [SeatSection, typeof seats][]).map(
      ([section, sectionSeats]) => ({
        section,
        total: sectionSeats.length,
        available: sectionSeats.filter(s => s.status === 'available' && !s.isLocked).length,
        priceModifier: Number(sectionSeats[0]?.priceModifier ?? 1),
      })
    )
  }, [seats])

  const allRowsGrouped = useMemo(() =>
    seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    }, {} as Record<string, typeof seats>)
  , [seats])

  const totalPrice = useMemo(() => {
    if (!selectedSection) return 0
    const modifier = sectionSummaries.find(s => s.section === selectedSection)?.priceModifier ?? 1
    return basePrice * modifier * selectedSeats.length
  }, [basePrice, selectedSection, selectedSeats, sectionSummaries])

  return {
    seats,
    selectedSeats,
    isLoading,
    selectedSection,
    sectionSummaries,
    allRowsGrouped,
    totalPrice,
    openSeatMap: setSelectedSection,
    closeSeatMap: () => setSelectedSection(null),
    handleSeatClick: (seatId: string, isSelected: boolean) => {
      if (isSelected) dispatch(deselectSeat(seatId))
      else dispatch(selectSeat(seatId))
    },
  }
}