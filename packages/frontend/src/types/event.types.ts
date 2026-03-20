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
