export const BusinessCategory = {
  RESTAURANT: 'RESTAURANT',
  COMERCIO: 'COMERCIO',
  ALMACEN: 'ALMACEN',
  SERVICIOS: 'SERVICIOS',
  INDUSTRIA: 'INDUSTRIA',
} as const

export type BusinessCategory =
  (typeof BusinessCategory)[keyof typeof BusinessCategory]

export const BusinessCategoryLabels: Record<BusinessCategory, string> = {
  [BusinessCategory.RESTAURANT]: 'Restaurante',
  [BusinessCategory.COMERCIO]: 'Comercio',
  [BusinessCategory.ALMACEN]: 'Almacén',
  [BusinessCategory.SERVICIOS]: 'Servicios',
  [BusinessCategory.INDUSTRIA]: 'Industria',
}

export const EstablishmentSize = {
  PEQUENO: 'PEQUENO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE',
} as const

export type EstablishmentSize =
  (typeof EstablishmentSize)[keyof typeof EstablishmentSize]

export const EstablishmentSizeLabels: Record<EstablishmentSize, string> = {
  [EstablishmentSize.PEQUENO]: 'Pequeño',
  [EstablishmentSize.MEDIANO]: 'Mediano',
  [EstablishmentSize.GRANDE]: 'Grande',
}

export interface Establishment {
  id: number
  company: number
  name: string
  address: string
  business_category: BusinessCategory
  square_meters: number
  size: EstablishmentSize
}

export interface Company {
  id: number
  business_name: string
  ruc: string
  citizens: number[]
  establishments: Establishment[]
}

export interface CreateCompanyRequest {
  business_name: string
  ruc: string
}

export interface UpdateCompanyRequest {
  business_name?: string
  ruc?: string
}

export interface CreateEstablishmentRequest {
  company: number
  name: string
  address: string
  business_category: BusinessCategory
  square_meters: number
}

export interface UpdateEstablishmentRequest {
  name?: string
  address?: string
  business_category?: BusinessCategory
  square_meters?: number
}
