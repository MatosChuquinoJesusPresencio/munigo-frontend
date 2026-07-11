import { Link } from 'react-router'

export default function Appointments() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Mis Citas</h1>
        <p className="text-sm text-txt-muted">Gestiona tus citas aquí</p>
      </div>

      <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <svg className="mx-auto mb-4 h-12 w-12 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <p className="mb-4 text-sm text-txt-muted">
          Próximamente podrás agendar y gestionar tus citas aquí.
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
