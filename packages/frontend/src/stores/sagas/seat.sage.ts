import { call, put, takeLatest } from "redux-saga/effects"
import { fetchSeatsFailed, fetchSeatsRequest, fetchSeatsSuccess } from "../slices/seat.slice"
import axiosInstance from "@/lib/axios"
import type { AxiosResponse } from "axios"

function* fetchEventSeatsWorker(action: ReturnType<typeof fetchSeatsRequest>) {
  try {
    const response = (yield call(
      () => axiosInstance.get(`/events/${action.payload}/seats`)
    )) as AxiosResponse

    yield put(fetchSeatsSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(fetchSeatsFailed(error.response?.data?.message ?? 'Failed to fetch event'))
  }
}

export function* seatsWatcher() {
  yield takeLatest(fetchSeatsRequest.type, fetchEventSeatsWorker)

}