import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { employeeService } from '../../lib/employee.service'
import type { CaseFile } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'
import InfoSep from '../../components/InfoSep'

export default function Historial() {
  const navigate = useNavigate()
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await employeeService.getHistory()
        if (!cancelled) setCaseFiles(data)
      } catch {
        if (!cancelled) setError('Error al cargar el historial.')
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
        <h1 className="text-2xl font-bold text-txt">Historial de Trámites</h1>
        <p className="text-sm text-txt-muted">
          Trámites aprobados, rechazados y en proceso
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium underline">
            Cerrar
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando historial...</p>
        </div>
      ) : caseFiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-txt">No hay trámites en el historial</h3>
          <p className="text-sm text-txt-muted">
            Cuando los trámites se revisen, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {caseFiles.map((cf) => {
            const createdDate = new Date(cf.created_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={cf.id}
                className="cursor-pointer rounded-lg border border-border bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
                onClick={() => navigate(`/panel/${cf.id}`)}
              >
                <div className="px-5 py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CaseFileStatusColors[cf.status]}`}>
                      {CaseFileStatusLabels[cf.status]}
                    </span>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RiskLevelColors[cf.risk_level]}`}>
                      Riesgo: {RiskLevelLabels[cf.risk_level]}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-txt">{cf.tracking_code}</h3>
                  <p className="text-sm text-txt-muted">{ProcedureTypeLabels[cf.procedure_type]}</p>

                  <InfoSep items={[cf.company_name, cf.establishment_name, createdDate]} />
                </div>

                <div className="border-t border-border px-5 py-3 bg-surface/30">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/panel/${cf.id}`) }}
                    className="w-full rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
