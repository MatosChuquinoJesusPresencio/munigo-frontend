import { apiRequest } from './api'
import type { Appointment } from '../types/appointment'

export interface AvailableSlots {
  date: string
  inspector_id: number
  booked_slots: { start: string; end: string }[]
}

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    return apiRequest<Appointment[]>('/procedures/appointments/')
  },

  async getById(id: number): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/`)
  },

  async confirm(id: number): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/confirm/`, {
      method: 'POST',
    })
  },

  async cancel(id: number, reason: string): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/cancel/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  },

  async reschedule(id: number, data: {
    new_date: string
    new_start_time: string
    new_end_time: string
    reason: string
  }): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/reschedule/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async respondReschedule(id: number, data: {
    accept: boolean
    new_date?: string
    new_start_time?: string
    new_end_time?: string
  }): Promise<Appointment> {
    return apiRequest<Appointment>(`/procedures/appointments/${id}/respond-reschedule/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getAvailableSlots(inspectorId: number, date: string): Promise<AvailableSlots> {
    return apiRequest<AvailableSlots>(
      `/procedures/appointments/available-slots/?inspector_id=${inspectorId}&date=${date}`
    )
  },

  async getCalendar(params: {
    start?: string
    end?: string
    inspector_id?: number
  }): Promise<Appointment[]> {
    const query = new URLSearchParams()
    if (params.start) query.set('start', params.start)
    if (params.end) query.set('end', params.end)
    if (params.inspector_id) query.set('inspector_id', String(params.inspector_id))
    return apiRequest<Appointment[]>(`/procedures/appointments/calendar/?${query.toString()}`)
  },
}
