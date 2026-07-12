import type { AuthTokens } from '../types/auth'

export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const MEDIA_BASE = import.meta.env.VITE_API_URL ?? ''

export function getDocumentUrl(file: string): string {
  if (file.startsWith('http')) return file
  return `${MEDIA_BASE}/${file}`
}

function getAccessToken(): string | null {
  return localStorage.getItem('access_token')
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token')
}

function storeTokens(tokens: AuthTokens) {
  localStorage.setItem('access_token', tokens.access)
  localStorage.setItem('refresh_token', tokens.refresh)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  try {
    const response = await fetch(`${API_BASE}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })

    if (!response.ok) {
      clearTokens()
      return null
    }

    const data: AuthTokens = await response.json()
    storeTokens(data)
    return data.access
  } catch {
    clearTokens()
    return null
  }
}

export class ApiClientError extends Error {
  status: number
  data: Record<string, unknown>

  constructor(status: number, data: Record<string, unknown>) {
    super(JSON.stringify(data))
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }

  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(url, { ...options, headers })

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      response = await fetch(url, { ...options, headers })
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiClientError(response.status, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export { storeTokens, clearTokens, getAccessToken, getRefreshToken }

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const headers: Record<string, string> = {}

  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })
    }
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiClientError(response.status, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
