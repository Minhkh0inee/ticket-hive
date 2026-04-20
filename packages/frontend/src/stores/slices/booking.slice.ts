import type { Booking, CreateBookingDto } from '@/types/event.types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface BookingState {
  bookings: Booking[]
  bookingsLoading: boolean
  bookingsError: string | null

  currentBooking: Booking | null
  currentBookingLoading: boolean
  currentBookingError: string | null

  isCreating: boolean
  createError: string | null
  createSuccess: boolean
}

const initialState: BookingState = {
  bookings: [],
  bookingsLoading: false,
  bookingsError: null,

  currentBooking: null,
  currentBookingLoading: false,
  currentBookingError: null,

  isCreating: false,
  createError: null,
  createSuccess: false,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    createBookingRequest(state, _action: PayloadAction<CreateBookingDto>) {
      state.isCreating = true
      state.createError = null
      state.createSuccess = false
      void _action
    },
    createBookingSuccess(state, action: PayloadAction<Booking>) {
      state.isCreating = false
      state.createSuccess = true
      state.currentBooking = action.payload
    },
    createBookingFailed(state, action: PayloadAction<string>) {
      state.isCreating = false
      state.createError = action.payload
    },
    fetchBookingsRequest(state) {
      state.bookingsLoading = true
      state.bookingsError = null
    },
    fetchBookingsSuccess(state, action: PayloadAction<Booking[]>) {
      state.bookingsLoading = false
      state.bookings = action.payload
    },
    fetchBookingsFailed(state, action: PayloadAction<string>) {
      state.bookingsLoading = false
      state.bookingsError = action.payload
    },
    resetCreateBooking(state) {
      state.isCreating = false
      state.createError = null
      state.createSuccess = false
    },
    fetchBookingDetailRequest(state, _action: PayloadAction<string>) {
      state.currentBookingLoading = true
      state.currentBookingError = null
      void _action
    },
    fetchBookingDetailSuccess(state, action: PayloadAction<Booking>) {
      state.currentBookingLoading = false
      state.currentBooking = action.payload
    },
    fetchBookingDetailFailed(state, action: PayloadAction<string>) {
      state.currentBookingLoading = false
      state.currentBookingError = action.payload
    },
    
  },
})

export const {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailed,
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailed,
  resetCreateBooking,
  fetchBookingDetailFailed,
  fetchBookingDetailRequest,
  fetchBookingDetailSuccess
} = bookingSlice.actions
export default bookingSlice.reducer