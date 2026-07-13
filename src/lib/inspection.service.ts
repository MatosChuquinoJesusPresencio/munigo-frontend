import { apiRequest } from './api'
import type { CaseFile } from '../types/procedure'

export interface CompleteInspectionRequest {
  result: 'APROBADO' | 'NO_APROBADO'
  comments?: string
  photo_urls?: string[]
}

export const inspectionService = {
  async getMyInspections(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/my-inspections/')
  },

  async getInspectionHistory(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/inspection-history/')
  },

  async getCaseFileDetail(id: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${id}/`)
  },

  async completeInspection(caseFileId: number, data: CompleteInspectionRequest): Promise<{ detail: string }> {
    return apiRequest<{ detail: string }>(`/procedures/case-files/${caseFileId}/complete-inspection/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
