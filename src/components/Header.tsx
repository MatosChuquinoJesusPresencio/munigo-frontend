import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-primary">
      <div className="mx-auto flex h-25 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <div className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5">
            <img src="/logo.png" alt="" className="h-25" />
            <span className="text-lg font-bold text-primary">MuniGO</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-white/80 transition hover:text-white">
            Inicio
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              className="rounded-md border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Cerrar sesión
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-md border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white/60 hover:bg-white/10"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 md:hidden"
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
        <div className="border-t border-white/10 bg-primary px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white/80 transition hover:text-white"
            >
              Inicio
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="w-full rounded-md border border-white/30 px-4 py-2 text-left text-sm text-white transition hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-600"
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
