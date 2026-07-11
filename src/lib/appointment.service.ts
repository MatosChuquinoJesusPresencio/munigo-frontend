import { apiRequest } from './api'
import type { Appointment } from '../types/appointment'

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    return apiRequest<Appointment[]>('/procedures/appointments/')
  },

  async getById(id: number): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/`)
  },
}
