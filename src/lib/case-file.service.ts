import { apiRequest, API_BASE, getAccessToken } from './api'
import { supabase } from './supabase'
import type { CaseFile, CreateCaseFileRequest, UpdateCaseFileRequest, Requirement, ProcedureRequirement } from '../types/procedure'

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg']
const MAX_SIZE = 20 * 1024 * 1024

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
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Formato no permitido. Use PDF, PNG o JPEG.')
    }
    if (file.size > MAX_SIZE) {
      throw new Error('El archivo excede el limite de 20 MB.')
    }

    const path = `documents/${procedureRequirementId}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) throw new Error(uploadError.message)

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)

    return apiRequest<void>('/procedures/attached-documents/', {
      method: 'POST',
      body: JSON.stringify({
        procedure_requirement: procedureRequirementId,
        name,
        file: urlData.publicUrl,
      }),
    })
  },

  async deleteDocument(docId: number): Promise<void> {
    return apiRequest<void>(`/procedures/attached-documents/${docId}/`, { method: 'DELETE' })
  },

  async submit(id: number): Promise<CaseFile> {
    return apiRequest<CaseFile>(`/procedures/case-files/${id}/submit/`, {
      method: 'POST',
    })
  },

  async downloadLicense(id: number, trackingCode: string): Promise<void> {
    const url = `${API_BASE}/procedures/case-files/${id}/download-license/`
    const token = getAccessToken()
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(url, { headers })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.detail || 'Error al descargar la licencia.')
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `licencia_${trackingCode}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(blobUrl)
    a.remove()
  },
}
