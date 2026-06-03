import { call, put, select, takeLatest } from 'redux-saga/effects'
import { type AxiosResponse } from 'axios'
import { toast } from 'sonner'
import {
  fetchAdminEventsRequest,
  fetchAdminEventsSuccess,
  fetchAdminEventsFailed,
  createEventRequest,
  createEventSuccess,
  createEventFailed,
  updateEventRequest,
  updateEventSuccess,
  updateEventFailed,
  deleteEventRequest,
  deleteEventSuccess,
  deleteEventFailed,
  fetchAdminBookingsRequest,
  fetchAdminBookingsSuccess,
  fetchAdminBookingsFailed,
  fetchAdminUsersRequest,
  fetchAdminUsersSuccess,
  fetchAdminUsersFailed,
} from '../slices/admin.slice'
import adminService, { type FetchAdminEventsParams } from '@/services/admin.service'
import type { RootState } from '../rootReducer'

function* fetchAdminEventsWorker(
  action: ReturnType<typeof fetchAdminEventsRequest>,
): Generator {
  try {
    const response = (yield call(
      () => adminService.fetchEvents(action.payload),
    )) as AxiosResponse
    const { data, total } = response.data.data
    yield put(fetchAdminEventsSuccess({ data, total }))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(
      fetchAdminEventsFailed(error.response?.data?.message ?? 'Failed to fetch events'),
    )
  }
}

function* createEventWorker(
  action: ReturnType<typeof createEventRequest>,
): Generator {
  try {
    const dto = {
      ...action.payload,
      eventDate: new Date(action.payload.eventDate).toISOString(),
    }
    const response = (yield call(
      () => adminService.createEvent(dto),
    )) as AxiosResponse
    yield put(createEventSuccess(response.data.data))
    toast.success('Event created successfully')
    const params = (yield select((s: RootState) => s.admin.currentParams)) as FetchAdminEventsParams
    yield put(fetchAdminEventsRequest(params))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const msg = error.response?.data?.message ?? 'Failed to create event'
    yield put(createEventFailed(msg))
    toast.error(msg)
  }
}

function* updateEventWorker(
  action: ReturnType<typeof updateEventRequest>,
): Generator {
  try {
    const dto = {
      ...action.payload.dto,
      ...(action.payload.dto.eventDate
        ? { eventDate: new Date(action.payload.dto.eventDate).toISOString() }
        : {}),
    }
    const response = (yield call(
      () => adminService.updateEvent(action.payload.id, dto),
    )) as AxiosResponse
    yield put(updateEventSuccess(response.data.data))
    toast.success('Event updated successfully')
    const params = (yield select((s: RootState) => s.admin.currentParams)) as FetchAdminEventsParams
    yield put(fetchAdminEventsRequest(params))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const msg = error.response?.data?.message ?? 'Failed to update event'
    yield put(updateEventFailed(msg))
    toast.error(msg)
  }
}

function* deleteEventWorker(
  action: ReturnType<typeof deleteEventRequest>,
): Generator {
  try {
    yield call(() => adminService.deleteEvent(action.payload))
    yield put(deleteEventSuccess(action.payload))
    toast.success('Event deleted')
    const params = (yield select((s: RootState) => s.admin.currentParams)) as FetchAdminEventsParams
    yield put(fetchAdminEventsRequest(params))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const msg = error.response?.data?.message ?? 'Failed to delete event'
    yield put(deleteEventFailed(msg))
    toast.error(msg)
  }
}

function* fetchAdminBookingsWorker(
  action: ReturnType<typeof fetchAdminBookingsRequest>,
): Generator {
  try {
    const response = (yield call(
      () => adminService.fetchBookings(action.payload),
    )) as AxiosResponse
    const { data, total } = response.data.data
    yield put(fetchAdminBookingsSuccess({ data, total }))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(
      fetchAdminBookingsFailed(error.response?.data?.message ?? 'Failed to fetch bookings'),
    )
  }
}

function* fetchAdminUsersWorker(
  action: ReturnType<typeof fetchAdminUsersRequest>,
): Generator {
  try {
    const response = (yield call(
      () => adminService.fetchUsers(action.payload),
    )) as AxiosResponse
    const { data, total } = response.data.data
    yield put(fetchAdminUsersSuccess({ data, total }))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(
      fetchAdminUsersFailed(error.response?.data?.message ?? 'Failed to fetch users'),
    )
  }
}

export function* adminWatcher() {
  yield takeLatest(fetchAdminEventsRequest.type, fetchAdminEventsWorker)
  yield takeLatest(createEventRequest.type, createEventWorker)
  yield takeLatest(updateEventRequest.type, updateEventWorker)
  yield takeLatest(deleteEventRequest.type, deleteEventWorker)
  yield takeLatest(fetchAdminBookingsRequest.type, fetchAdminBookingsWorker)
  yield takeLatest(fetchAdminUsersRequest.type, fetchAdminUsersWorker)
}
