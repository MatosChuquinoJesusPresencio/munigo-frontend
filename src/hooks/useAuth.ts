import { useState, useCallback } from 'react'
import type { LoginRequest, RegisterRequest } from '../types/auth'
import * as authService from '../lib/auth.service'
import { getAccessToken } from '../lib/api'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

function getInitialAuthState(): AuthState {
  return {
    isAuthenticated: !!getAccessToken(),
    isLoading: false,
    error: null,
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(getInitialAuthState)

  const login = useCallback(async (data: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await authService.login(data)
      setState((prev) => ({ ...prev, isAuthenticated: true, isLoading: false }))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesión'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw err
    }
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await authService.register(data)
      setState((prev) => ({ ...prev, isLoading: false }))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al registrar'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      await authService.logout()
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
  }
}
