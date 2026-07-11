interface EmptyStateProps {
  onCreateCompany: () => void
}

export default function EmptyState({ onCreateCompany }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-txt">No tienes empresas registradas</h3>
      <p className="mb-6 max-w-sm text-sm text-txt-muted">
        Registra tu empresa para comenzar a gestionar trámites de licencias e inspecciones.
      </p>

      <button
        onClick={onCreateCompany}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
      >
        Registrar mi empresa
      </button>
    </div>
  )
}
