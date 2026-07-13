import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'
import * as authService from '../lib/auth.service'
import { getAccessToken, clearTokens, ApiClientError } from '../lib/api'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiClientError) {
    const data = err.data
    if (typeof data.detail === 'string') return data.detail
    const firstField = Object.values(data)[0]
    if (Array.isArray(firstField) && typeof firstField[0] === 'string') {
      return firstField[0]
    }
    return 'Ocurrió un error. Intenta nuevamente.'
  }
  if (err instanceof Error) return err.message
  return 'Ocurrió un error. Intenta nuevamente.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken())
  const [isLoading, setIsLoading] = useState(() => !!getAccessToken())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user) return
    let cancelled = false
    authService
      .getMe()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        if (!cancelled) {
          clearTokens()
          setIsAuthenticated(false)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [isAuthenticated, user])

  const login = useCallback(async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.login(data)
      const me = await authService.getMe()
      setUser(me)
      setIsAuthenticated(true)
    } catch (err) {
      clearTokens()
      const message = extractErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.register(data)
    } catch (err) {
      const message = extractErrorMessage(err)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
