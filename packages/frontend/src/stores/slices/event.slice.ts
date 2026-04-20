import type { Event } from "@/types/event.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


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

  searchResults: Event[]
  searchLoading: boolean
  searchError: string | null
  searchQuery: string
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

  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchQuery: '',
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
    void _action
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
    fetchEventDetailRequest: (state, _action: PayloadAction<string>) => {
      state.detailLoading = true
      state.detailError = null
      state.currentEvent = null
      void _action
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
    },
    searchEventsRequest(state, action: PayloadAction<string>) {
    state.searchLoading = true
    state.searchError = null
    state.searchQuery = action.payload
    },
    searchEventsSuccess(state, action: PayloadAction<Event[]>) {
      state.searchLoading = false
      state.searchResults = action.payload
    },
    searchEventsFailed(state, action: PayloadAction<string>) {
      state.searchLoading = false
      state.searchError = action.payload
    },
    clearSearch(state) {
      state.searchResults = []
      state.searchQuery = ''
      state.searchError = null
    },
  },
});

export const { fetchEventsRequest, fetchEventsSuccess, fetchEventsFailed, fetchEventDetailRequest, fetchEventDetailSuccess, fetchEventDetailFailed, clearCurrentEvent, searchEventsFailed, searchEventsRequest, searchEventsSuccess, clearSearch } = eventSlice.actions
export default eventSlice.reducer
