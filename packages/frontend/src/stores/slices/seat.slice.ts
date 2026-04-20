import type { Seat, SeatSection } from "@/types/event.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SeatState {
  seats: Seat[];
  selectedSeats: string[];
  selectedSection: SeatSection | null;
  isLoading: boolean;
  error: string | null;
  lockSuccess: boolean;
}

const initialState: SeatState = {
  seats: [],
  selectedSeats: [],
  selectedSection: null,
  isLoading: false,
  error: null,
  lockSuccess: false,
};

const MAX_SEATS = 4;

const seatsSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    fetchSeatsRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      void _action
    },
    fetchSeatsSuccess: (state, action: PayloadAction<Seat[]>) => {
      state.isLoading = false;
      state.seats = action.payload;
    },
    fetchSeatsFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectSeat: (state, action: PayloadAction<string>) => {
      if (state.selectedSeats.length >= MAX_SEATS) return;
      if (state.selectedSeats.includes(action.payload)) return;
      state.selectedSeats.push(action.payload);
    },
    selectSection(state, action: PayloadAction<SeatSection | null>) {
      state.selectedSection = action.payload;
      state.selectedSeats = []; // reset khi đổi section
    },
    deselectSeat: (state, action: PayloadAction<string>) => {
      state.selectedSeats = state.selectedSeats.filter(
        (id) => id !== action.payload,
      );
    },
    lockSeatRequest(
      state,
      _action: PayloadAction<{
        seatIds: string[];
        eventId: string;
      }>,
    ) {
      state.isLoading = true;
      state.error = null;
      void _action
    },
    lockSeatSuccess: (state, action: PayloadAction<string[]>) => {
      state.isLoading = false;
      state.lockSuccess = true; 
      state.seats = state.seats.map((seat) =>
        action.payload.includes(seat.id)
          ? { ...seat, status: "locked" as const, isLocked: true }
          : seat,
      );
    },
    lockSeatFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    unlockSeatRequest(
      state,
      _action: PayloadAction<{
        seatIds: string[];
        eventId: string;
      }>,
    ) {
      state.isLoading = true;
      state.error = null;
      void _action
    },
    unlockSeatSuccess: (state, action: PayloadAction<string[]>) => {
      state.isLoading = false;
      state.lockSuccess = true; 
      state.seats = state.seats.map((seat) =>
        action.payload.includes(seat.id)
          ? { ...seat, status: "available" as const, isLocked: false }
          : seat,
      );
    },
    unlockSeatFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearSelection(state) {
      state.selectedSeats = [];
      state.error = null;
    },
    clearSeats(state) {
      state.selectedSeats = [];
      state.seats = [];
      state.error = null;
    },
    resetLockSuccess(state) {
      state.lockSuccess = false;
    },
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
  clearSelection,
  resetLockSuccess,
  unlockSeatFailed,
  unlockSeatRequest,
  unlockSeatSuccess
} = seatsSlice.actions;
export default seatsSlice.reducer;
