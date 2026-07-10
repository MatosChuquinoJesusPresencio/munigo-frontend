import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types/auth'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-25 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <div className="px-3 py-1.5">
            <img src="/logo.png" alt="MuniGO" className="h-25" />
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-semibold text-txt transition hover:text-primary">
            Inicio
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={user?.role === UserRole.EMPLOYEE ? '/panel' : '/appointments'}
                className="text-sm font-semibold text-txt transition hover:text-primary"
              >
                {user?.role === UserRole.EMPLOYEE ? 'Panel' : 'Mis Citas'}
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-txt transition hover:bg-surface md:hidden"
          aria-label="Menú"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-txt transition hover:text-primary"
            >
              Inicio
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === UserRole.EMPLOYEE ? '/panel' : '/appointments'}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-txt transition hover:text-primary"
                >
                  {user?.role === UserRole.EMPLOYEE ? 'Panel' : 'Mis Citas'}
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
