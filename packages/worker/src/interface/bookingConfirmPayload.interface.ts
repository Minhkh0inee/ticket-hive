export default interface BookingConfirmedPayload {
    bookingId: string;
    userId: string;
    eventId: string;
    seatIds: string[];
    attendeeEmail: string;
    attendeeName: string;
    totalPrice: number;
  }
  