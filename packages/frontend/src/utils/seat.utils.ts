import type { Seat } from "@/types/event.types"

export type SeatSection = 'vip' | 'floor' | 'balcony' | 'general'

export interface SeatSectionSummary {
  section: SeatSection
  label: string
  total: number
  available: number
  priceModifier: string
}

export function groupSeatsBySection(seats: Seat[]): Record<SeatSection, Seat[]> {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.section]) acc[seat.section] = []
    acc[seat.section].push(seat)
    return acc
  }, {} as Record<SeatSection, Seat[]>)
}

export function getSectionSummaries(seats: Seat[]): SeatSectionSummary[] {
  const grouped = groupSeatsBySection(seats)
  const labels: Record<SeatSection, string> = {
    vip: 'VIP',
    floor: 'Sàn',
    balcony: 'Balcony',
    general: 'Thường',
  }

  return (Object.entries(grouped) as [SeatSection, Seat[]][]).map(([section, sectionSeats]) => ({
    section,
    label: labels[section],
    total: sectionSeats.length,
    available: sectionSeats.filter(s => s.status === 'available' && !s.isLocked).length,
    priceModifier: sectionSeats[0]?.priceModifier ?? 1,
  }))
}