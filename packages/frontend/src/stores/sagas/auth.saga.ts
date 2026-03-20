import { call, put, takeLatest } from 'redux-saga/effects'
import { loginRequest, loginSuccess, loginFailed } from '../slices/auth.slice'
import  { type AxiosResponse } from 'axios'
import axiosInstance from '../../lib/axios'

function* loginWorker(action: ReturnType<typeof loginRequest>): Generator {
  try {
    // Bước 1: lấy token
    const authResponse = (yield call(
      axiosInstance.post,
      '/auth/login',
      action.payload
    )) as AxiosResponse

    const { accessToken, refreshToken } = authResponse.data.data
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    const profileResponse = (yield call(
      axiosInstance.get,
      '/auth/profile'
    )) as AxiosResponse

    yield put(loginSuccess({
      user: profileResponse.data,
      accessToken,
      refreshToken,
    }))
  } catch (err: any) {
    yield put(loginFailed(err.response?.data?.message ?? 'Login failed'))
  }
}
export function* authWatcher(): Generator {
  yield takeLatest(loginRequest.type, loginWorker)
}