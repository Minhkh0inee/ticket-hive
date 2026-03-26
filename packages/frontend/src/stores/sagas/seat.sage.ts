import { call, put, takeLatest } from "redux-saga/effects"
import { toast } from "sonner"
import { fetchSeatsFailed, fetchSeatsRequest, fetchSeatsSuccess, lockSeatFailed, lockSeatRequest, lockSeatSuccess, unlockSeatRequest } from "../slices/seat.slice"
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

function* seatLockWorker(action: ReturnType<typeof lockSeatRequest>) {
  try {
    const { seatIds, eventId } = action.payload

    yield call(
      () => Promise.all(
        seatIds.map(seatId =>
          axiosInstance.post(`/seats/${seatId}/lock`, { eventId })
        )
      )
    )

    yield put(lockSeatSuccess(seatIds))
    yield put(fetchSeatsRequest(eventId))
    toast.success('Đặt ghế thành công!')
  } catch (err) {
    const { seatIds, eventId } = action.payload
    yield call(
      () => Promise.allSettled(
        seatIds.map(seatId =>
          axiosInstance.delete(`/seats/${seatId}/lock`, { data: { eventId } })
        )
      )
    )
    const error = err as { response?: { data?: { message?: string } } }
    yield put(lockSeatFailed(error.response?.data?.message ?? 'Failed to lock seats'))
    toast.error(error.response?.data?.message ?? 'Không thể đặt ghế. Vui lòng thử lại.')
  }
}

function* seatUnlockWorker(action: ReturnType<typeof lockSeatRequest>) {
  try {
    const { seatIds, eventId } = action.payload

    yield call(
      () => Promise.all(
        seatIds.map(seatId =>
          axiosInstance.post(`/seats/${seatId}/unlock`, { eventId })
        )
      )
    )

    yield put(lockSeatSuccess(seatIds))
    yield put(fetchSeatsRequest(eventId))
    toast.success('Đã hủy chọn ghế.')
  } catch (err) {
    const { seatIds, eventId } = action.payload
    yield call(
      () => Promise.allSettled(
        seatIds.map(seatId =>
          axiosInstance.delete(`/seats/${seatId}/lock`, { data: { eventId } })
        )
      )
    )
    const error = err as { response?: { data?: { message?: string } } }
    yield put(lockSeatFailed(error.response?.data?.message ?? 'Failed to lock seats'))
    toast.error(error.response?.data?.message ?? 'Không thể hủy ghế. Vui lòng thử lại.')
  }
}

export function* seatsWatcher() {
  yield takeLatest(fetchSeatsRequest.type, fetchEventSeatsWorker)
  yield takeLatest(lockSeatRequest.type, seatLockWorker)
  yield takeLatest(unlockSeatRequest.type, seatUnlockWorker)


}