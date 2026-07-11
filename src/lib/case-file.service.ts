import { apiRequest, apiUpload } from './api'
import type { CaseFile, CreateCaseFileRequest, UpdateCaseFileRequest, Requirement, ProcedureRequirement } from '../types/procedure'

export const caseFileService = {
  async getAll(): Promise<CaseFile[]> {
    return apiRequest<CaseFile[]>('/procedures/case-files/')
  },

  async getById(id: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${id}/`)
  },

  async create(data: CreateCaseFileRequest): Promise<CaseFile> {
    return apiRequest<CaseFile>('/procedures/case-files/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: number, data: UpdateCaseFileRequest): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async remove(id: number): Promise<void> {
    return apiRequest<void>(`/procedures/case-files/${id}/`, {
      method: 'DELETE',
    })
  },

  async getRequirements(procedureType: string): Promise<Requirement[]> {
    return apiRequest<Requirement[]>(`/procedures/requirements/?procedure_type=${procedureType}`)
  },

  async getCaseFileRequirements(caseFileId: number): Promise<ProcedureRequirement[]> {
    return apiRequest<ProcedureRequirement[]>(`/procedures/procedure-requirements/?case_file=${caseFileId}`)
  },

  async uploadDocument(procedureRequirementId: number, file: File, name: string): Promise<void> {
    const formData = new FormData()
    formData.append('procedure_requirement', String(procedureRequirementId))
    formData.append('name', name)
    formData.append('file', file)
    return apiUpload<void>('/procedures/attached-documents/', formData)
  },

  async deleteDocument(docId: number): Promise<void> {
    return apiRequest<void>(`/procedures/attached-documents/${docId}/`, { method: 'DELETE' })
  },
}
