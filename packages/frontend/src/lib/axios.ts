import axios from 'axios'
import { store } from '../stores'
import { refreshTokenFailed, refreshTokenSuccess } from '../stores/slices/auth.slice'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }
    if (originalRequest.url === '/auth/refresh') {
      store.dispatch(refreshTokenFailed())
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = store.getState().auth.refreshToken

      const response = await axiosInstance.post('/auth/refresh', { refreshToken })
      
      const { accessToken, refreshToken: newRefreshToken } = response.data.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      store.dispatch(refreshTokenSuccess({
        accessToken,
        refreshToken: newRefreshToken,
      }))

      processQueue(null, accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return axiosInstance(originalRequest)

    } catch (err) {
      processQueue(err, null)
      store.dispatch(refreshTokenFailed())
      return Promise.reject(err)

    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance