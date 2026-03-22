import { all } from 'redux-saga/effects'
import { authWatcher } from './auth.saga'
import { eventsWatcher } from './event.saga'

export function* rootSaga() {
  yield all([
    authWatcher(),
    eventsWatcher()
  ])
}