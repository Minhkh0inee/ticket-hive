export interface EventCategory {
  id: string,
  name: string,
  slug: string
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  SOLD_OUT = 'sold_out',
  ONGOING = 'ongoing',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

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
  status?: EventStatus
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


export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface BookingUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface BookingEvent {
  id: string
  title: string
  venue: string
  city: string
  eventDate: string
  bannerUrl: string | null
}

export interface Booking {
  id: string
  seatIds: string[]
  attendeeName: string
  attendeeEmail: string
  attendeePhone: string
  totalPrice: string
  status: BookingStatus
  user: BookingUser
  event: BookingEvent
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateBookingDto {
  eventId: string
  seatIds: string[]
  attendeeName: string
  attendeeEmail: string
  attendeePhone?: string
}

export interface Category {
  id: string
  label: string
  icon: string
}

export interface CreateEventDto {
  title: string
  description: string
  eventDate: string
  venue: string
  city: string
  basePrice: number
  totalSeats: number
  tag?: string
  categoryId: string
  imageUrl?: string
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: EventStatus
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface AdminPaymentBooking {
  id: string
  attendeeName: string
  attendeeEmail: string
  user: { id: string; firstName: string; lastName: string; email: string }
  event: { id: string; title: string }
}

export interface AdminPayment {
  id: string
  orderCode: number
  amount: string
  status: PaymentStatus
  paymentLinkId: string | null
  checkoutUrl: string | null
  createdAt: string
  updatedAt: string
  booking: AdminPaymentBooking
}