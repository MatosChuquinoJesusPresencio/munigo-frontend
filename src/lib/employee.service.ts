import { apiRequest } from './api'
import type { CaseFile } from '../types/procedure'
import type { AttachedDocument } from '../types/procedure'

export interface ValidateDocumentRequest {
  validation_status: 'APROBADO' | 'OBSERVADO'
  observations?: string
}

export interface AssignInspectorRequest {
  inspector_id: number
  scheduled_date: string
  start_time: string
  end_time: string
}

export interface EmployeeUser {
  id: number
  position: string
  area: string
  first_name: string
  last_name: string
}

export const employeeService = {
  async getPendingReview(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/pending-review/')
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

  async approveDocuments(caseFileId: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/approve-documents/`, {
      method: 'POST',
    })
  },

  async assignInspector(caseFileId: number, data: AssignInspectorRequest): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/assign-inspector/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async setCaseFileStatus(caseFileId: number, caseStatus: string): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${caseFileId}/set-status/`, {
      method: 'POST',
      body: JSON.stringify({ status: caseStatus }),
    })
  },

  async getInspectors(): Promise<EmployeeUser[]> {
    return apiRequest<EmployeeUser[]>('/auth/employees/?position=INSPECTOR')
  },
}
