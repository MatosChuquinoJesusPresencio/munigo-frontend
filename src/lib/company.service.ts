import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
} from '../types/organization'
import { apiRequest } from './api'

export async function getCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>('/organizations/companies/')
}

export async function getCompanyById(id: number): Promise<Company> {
  return apiRequest<Company>(`/organizations/companies/${id}/`)
}

export async function createCompany(
  data: CreateCompanyRequest,
): Promise<Company> {
  return apiRequest<Company>('/organizations/companies/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCompany(
  id: number,
  data: UpdateCompanyRequest,
): Promise<Company> {
  return apiRequest<Company>(`/organizations/companies/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCompany(id: number): Promise<void> {
  return apiRequest<void>(`/organizations/companies/${id}/`, {
    method: 'DELETE',
  })
}
