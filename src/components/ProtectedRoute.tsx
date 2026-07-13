import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole, Position } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  allowedPositions?: Position[]
}

export default function ProtectedRoute({ allowedRoles, allowedPositions }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  if (allowedPositions && (!user.employee || !allowedPositions.includes(user.employee.position))) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
