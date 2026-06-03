import axiosInstance from '@/lib/axios'
import type { CreateEventDto, UpdateEventDto } from '@/types/event.types'

export interface FetchAdminEventsParams {
  offset?: number
  limit?: number
}

export interface FetchAdminBookingsParams {
  offset?: number
  limit?: number
  status?: string
}

export interface FetchAdminUsersParams {
  offset?: number
  limit?: number
}

const adminService = {
  fetchEvents: (params?: FetchAdminEventsParams) =>
    axiosInstance.get('/events', { params }),

  createEvent: (dto: CreateEventDto) =>
    axiosInstance.post('/events', dto),

  updateEvent: (id: string, dto: UpdateEventDto) =>
    axiosInstance.patch(`/events/${id}`, dto),

  deleteEvent: (id: string) =>
    axiosInstance.delete(`/events/${id}`),

  fetchBookings: (params?: FetchAdminBookingsParams) =>
    axiosInstance.get('/bookings', { params }),

  fetchUsers: (params?: FetchAdminUsersParams) =>
    axiosInstance.get('/users', { params }),
}

export default adminService
