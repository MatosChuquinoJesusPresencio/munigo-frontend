import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { inspectionService } from '../../lib/inspection.service'
import type { CaseFile } from '../../types/procedure'
import { ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

export default function InspectorPanel() {
  const navigate = useNavigate()
  const [cases, setCases] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await inspectionService.getMyInspections()
        if (!cancelled) {
          const sorted = [...data].sort((a, b) => {
            const da = a.inspection_date || ''
            const db = b.inspection_date || ''
            if (da !== db) return da.localeCompare(db)
            return (a.inspection_start_time || '').localeCompare(b.inspection_start_time || '')
          })
          setCases(sorted)
        }
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
        <h1 className="text-2xl font-bold text-txt">Mis Inspecciones</h1>
        <p className="text-sm text-txt-muted">Inspecciones asignadas pendientes de realización</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando inspecciones...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-txt">Sin inspecciones pendientes</h3>
          <p className="max-w-sm text-sm text-txt-muted">
            No tienes inspecciones asignadas por el momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((cf) => {
            const inspectionDate = cf.inspection_date
              ? new Date(cf.inspection_date).toLocaleDateString('es-PE', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : null
            const startTime = cf.inspection_start_time?.slice(0, 5)
            const endTime = cf.inspection_end_time?.slice(0, 5)

            return (
              <button
                key={cf.id}
                onClick={() => navigate(`/inspector/${cf.id}`)}
                className="w-full rounded-lg border border-border bg-white p-5 shadow-sm text-left transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RiskLevelColors[cf.risk_level]}`}>
                    Riesgo: {RiskLevelLabels[cf.risk_level]}
                  </span>
                  <span className="text-xs text-txt-muted">{cf.tracking_code}</span>
                </div>

                <h3 className="text-base font-semibold text-txt">
                  {cf.establishment_name || 'Establecimiento'}
                </h3>
                <p className="text-sm text-txt-muted">
                  {ProcedureTypeLabels[cf.procedure_type]}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs text-txt-muted">
                  {cf.company_name && <span>{cf.company_name}</span>}
                  {cf.company_name && cf.establishment_name && <span>·</span>}
                  {cf.establishment_name && <span>{cf.establishment_name}</span>}
                </div>

                {inspectionDate && (
                  <div className="mt-3 flex items-center gap-4 text-sm text-txt">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      <span className="capitalize">{inspectionDate}</span>
                    </span>
                    {startTime && endTime && (
                      <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>{startTime} - {endTime}</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3">
                  <span className="text-xs font-medium text-primary">
                    Realizar inspección →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
