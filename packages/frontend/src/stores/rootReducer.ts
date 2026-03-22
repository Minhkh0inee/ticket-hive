// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice'
import eventReducer from './slices/event.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  event: eventReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer