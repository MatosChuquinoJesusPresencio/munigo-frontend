export const DocumentType = {
  DNI: 'DNI',
  RUC: 'RUC',
  CARNE_DE_EXTRANJERIA: 'CARNE_DE_EXTRANJERIA',
  PASAPORTE: 'PASAPORTE',
} as const

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]

export const UserRole = {
  CITIZEN: 'CITIZEN',
  EMPLOYEE: 'EMPLOYEE',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const Position = {
  FUNCIONARIO: 'FUNCIONARIO',
  INSPECTOR: 'INSPECTOR',
  GERENTE: 'GERENTE',
} as const

export type Position = (typeof Position)[keyof typeof Position]

export const PositionLabels: Record<Position, string> = {
  [Position.FUNCIONARIO]: 'Funcionario',
  [Position.INSPECTOR]: 'Inspector',
  [Position.GERENTE]: 'Gerente',
}

export const Area = {
  FISCALIZACION: 'FISCALIZACION',
  TRIBUTACION: 'TRIBUTACION',
  DESARROLLO_URBANO: 'DESARROLLO_URBANO',
  LICENCIAS: 'LICENCIAS',
  ADMINISTRACION: 'ADMINISTRACION',
  OTRO: 'OTRO',
} as const

export type Area = (typeof Area)[keyof typeof Area]

export const AreaLabels: Record<Area, string> = {
  [Area.FISCALIZACION]: 'Fiscalización',
  [Area.TRIBUTACION]: 'Tributación',
  [Area.DESARROLLO_URBANO]: 'Desarrollo Urbano',
  [Area.LICENCIAS]: 'Licencias',
  [Area.ADMINISTRACION]: 'Administración',
  [Area.OTRO]: 'Otro',
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  document_type: DocumentType
  document_number: string
}

export interface LoginRequest {
  document_type: DocumentType
  document_number: string
  password: string
}

export interface LogoutRequest {
  refresh: string
}

export interface RefreshRequest {
  refresh: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Citizen {
  id: number
  document_type: DocumentType
  document_number: string
}

export interface Employee {
  id: number
  position: Position
  area: Area
}

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  citizen: Citizen | null
  employee: Employee | null
}
