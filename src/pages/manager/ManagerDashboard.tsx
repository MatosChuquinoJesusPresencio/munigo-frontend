import { useState, useEffect } from 'react'
import { employeeService } from '../../lib/employee.service'
import { CaseFileStatusLabels, ProcedureTypeLabels } from '../../types/procedure'

export default function ManagerDashboard() {
  const [data, setData] = useState<{ total: number; by_status: Record<string, number>; by_procedure_type: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const result = await employeeService.getDashboard()
        if (!cancelled) setData(result)
      } catch {
        if (!cancelled) setError('Error al cargar el dashboard.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const statusEntries = data ? Object.entries(data.by_status) : []
  const typeEntries = data ? Object.entries(data.by_procedure_type) : []
  const hasData = data && data.total > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Dashboard</h1>
        <p className="text-sm text-txt-muted">Resumen general del sistema</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-txt-muted">Cargando datos...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-txt">Sin datos aun</h3>
          <p className="max-w-sm text-sm text-txt-muted">
            No hay expedientes registrados en el sistema. Los datos apareceran aqui cuando se creen tramites.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <p className="text-sm text-txt-muted">Total Expedientes</p>
              <p className="mt-1 text-3xl font-bold text-primary">{data.total}</p>
            </div>
            {statusEntries.slice(0, 3).map(([status, count]) => (
              <div key={status} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <p className="text-sm text-txt-muted">{CaseFileStatusLabels[status as keyof typeof CaseFileStatusLabels] || status}</p>
                <p className="mt-1 text-3xl font-bold text-txt">{count}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {statusEntries.length > 0 && (
              <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-txt">Por Estado</h2>
                <div className="space-y-3">
                  {statusEntries.map(([status, count]) => {
                    const pct = data.total > 0 ? (count / data.total) * 100 : 0
                    return (
                      <div key={status}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-txt">{CaseFileStatusLabels[status as keyof typeof CaseFileStatusLabels] || status}</span>
                          <span className="font-medium text-txt">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface">
                          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {typeEntries.length > 0 && (
              <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-txt">Por Tipo de Tramite</h2>
                <div className="space-y-3">
                  {typeEntries.map(([type, count]) => {
                    const pct = data.total > 0 ? (count / data.total) * 100 : 0
                    return (
                      <div key={type}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-txt">{ProcedureTypeLabels[type as keyof typeof ProcedureTypeLabels] || type}</span>
                          <span className="font-medium text-txt">{count}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface">
                          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
