import { call, put, takeLatest } from 'redux-saga/effects'
import { type AxiosResponse } from 'axios'
import {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailed,
  fetchBookingsRequest,
  fetchBookingsSuccess,
  fetchBookingsFailed,
  fetchBookingDetailSuccess,
  fetchBookingDetailFailed,
  fetchBookingDetailRequest,
} from '../slices/booking.slice'
import axiosInstance from '../../lib/axios'

function* createBookingWorker(action: ReturnType<typeof createBookingRequest>) {
  try {
    const response = (yield call(
      () => axiosInstance.post('/bookings', action.payload)
    )) as AxiosResponse

    yield put(createBookingSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(createBookingFailed(error.response?.data?.message ?? 'Failed to create booking'))
  }
}

function* fetchBookingsWorker() {
  try {
    const response = (yield call(
      () => axiosInstance.get('/bookings/my')
    )) as AxiosResponse

    yield put(fetchBookingsSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(fetchBookingsFailed(error.response?.data?.message ?? 'Failed to fetch bookings'))
  }
}

function* fetchBookingDetailWorker(action: ReturnType<typeof fetchBookingDetailRequest>) {
  try {
    const response = (yield call(
      () => axiosInstance.get(`/bookings/${action.payload}`)
    )) as AxiosResponse

    yield put(fetchBookingDetailSuccess(response.data.data))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(fetchBookingDetailFailed(error.response?.data?.message ?? 'Failed to fetch bookings'))
  }
}

export function* bookingWatcher() {
  yield takeLatest(createBookingRequest.type, createBookingWorker)
  yield takeLatest(fetchBookingsRequest.type, fetchBookingsWorker)
  yield takeLatest(fetchBookingDetailRequest.type, fetchBookingDetailWorker)

}