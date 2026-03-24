export type EventCategory = 'music' | 'sports' | 'theatre' | 'festival' | 'conference'

export interface Event {
  id: string
  title: string
  description: string
  venue: string
  city: string
  category: EventCategory
  eventDate: string
  bannerUrl: string | null
  totalSeats: number
  availableSeats: number
  basePrice: number
  organizer: EventOrganizer
}

export type SeatSection = 'floor' | 'balcony' | 'vip' | 'general'

export type SeatStatus = 'available' | 'locked' | 'booked'

export interface Seat {
  id: string
  row: string
  number: number
  label: string
  section: SeatSection
  status: 'available' | 'booked' | 'locked'
  priceModifier: string
  isLocked: boolean
  lockedBy: string | null
}

export interface TicketType {
  id: string
  name: string
  price: string
  description?: string
  available: boolean
  section: SeatSection
}

export interface EventOrganizer {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
}

export interface EventDetail {
  eventId: string
  endDate?: string
  venueAddress?: string
  bannerUrl: string
  description: string
  ticketTypes: TicketType[]
  organizer: EventOrganizer
  isSoldOut?: boolean
}
