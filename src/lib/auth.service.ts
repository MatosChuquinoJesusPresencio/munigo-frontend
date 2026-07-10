import type {
  RegisterRequest,
  LoginRequest,
  LogoutRequest,
  AuthTokens,
  User,
} from '../types/auth'
import { apiRequest, storeTokens, clearTokens, getRefreshToken } from './api'

export async function register(data: RegisterRequest): Promise<User> {
  return apiRequest<User>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function login(data: LoginRequest): Promise<AuthTokens> {
  const tokens = await apiRequest<AuthTokens>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  storeTokens(tokens)
  return tokens
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken()
  if (!refresh) {
    clearTokens()
    return
  }

  try {
    await apiRequest<{ detail: string }>('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh } satisfies LogoutRequest),
    })
  } finally {
    clearTokens()
  }
}

export async function refreshTokens(refresh: string): Promise<AuthTokens> {
  const tokens = await apiRequest<AuthTokens>('/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
  storeTokens(tokens)
  return tokens
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/auth/me/')
}
