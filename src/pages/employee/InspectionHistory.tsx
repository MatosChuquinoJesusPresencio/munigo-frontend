import { useState, useEffect } from 'react'
import { inspectionService } from '../../lib/inspection.service'
import type { CaseFile } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels } from '../../types/procedure'

export default function InspectionHistory() {
  const [cases, setCases] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await inspectionService.getInspectionHistory()
        if (!cancelled) setCases(data)
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
        <h1 className="text-2xl font-bold text-txt">Historial de Inspecciones</h1>
        <p className="text-sm text-txt-muted">Inspecciones que ya has realizado</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando historial...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-txt">Sin inspecciones realizadas</h3>
          <p className="max-w-sm text-sm text-txt-muted">
            Aún no has completado ninguna inspección.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((cf) => {
            const date = new Date(cf.created_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
            return (
              <div key={cf.id} className="rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CaseFileStatusColors[cf.status]}`}>
                    {CaseFileStatusLabels[cf.status]}
                  </span>
                  <span className="text-xs text-txt-muted">{cf.tracking_code}</span>
                </div>

                <h3 className="text-base font-semibold text-txt">
                  {cf.establishment_name || 'Establecimiento'}
                </h3>
                <p className="text-sm text-txt-muted">{ProcedureTypeLabels[cf.procedure_type]}</p>
                <p className="mt-1 text-xs text-txt-muted">Revisado el {date}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
