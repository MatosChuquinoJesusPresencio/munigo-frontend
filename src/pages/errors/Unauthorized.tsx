import { Link } from 'react-router'

export default function Unauthorized() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-7xl font-bold text-accent">401</div>
      <h1 className="mb-2 text-2xl font-semibold text-txt">No autorizado</h1>
      <p className="mb-8 text-txt-muted">
        No tienes permiso para acceder a esta página.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
