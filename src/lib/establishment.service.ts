import type {
  Establishment,
  CreateEstablishmentRequest,
  UpdateEstablishmentRequest,
} from '../types/organization'
import { apiRequest } from './api'

export async function createEstablishment(
  data: CreateEstablishmentRequest,
): Promise<Establishment> {
  return apiRequest<Establishment>('/organizations/establishments/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEstablishment(
  id: number,
  data: UpdateEstablishmentRequest,
): Promise<Establishment> {
  return apiRequest<Establishment>(`/organizations/establishments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteEstablishment(id: number): Promise<void> {
  return apiRequest<void>(`/organizations/establishments/${id}/`, {
    method: 'DELETE',
  })
}
