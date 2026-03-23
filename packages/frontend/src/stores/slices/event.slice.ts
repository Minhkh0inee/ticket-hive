import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type EventCategory = 'music' | 'sports' | 'theatre' | 'festival' | 'conference'

interface Event {
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
}

interface EventState {
  events: Event[]
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    offset: number
    limit: number
    totalPages: number
  }

  currentEvent: Event | null
  detailLoading: boolean
  detailError: string | null
}

const initialState: EventState = {
  events: [],
  isLoading: false,
  error: null,
  pagination:{
    limit: 0,
    offset: 0,
    total: 0,
    totalPages: 0
  },
  currentEvent: null,
  detailLoading: false,
  detailError: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
  fetchEventsRequest(state, _action: PayloadAction<{
    offset?: number
    limit?: number
    category?: string
    city?: string
    search?: string
    tags?: string[]
    dateFilter?: 'this_week' | 'this_month'
    ignoreIds?: string[]
  } | undefined>) {
    state.isLoading = true
    state.error = null
  },
  fetchEventsSuccess(state, action: PayloadAction<{
    data: Event[]
    total: number
    offset: number
    limit: number
    totalPages: number
  }>) {
    state.isLoading = false
    state.events = action.payload.data
    state.pagination = {
      total: action.payload.total,
      offset: action.payload.offset,
      limit: action.payload.limit,
      totalPages: action.payload.totalPages,
    }
  },
    fetchEventsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchEventDetailRequest: (state, action: PayloadAction<string>) => {
      state.detailLoading = true
      state.detailError = null
      state.currentEvent = null
    },
    fetchEventDetailSuccess: (
      state,
      action: PayloadAction<Event>,
    ) => {
      state.detailLoading = false
      state.currentEvent = action.payload
    },
    fetchEventDetailFailed: (
      state,
      action: PayloadAction<string >,
    ) => {
      state.detailLoading = false
      state.detailError = action.payload
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null
      state.detailError = null
    }
  },
});

export const { fetchEventsRequest, fetchEventsSuccess, fetchEventsFailed, fetchEventDetailRequest, fetchEventDetailSuccess, fetchEventDetailFailed, clearCurrentEvent } = eventSlice.actions
export default eventSlice.reducer
