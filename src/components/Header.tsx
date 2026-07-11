import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types/auth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-25 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <div className="px-3 py-1.5">
            <img src="/logo.png" alt="MuniGO" className="h-25" />
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === UserRole.EMPLOYEE ? '/panel' : '/appointments'}
                className="text-sm font-semibold text-txt transition hover:text-primary"
              >
                {user?.role === UserRole.EMPLOYEE ? 'Panel' : 'Mis Trámites'}
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                aria-label="Cerrar sesión"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
