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
  basePrice: string
}

export interface TicketType {
  id: string
  name: string
  price: string
  description?: string
  available: boolean
}

export interface EventOrganizer {
  name: string
  logoUrl: string | null
  description: string
}

export interface EventDetail {
  eventId: string
  endDate?: string
  venueAddress?: string
  galleryImages: string[]
  fullDescription: string
  ticketTypes: TicketType[]
  organizer: EventOrganizer
  isSoldOut?: boolean
}
