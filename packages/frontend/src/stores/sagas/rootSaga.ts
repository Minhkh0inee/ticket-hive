import { all } from 'redux-saga/effects'
import { authWatcher } from './auth.saga'
import { eventsWatcher } from './event.saga'
import { homeWatcher } from './home.saga'
import { seatsWatcher } from './seat.sage'
import { bookingWatcher } from './booking.saga'
import { catetgoriesWatcher } from './category.sage'

export function* rootSaga() {
  yield all([
    authWatcher(),
    eventsWatcher(),
    homeWatcher(),
    seatsWatcher(),
    bookingWatcher(),
    catetgoriesWatcher()
  ])
}