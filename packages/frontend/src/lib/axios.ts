import axios from 'axios'
import { store } from '../stores'
import { refreshTokenFailed, refreshTokenSuccess } from '../stores/slices/auth.slice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

// Request interceptor — tự gắn token vào mọi request
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) return Promise.reject(error)
      isRefreshing = true

      try {
        const refreshToken = store.getState().auth.refreshToken

        const response = await axiosInstance.post('/auth/refresh', { refreshToken })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        store.dispatch(refreshTokenSuccess({
          accessToken,
          refreshToken: newRefreshToken,
        }))

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)

      } catch (err) {
        store.dispatch(refreshTokenFailed())
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance