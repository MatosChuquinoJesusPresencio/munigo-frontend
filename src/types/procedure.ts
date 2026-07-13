export const ProcedureType = {
  LICENCIA: 'LICENCIA_DE_FUNCIONAMIENTO',
  ITSE: 'ITSE',
} as const

export type ProcedureType = (typeof ProcedureType)[keyof typeof ProcedureType]

export const ProcedureTypeLabels: Record<ProcedureType, string> = {
  [ProcedureType.LICENCIA]: 'Licencia de Funcionamiento',
  [ProcedureType.ITSE]: 'ITSE',
}

export const CaseFileStatus = {
  BORRADOR: 'BORRADOR',
  PENDIENTE_REVISION: 'PENDIENTE_DE_REVISION',
  DOCUMENTOS_APROBADOS: 'DOCUMENTOS_APROBADOS',
  PENDIENTE_INSPECCION: 'PENDIENTE_DE_INSPECCION',
  APROBADO: 'APROBADO',
  OBSERVADO: 'OBSERVADO',
  RECHAZADO: 'RECHAZADO',
} as const

export type CaseFileStatus = (typeof CaseFileStatus)[keyof typeof CaseFileStatus]

export const CaseFileStatusLabels: Record<CaseFileStatus, string> = {
  [CaseFileStatus.BORRADOR]: 'Borrador',
  [CaseFileStatus.PENDIENTE_REVISION]: 'Pendiente de revisión',
  [CaseFileStatus.DOCUMENTOS_APROBADOS]: 'Documentos aprobados',
  [CaseFileStatus.PENDIENTE_INSPECCION]: 'Pendiente de inspección',
  [CaseFileStatus.APROBADO]: 'Aprobado',
  [CaseFileStatus.OBSERVADO]: 'Observado',
  [CaseFileStatus.RECHAZADO]: 'Rechazado',
}

export const CaseFileStatusColors: Record<CaseFileStatus, string> = {
  [CaseFileStatus.BORRADOR]: 'bg-gray-100 text-gray-700',
  [CaseFileStatus.PENDIENTE_REVISION]: 'bg-yellow-100 text-yellow-700',
  [CaseFileStatus.DOCUMENTOS_APROBADOS]: 'bg-blue-100 text-blue-700',
  [CaseFileStatus.PENDIENTE_INSPECCION]: 'bg-purple-100 text-purple-700',
  [CaseFileStatus.APROBADO]: 'bg-green-100 text-green-700',
  [CaseFileStatus.OBSERVADO]: 'bg-orange-100 text-orange-700',
  [CaseFileStatus.RECHAZADO]: 'bg-red-100 text-red-700',
}

export const RiskLevel = {
  BAJO: 'BAJO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO',
} as const

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel]

export const RiskLevelLabels: Record<RiskLevel, string> = {
  [RiskLevel.BAJO]: 'Bajo',
  [RiskLevel.MEDIO]: 'Medio',
  [RiskLevel.ALTO]: 'Alto',
}

export const RiskLevelColors: Record<RiskLevel, string> = {
  [RiskLevel.BAJO]: 'bg-green-100 text-green-700',
  [RiskLevel.MEDIO]: 'bg-yellow-100 text-yellow-700',
  [RiskLevel.ALTO]: 'bg-red-100 text-red-700',
}

export interface CaseFile {
  id: number
  tracking_code: string
  created_at: string
  citizen: number
  establishment: number
  establishment_name?: string
  company_name?: string
  procedure_type: ProcedureType
  risk_level: RiskLevel
  status: CaseFileStatus
  procedure_requirements?: ProcedureRequirement[]
  inspection_date?: string
  inspection_start_time?: string
  inspection_end_time?: string
}

export interface Requirement {
  id: number
  name: string
  description: string
  allowed_formats: string[]
  is_required: boolean
  procedure_type: ProcedureType
}

export interface ProcedureRequirement {
  id: number
  requirement: Requirement
  fulfilled: boolean
  documents: AttachedDocument[]
}

export interface AttachedDocument {
  id: number
  name: string
  file: string
  validation_status: 'PENDIENTE' | 'APROBADO' | 'OBSERVADO'
  observations: string
  uploaded_at: string
}

export interface CreateCaseFileRequest {
  establishment: number
  procedure_type: ProcedureType
}

export interface UpdateCaseFileRequest {
  establishment?: number
  procedure_type?: ProcedureType
}
