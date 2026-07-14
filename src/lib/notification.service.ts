import { apiRequest } from './api'
import type { Notification } from '../types/notification'

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return apiRequest<Notification[]>('/notifications/')
  },

  async markAsRead(id: number): Promise<void> {
    return apiRequest<void>(`/notifications/${id}/mark_as_read/`, {
      method: 'POST',
    })
  },

  async markAllAsRead(): Promise<void> {
    return apiRequest<void>('/notifications/mark_all_as_read/', {
      method: 'POST',
    })
  },
}
