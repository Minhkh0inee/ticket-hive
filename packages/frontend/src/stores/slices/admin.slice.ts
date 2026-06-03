import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Event, CreateEventDto, UpdateEventDto, Booking, AdminUser } from '@/types/event.types'
import type {
  FetchAdminEventsParams,
  FetchAdminBookingsParams,
  FetchAdminUsersParams,
} from '@/services/admin.service'

interface AdminState {
  events: Event[]
  total: number
  isLoading: boolean
  error: string | null
  selectedEvent: Event | null
  isSubmitting: boolean
  submitError: string | null
  currentParams: FetchAdminEventsParams

  bookings: Booking[]
  bookingsTotal: number
  bookingsLoading: boolean
  bookingsError: string | null
  selectedBooking: Booking | null
  bookingsCurrentParams: FetchAdminBookingsParams

  users: AdminUser[]
  usersTotal: number
  usersLoading: boolean
  usersError: string | null
  usersCurrentParams: FetchAdminUsersParams
}

const initialState: AdminState = {
  events: [],
  total: 0,
  isLoading: false,
  error: null,
  selectedEvent: null,
  isSubmitting: false,
  submitError: null,
  currentParams: { offset: 0, limit: 10 },

  bookings: [],
  bookingsTotal: 0,
  bookingsLoading: false,
  bookingsError: null,
  selectedBooking: null,
  bookingsCurrentParams: { offset: 0, limit: 10 },

  users: [],
  usersTotal: 0,
  usersLoading: false,
  usersError: null,
  usersCurrentParams: { offset: 0, limit: 10 },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchAdminEventsRequest(state, action: PayloadAction<FetchAdminEventsParams | undefined>) {
      state.isLoading = true
      state.error = null
      if (action.payload) {
        state.currentParams = action.payload
      }
    },
    fetchAdminEventsSuccess(state, action: PayloadAction<{ data: Event[]; total: number }>) {
      state.isLoading = false
      state.events = action.payload.data
      state.total = action.payload.total
    },
    fetchAdminEventsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    createEventRequest(state, _action: PayloadAction<CreateEventDto>) {
      state.isSubmitting = true
      state.submitError = null
      void _action
    },
    createEventSuccess(state, action: PayloadAction<Event>) {
      state.isSubmitting = false
      state.events.unshift(action.payload)
      state.total += 1
    },
    createEventFailed(state, action: PayloadAction<string>) {
      state.isSubmitting = false
      state.submitError = action.payload
    },
    updateEventRequest(
      state,
      _action: PayloadAction<{ id: string; dto: UpdateEventDto }>,
    ) {
      state.isSubmitting = true
      state.submitError = null
      void _action
    },
    updateEventSuccess(state, action: PayloadAction<Event>) {
      state.isSubmitting = false
      state.events = state.events.map((e) =>
        e.id === action.payload.id ? action.payload : e,
      )
    },
    updateEventFailed(state, action: PayloadAction<string>) {
      state.isSubmitting = false
      state.submitError = action.payload
    },
    deleteEventRequest(state, _action: PayloadAction<string>) {
      state.isSubmitting = true
      state.submitError = null
      void _action
    },
    deleteEventSuccess(state, action: PayloadAction<string>) {
      state.isSubmitting = false
      state.events = state.events.filter((e) => e.id !== action.payload)
      state.total = Math.max(0, state.total - 1)
    },
    deleteEventFailed(state, action: PayloadAction<string>) {
      state.isSubmitting = false
      state.submitError = action.payload
    },
    setSelectedEvent(state, action: PayloadAction<Event>) {
      state.selectedEvent = action.payload
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null
    },

    // Bookings
    fetchAdminBookingsRequest(state, action: PayloadAction<FetchAdminBookingsParams | undefined>) {
      state.bookingsLoading = true
      state.bookingsError = null
      if (action.payload) {
        state.bookingsCurrentParams = action.payload
      }
    },
    fetchAdminBookingsSuccess(state, action: PayloadAction<{ data: Booking[]; total: number }>) {
      state.bookingsLoading = false
      state.bookings = action.payload.data
      state.bookingsTotal = action.payload.total
    },
    fetchAdminBookingsFailed(state, action: PayloadAction<string>) {
      state.bookingsLoading = false
      state.bookingsError = action.payload
    },
    setSelectedBooking(state, action: PayloadAction<Booking | null>) {
      state.selectedBooking = action.payload
    },

    // Users
    fetchAdminUsersRequest(state, action: PayloadAction<FetchAdminUsersParams | undefined>) {
      state.usersLoading = true
      state.usersError = null
      if (action.payload) {
        state.usersCurrentParams = action.payload
      }
    },
    fetchAdminUsersSuccess(state, action: PayloadAction<{ data: AdminUser[]; total: number }>) {
      state.usersLoading = false
      state.users = action.payload.data
      state.usersTotal = action.payload.total
    },
    fetchAdminUsersFailed(state, action: PayloadAction<string>) {
      state.usersLoading = false
      state.usersError = action.payload
    },
  },
})

export const {
  fetchAdminEventsRequest,
  fetchAdminEventsSuccess,
  fetchAdminEventsFailed,
  createEventRequest,
  createEventSuccess,
  createEventFailed,
  updateEventRequest,
  updateEventSuccess,
  updateEventFailed,
  deleteEventRequest,
  deleteEventSuccess,
  deleteEventFailed,
  setSelectedEvent,
  clearSelectedEvent,
  fetchAdminBookingsRequest,
  fetchAdminBookingsSuccess,
  fetchAdminBookingsFailed,
  setSelectedBooking,
  fetchAdminUsersRequest,
  fetchAdminUsersSuccess,
  fetchAdminUsersFailed,
} = adminSlice.actions

export default adminSlice.reducer
