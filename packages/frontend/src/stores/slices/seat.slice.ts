import type { Seat, SeatSection } from "@/types/event.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";




interface SeatState {
  seats: Seat[]
  selectedSeats: string[]  
  selectedSection: SeatSection | null
  isLoading: boolean
  error: string | null
}

const initialState: SeatState = {
  seats: [],
  selectedSeats: [],  
  selectedSection: null,
  isLoading: false,
  error: null
}

const MAX_SEATS = 4

const seatsSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    fetchSeatsRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSeatsSuccess: (state, action: PayloadAction<Seat[]>) => {
    state.isLoading = false
    state.seats = action.payload
    },
    fetchSeatsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    selectSeat: (state, action: PayloadAction<string>) => {
      if (state.selectedSeats.length >= MAX_SEATS) return
      if (state.selectedSeats.includes(action.payload)) return
      state.selectedSeats.push(action.payload)
    },
    selectSection(state, action: PayloadAction<SeatSection | null>) {
      state.selectedSection = action.payload
      state.selectedSeats = []  // reset khi đổi section
    },
    deselectSeat: (state, action: PayloadAction<string>) => {
    state.selectedSeats = state.selectedSeats.filter(id => id !== action.payload)
    },
    lockSeatRequest: (state, action: PayloadAction<string[]>) => {
    state.isLoading = true
    state.error = null
    },
    lockSeatSuccess: (state, action: PayloadAction<string[]>) => {
      state.isLoading = false
      state.seats = state.seats.map(seat =>
        action.payload.includes(seat.id)
        ? { ...seat, status: 'locked' as const }
        : seat
      )
      state.selectedSeats = []
    },
lockSeatFailed: (state, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload  
},
    clearSeats: (state) => {
    state.selectedSeats = []
    state.error = null
    }
  },
});

export const {
  fetchSeatsRequest,
  fetchSeatsSuccess,
  fetchSeatsFailed,
  selectSeat,
  deselectSeat,
  lockSeatRequest,
  lockSeatSuccess,
  lockSeatFailed,
  clearSeats,
} = seatsSlice.actions
export default seatsSlice.reducer
