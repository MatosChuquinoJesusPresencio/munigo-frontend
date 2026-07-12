import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types/auth'

interface SidebarLink {
  label: string
  to: string
  icon: React.ReactNode
}

const citizenLinks: SidebarLink[] = [
  {
    label: 'Mis Trámites',
    to: '/tramites',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: 'Mis Citas',
    to: '/appointments',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Notificaciones',
    to: '/notifications',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
  {
    label: 'Mis Empresas',
    to: '/organizations',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
]

const employeeLinks: SidebarLink[] = [
  {
    label: 'Revisión de Trámites',
    to: '/panel',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user, isLoading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = user?.role === UserRole.EMPLOYEE ? employeeLinks : citizenLinks

  function handleLinkClick() {
    setMobileOpen(false)
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const sidebarLinks = (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2.5">
              <div className="h-5 w-5 animate-pulse rounded bg-surface" />
              <div className="h-4 animate-pulse rounded bg-surface" style={{ width: `${60 + i * 10}%` }} />
            </div>
          ))}
        </div>
      ) : (
        links.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border-l-3 border-primary bg-surface text-primary'
                  : 'text-txt-muted hover:bg-surface hover:text-txt'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          )
        })
      )}
    </nav>
  )

  const sidebarLogout = (
    <div className="border-t border-border p-4">
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-white md:flex md:flex-col">
        <Link to="/" className="flex items-center justify-center border-b border-border px-4 py-5">
          <img src="/logo.png" alt="MuniGO" className="h-20" />
        </Link>
        {sidebarLinks}
        {sidebarLogout}
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg md:hidden"
        aria-label="Menú"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-xl md:hidden">
          <div className="relative flex items-center justify-center border-b border-border px-4 py-4">
            <Link to="/" onClick={handleLinkClick}>
              <img src="/logo.png" alt="MuniGO" className="h-14" />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 rounded-md p-1 text-txt-muted transition hover:bg-surface"
              aria-label="Cerrar menú"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {sidebarLinks}
          {sidebarLogout}
        </aside>
      )}
    </>
  )
}
