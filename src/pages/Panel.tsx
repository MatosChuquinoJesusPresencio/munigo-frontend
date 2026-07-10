import { Link } from 'react-router'

export default function Panel() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-txt">Panel</h1>
      <p className="mb-8 text-txt-muted">Gestión de inspecciones y trámites</p>

      <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <svg className="mx-auto mb-4 h-12 w-12 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6Zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
        <p className="mb-4 text-sm text-txt-muted">
          Próximamente podrás gestionar inspecciones y trámites aquí.
        </p>
        <Link
          to="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
