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
  basePrice: string
}

interface EventState {
  events: Event[]
  selectedEvent: Event | null
  isLoading: boolean
  error: string | null
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    fetchEventsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action: PayloadAction<Event[]>) => {
    state.isLoading = false
    state.events = action.payload
    },
    fetchEventsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    fetchEventDetailRequest: (state, action: PayloadAction<string>) => {
    state.isLoading = true
    state.error = null
    },
    fetchEventDetailSuccess: (
      state,
      action: PayloadAction<{selectedEvent: Event }>,
    ) => {
      state.isLoading = false;
      state.error = null;
      state.selectedEvent = action.payload.selectedEvent;
    },
    fetchEventDetailFailed: (
      state,
      action: PayloadAction<string >,
    ) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearSelectedEvent: (state) => {
    state.selectedEvent = null
    state.error = null
    }
  },
});

export const { fetchEventsRequest, fetchEventsSuccess, fetchEventsFailed, fetchEventDetailRequest, fetchEventDetailSuccess, fetchEventDetailFailed, clearSelectedEvent } = eventSlice.actions
export default eventSlice.reducer
