import { useState, useEffect } from 'react'
import { employeeService } from '../../lib/employee.service'
import { CaseFileStatusLabels, ProcedureTypeLabels } from '../../types/procedure'

export default function ManagerDashboard() {
  const [data, setData] = useState<{ total: number; by_status: Record<string, number>; by_procedure_type: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const result = await employeeService.getDashboard()
        if (!cancelled) setData(result)
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Dashboard</h1>
        <p className="text-sm text-txt-muted">Resumen general del sistema</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando datos...</p>
        </div>
      ) : !data ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-red-500">Error al cargar el dashboard.</p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <p className="text-sm text-txt-muted">Total Expedientes</p>
              <p className="mt-1 text-3xl font-bold text-primary">{data.total}</p>
            </div>
            {Object.entries(data.by_status).slice(0, 3).map(([status, count]) => (
              <div key={status} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <p className="text-sm text-txt-muted">{CaseFileStatusLabels[status as keyof typeof CaseFileStatusLabels] || status}</p>
                <p className="mt-1 text-3xl font-bold text-txt">{count}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-txt">Por Estado</h2>
              <div className="space-y-3">
                {Object.entries(data.by_status).map(([status, count]) => {
                  const pct = data.total > 0 ? (count / data.total) * 100 : 0
                  return (
                    <div key={status}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-txt">{CaseFileStatusLabels[status as keyof typeof CaseFileStatusLabels] || status}</span>
                        <span className="font-medium text-txt">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-txt">Por Tipo de Trámite</h2>
              <div className="space-y-3">
                {Object.entries(data.by_procedure_type).map(([type, count]) => {
                  const pct = data.total > 0 ? (count / data.total) * 100 : 0
                  return (
                    <div key={type}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-txt">{ProcedureTypeLabels[type as keyof typeof ProcedureTypeLabels] || type}</span>
                        <span className="font-medium text-txt">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
