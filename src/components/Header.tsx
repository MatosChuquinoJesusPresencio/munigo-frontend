import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
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
            <button
              onClick={() => logout()}
              className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
            >
              Cerrar sesión
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
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
              <button
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="w-full rounded-md border border-border px-4 py-2 text-left text-sm text-txt transition hover:bg-surface"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
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
