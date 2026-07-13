import { apiRequest } from './api'
import type { CaseFile } from '../types/procedure'
import type { AttachedDocument } from '../types/procedure'

export interface ValidateDocumentRequest {
  validation_status: 'APROBADO' | 'OBSERVADO'
  observations?: string
}

export interface EmployeeUser {
  id: number
  position: string
  area: string
  first_name: string
  last_name: string
  email?: string
}

export interface EmployeeCreateRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  document_type: string
  document_number: string
  position: string
  area: string
}

export interface EmployeeUpdateRequest {
  position: string
  area: string
}

export const employeeService = {
  async getPendingReview(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/pending-review/')
  },

  async getHistory(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/history/')
  },

  async getCaseFileDetail(id: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${id}/`)
  },

  async validateDocument(docId: number, data: ValidateDocumentRequest): Promise<AttachedDocument> {
    return apiRequest<AttachedDocument>(`/procedures/attached-documents/${docId}/validate/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async setCaseFileStatus(caseFileId: number, caseStatus: string): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/set-status/`, {
      method: 'POST',
      body: JSON.stringify({ status: caseStatus }),
    })
  },

  async approveDocuments(caseFileId: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/approve-documents/`, {
      method: 'POST',
    })
  },

  async assignInspector(caseFileId: number, data: {
    inspector_id: number
    scheduled_date: string
    start_time: string
    end_time: string
  }): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/assign-inspector/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getInspectors(): Promise<EmployeeUser[]> {
    return apiRequest<EmployeeUser[]>('/auth/employees/?position=INSPECTOR')
  },

  async getAllEmployees(): Promise<EmployeeUser[]> {
    return apiRequest<EmployeeUser[]>('/auth/employees/')
  },

  async createEmployee(data: EmployeeCreateRequest): Promise<EmployeeUser> {
    return apiRequest<EmployeeUser>('/auth/employees/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateEmployee(id: number, data: EmployeeUpdateRequest): Promise<EmployeeUser> {
    return apiRequest<EmployeeUser>(`/auth/employees/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async deleteEmployee(id: number): Promise<void> {
    return apiRequest<void>(`/auth/employees/${id}/`, {
      method: 'DELETE',
    })
  },

  async getDashboard(): Promise<{ total: number; by_status: Record<string, number>; by_procedure_type: Record<string, number> }> {
    return apiRequest('/procedures/case-files/dashboard/')
  },
}
