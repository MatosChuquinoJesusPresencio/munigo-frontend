import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'
import * as authService from '../lib/auth.service'
import { getAccessToken } from '../lib/api'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && !user) {
      authService
        .getMe()
        .then(setUser)
        .catch(() => {
          setIsAuthenticated(false)
          setUser(null)
        })
    }
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
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
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
      const message = err instanceof Error ? err.message : 'Error al registrar'
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
