import { call, put, takeLatest } from 'redux-saga/effects'
import { loginRequest, loginSuccess, loginFailed, registerRequest, registerFailed, fetchProfileSuccess, refreshTokenFailed, fetchProfileRequest } from '../slices/auth.slice'
import  { type AxiosResponse } from 'axios'
import axiosInstance from '../../lib/axios'

function* loginWorker(action: ReturnType<typeof loginRequest>): Generator {
  try {
    const authResponse = (yield call(
      axiosInstance.post,
      '/auth/login',
      action.payload
    )) as AxiosResponse

    const { accessToken, refreshToken } = authResponse.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    const profileResponse = (yield call(
      axiosInstance.get,
      '/auth/profile'
    )) as AxiosResponse

    yield put(loginSuccess({
      user: profileResponse.data.data,
      accessToken,
      refreshToken,
    }))
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(loginFailed(error.response?.data?.message ?? 'Login failed'))
  }
}

function* registerWorker(action: ReturnType<typeof registerRequest>): Generator {
  try {
    const authResponse = (yield call(
      axiosInstance.post,
      '/auth/register',
      action.payload
    )) as AxiosResponse

    const { accessToken, refreshToken } = authResponse.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    yield put(loginRequest({
      email: action.payload.email,
      password: action.payload.password,
    }))

  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    yield put(registerFailed(error.response?.data?.message ?? 'Register failed'))
  }
}

function* fetchProfileWorker() {
  try {
    const response = (yield call(
      () => axiosInstance.get('/auth/profile')
    )) as AxiosResponse

    yield put(fetchProfileSuccess(response.data.data))
  } catch {
    yield put(refreshTokenFailed()) 
  }
}

export function* authWatcher() {
  yield takeLatest(loginRequest.type, loginWorker)
  yield takeLatest(registerRequest.type, registerWorker)
  yield takeLatest(fetchProfileRequest.type, fetchProfileWorker)
}