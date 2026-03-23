import { all } from 'redux-saga/effects'
import { authWatcher } from './auth.saga'
import { eventsWatcher } from './event.saga'
import { homeWatcher } from './home.saga'

export function* rootSaga() {
  yield all([
    authWatcher(),
    eventsWatcher(),
    homeWatcher(),
  ])
}