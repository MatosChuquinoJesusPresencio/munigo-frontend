import { apiRequest } from './api'
import type { Requirement } from '../types/procedure'

export interface RequirementCreateRequest {
  name: string
  description: string
  allowed_formats: string[]
  is_required: boolean
  procedure_type: string
}

export interface RequirementUpdateRequest {
  name?: string
  description?: string
  allowed_formats?: string[]
  is_required?: boolean
  procedure_type?: string
}

export const requirementService = {
  async getAll(procedureType?: string): Promise<Requirement[]> {
    const params = procedureType ? `?procedure_type=${procedureType}` : ''
    return apiRequest<Requirement[]>(`/procedures/requirements/${params}`)
  },

  async getById(id: number): Promise<Requirement> {
    return apiRequest<Requirement>(`/procedures/requirements/${id}/`)
  },

  async create(data: RequirementCreateRequest): Promise<Requirement> {
    return apiRequest<Requirement>('/procedures/requirements/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: number, data: RequirementUpdateRequest): Promise<Requirement> {
    return apiRequest<Requirement>(`/procedures/requirements/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async delete(id: number): Promise<void> {
    return apiRequest<void>(`/procedures/requirements/${id}/`, {
      method: 'DELETE',
    })
  },
}
