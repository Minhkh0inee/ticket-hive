import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Event, CreateEventDto, UpdateEventDto } from '@/types/event.types'
import type { FetchAdminEventsParams } from '@/services/admin.service'

interface AdminState {
  events: Event[]
  total: number
  isLoading: boolean
  error: string | null
  selectedEvent: Event | null
  isSubmitting: boolean
  submitError: string | null
}

const initialState: AdminState = {
  events: [],
  total: 0,
  isLoading: false,
  error: null,
  selectedEvent: null,
  isSubmitting: false,
  submitError: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchAdminEventsRequest(state, _action: PayloadAction<FetchAdminEventsParams | undefined>) {
      state.isLoading = true
      state.error = null
      void _action
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
} = adminSlice.actions

export default adminSlice.reducer
