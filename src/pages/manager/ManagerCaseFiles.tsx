import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { apiRequest } from '../../lib/api'
import type { CaseFile } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'
import InfoSep from '../../components/InfoSep'

export default function ManagerCaseFiles() {
  const navigate = useNavigate()
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await apiRequest<CaseFile[]>('/procedures/case-files/')
        if (!cancelled) setCaseFiles(data)
      } catch {
        if (!cancelled) setError('Error al cargar los expedientes.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = caseFiles.filter((cf) => {
    if (filterStatus && cf.status !== filterStatus) return false
    if (filterType && cf.procedure_type !== filterType) return false
    return true
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Expedientes</h1>
        <p className="text-sm text-txt-muted">Todos los expedientes del sistema</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-txt"
        >
          <option value="">Todos los estados</option>
          {Object.entries(CaseFileStatusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm text-txt"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(ProcedureTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando expedientes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <h3 className="mb-2 text-lg font-semibold text-txt">No hay expedientes</h3>
          <p className="text-sm text-txt-muted">No se encontraron expedientes con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cf) => {
            const createdDate = new Date(cf.created_at).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={cf.id}
                className="cursor-pointer rounded-lg border border-border bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
                onClick={() => navigate(`/gerente/expedientes/${cf.id}`)}
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
