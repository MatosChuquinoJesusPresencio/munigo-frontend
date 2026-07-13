import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { employeeService } from '../../lib/employee.service'
import { getDocumentUrl } from '../../lib/api'
import type { CaseFile, ProcedureRequirement } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

const ValidationStatusConfig: Record<string, { bg: string; border: string; text: string; label: string }> = {
  PENDIENTE: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', label: 'Pendiente' },
  APROBADO: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Aprobado' },
  OBSERVADO: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Observado' },
}

export default function ManagerCaseFileDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [requirements, setRequirements] = useState<ProcedureRequirement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const cf = await employeeService.getCaseFileDetail(Number(id))
        if (!cancelled) {
          setCaseFile(cf)
          setRequirements(cf.procedure_requirements || [])
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando expediente...</p>
        </div>
      </div>
    )
  }

  if (!caseFile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-red-600">Expediente no encontrado.</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary hover:underline">Volver</button>
        </div>
      </div>
    )
  }

  const createdDate = new Date(caseFile.created_at).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-txt-muted transition hover:text-txt"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver
      </button>

      <div className="mb-8 rounded-lg border border-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CaseFileStatusColors[caseFile.status]}`}>
            {CaseFileStatusLabels[caseFile.status]}
          </span>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RiskLevelColors[caseFile.risk_level]}`}>
            Riesgo: {RiskLevelLabels[caseFile.risk_level]}
          </span>
        </div>

        <h1 className="mb-1 text-2xl font-bold text-txt">{caseFile.tracking_code}</h1>
        <p className="text-sm text-txt-muted">{ProcedureTypeLabels[caseFile.procedure_type]}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-txt-muted">
          <span>{caseFile.company_name}</span>
          <span>•</span>
          <span>{caseFile.establishment_name}</span>
          <span>•</span>
          <span>Creado el {createdDate}</span>
        </div>

        {caseFile.inspection_date && (
          <div className="mt-3 flex items-center gap-4 text-sm text-txt">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Inspección: {new Date(caseFile.inspection_date).toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            {caseFile.inspection_start_time && caseFile.inspection_end_time && (
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {caseFile.inspection_start_time.slice(0, 5)} - {caseFile.inspection_end_time.slice(0, 5)}
              </span>
            )}
          </div>
        )}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-txt">Requisitos y Documentos</h2>

      <div className="space-y-4">
        {requirements.map((pr) => {
          const doc = pr.documents[0]
          const statusConfig = doc ? (ValidationStatusConfig[doc.validation_status] ?? ValidationStatusConfig.PENDIENTE) : null

          return (
            <div key={pr.id} className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${pr.fulfilled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {pr.fulfilled ? 'Cumplido' : 'Pendiente'}
                  </span>
                  {pr.requirement.is_required && (
                    <span className="text-xs text-red-500">*Requerido</span>
                  )}
                  {statusConfig && (
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} border`}>
                      {statusConfig.label}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-txt">{pr.requirement.name}</h3>
                {pr.requirement.description && (
                  <p className="mt-1 text-sm text-txt-muted">{pr.requirement.description}</p>
                )}

                {doc && (
                  <div className="mt-3">
                    <a
                      href={getDocumentUrl(doc.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 0 0-6.364-6.364L4.757 8.25a4.5 4.5 0 0 0 6.364 6.364l4.5-4.5Z" />
                      </svg>
                      Ver documento
                    </a>
                    {doc.observations && (
                      <p className="mt-2 text-sm text-amber-700 bg-amber-50 rounded-md px-3 py-2">
                        Observaciones: {doc.observations}
                      </p>
                    )}
                  </div>
                )}

                {!doc && (
                  <p className="mt-3 text-sm text-txt-muted italic">No se ha subido documento</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
