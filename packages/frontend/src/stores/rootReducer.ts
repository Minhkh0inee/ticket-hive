// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import eventReducer from './slices/event.slice'
import homeReducer from './slices/home.slice'
import seatReducer from './slices/seat.slice'
import bookingReducer from './slices/booking.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  event: eventReducer,
  home: homeReducer,
  seat: seatReducer,
  booking: bookingReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer