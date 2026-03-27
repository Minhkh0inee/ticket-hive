import { call, put, takeLatest } from "redux-saga/effects"
import { fetchEventDetailFailed, fetchEventDetailRequest, fetchEventDetailSuccess, fetchEventsFailed, fetchEventsRequest, fetchEventsSuccess, searchEventsFailed, searchEventsRequest, searchEventsSuccess } from "../slices/event.slice"
import axiosInstance from "@/lib/axios"
import type { AxiosResponse } from "axios"

function* fetchEventsWorker(action: ReturnType<typeof fetchEventsRequest>) {
  try {
    const { offset = 0, limit = 9, category, city, search, tags, dateFilter, ignoreIds } = action.payload ?? {}

    const params = new URLSearchParams()
    params.append('offset', String(offset))
    params.append('limit', String(limit))
    if (category) params.append('category', category)
    if (city) params.append('city', city)
    if (search) params.append('search', search)
    if (tags) tags.forEach(t => params.append('tag', t))
    if (dateFilter) params.append('dateFilter', dateFilter)
    if (ignoreIds) ignoreIds.forEach(id => params.append('ignoreIds', id))

    const response = (yield call(
      () => axiosInstance.get(`/events?${params.toString()}`)
    )) as AxiosResponse

    yield put(fetchEventsSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(fetchEventsFailed(error.response?.data?.message ?? 'Failed'))
  }
}

function* fetchEventDetailWorker(action: ReturnType<typeof fetchEventDetailRequest>) {
  try {
    const response = (yield call(
      () => axiosInstance.get(`/events/${action.payload}`)
    )) as AxiosResponse

    yield put(fetchEventDetailSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(fetchEventDetailFailed(error.response?.data?.message ?? 'Failed to fetch event'))
  }
}

function* searchEventsWorker(action: ReturnType<typeof searchEventsRequest>) {
  try {
    const query = action.payload.trim()
    if (!query) {
      yield put(searchEventsSuccess([]))
      return
    }

    const response = (yield call(
      () => axiosInstance.get(`/events/search?q=${encodeURIComponent(query)}`)
    )) as AxiosResponse

    const payload = response.data.data
    const results = Array.isArray(payload) ? payload : (payload?.data ?? [])
    yield put(searchEventsSuccess(results))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(searchEventsFailed(error.response?.data?.message ?? 'Search failed'))
  }
}



export function* eventsWatcher() {
  yield takeLatest(fetchEventsRequest.type, fetchEventsWorker)
  yield takeLatest(fetchEventDetailRequest.type, fetchEventDetailWorker)
  yield takeLatest(searchEventsRequest.type, searchEventsWorker)


}