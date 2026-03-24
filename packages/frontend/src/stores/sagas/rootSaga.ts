import { all } from 'redux-saga/effects'
import { authWatcher } from './auth.saga'
import { eventsWatcher } from './event.saga'
import { homeWatcher } from './home.saga'
import { seatsWatcher } from './seat.sage'

export function* rootSaga() {
  yield all([
    authWatcher(),
    eventsWatcher(),
    homeWatcher(),
    seatsWatcher()
  ])
}