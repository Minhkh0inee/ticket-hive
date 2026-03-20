import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type SeatSection = 'floor' | 'balcony' | 'vip' | 'general'

type SeatStatus = 'available' | 'locked' | 'booked'

interface Seat {
    id: string;
    row: string;
    label: string
    section: SeatSection;
    status: SeatStatus;
    priceModifier: number
}

interface SeatState {
  seats: Seat[]
  selectedSeats: string[]  
  isLoading: boolean
  error: string | null
}

const initialState: SeatState = {
    seats: [],
  selectedSeats: [],  
  isLoading: false,
  error: null
}


const seatsSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    fetchSeatsRequest: (state) => {
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
    state.selectedSeats.push(action.payload)  
    },
    deselectSeat: (state, action: PayloadAction<string>) => {
    state.selectedSeats = state.selectedSeats.filter(id => id !== action.payload)
    },
    lockSeatRequest: (state, action: PayloadAction<string[]>) => {
    state.isLoading = true
    state.error = null
    },
    lockSeatSuccess: (state) => {
    state.isLoading = false
    state.seats = state.seats.map(seat =>
        state.selectedSeats.includes(seat.id)
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
