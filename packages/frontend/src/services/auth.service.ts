import axiosInstance from '../lib/axios'

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface ProfileResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

const authService = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<{ data: AuthResponse }>('/auth/login', payload),

  getProfile: () =>
    axiosInstance.get<ProfileResponse>('/auth/profile'),

  register: (payload: { firstName: string; lastName: string; email: string; password: string }) =>
    axiosInstance.post('/auth/register', payload),

  logout: () =>
    axiosInstance.post('/auth/logout'),
}

export default authService