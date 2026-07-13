import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { inspectionService } from '../../lib/inspection.service'
import { getDocumentUrl, ApiClientError } from '../../lib/api'
import type { CaseFile, ProcedureRequirement } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [requirements, setRequirements] = useState<ProcedureRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [confirmModal, setConfirmModal] = useState<'APROBADO' | 'NO_APROBADO' | null>(null)
  const [comments, setComments] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const cf = await inspectionService.getCaseFileDetail(Number(id))
        if (!cancelled) {
          setCaseFile(cf)
          setRequirements(cf.procedure_requirements ?? [])
        }
      } catch {
        if (!cancelled) setError('Error al cargar el trámite.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function extractError(err: unknown): string {
    if (err instanceof ApiClientError) {
      const data = err.data
      if (typeof data.detail === 'string') return data.detail
      return JSON.stringify(data)
    }
    return 'Ocurrió un error.'
  }

  async function handleSubmit(result: 'APROBADO' | 'NO_APROBADO') {
    setProcessing(true)
    setError(null)
    setConfirmModal(null)
    try {
      await inspectionService.completeInspection(Number(id), {
        result,
        comments,
      })
      navigate('/inspector')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando trámite...</p>
        </div>
      </div>
    )
  }

  if (error && !caseFile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary hover:underline">
            Volver
          </button>
        </div>
      </div>
    )
  }

  if (!caseFile) return null

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

      {/* Case file header */}
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
          <span>·</span>
          <span>{caseFile.establishment_name}</span>
          <span>·</span>
          <span>Creado el {createdDate}</span>
        </div>

        {caseFile.inspection_date && (
          <div className="mt-3 rounded-md border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700">
            Inspección programada: {new Date(caseFile.inspection_date).toLocaleDateString('es-PE', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })} · {caseFile.inspection_start_time?.slice(0, 5)} - {caseFile.inspection_end_time?.slice(0, 5)}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Documents */}
      <h2 className="mb-4 text-lg font-semibold text-txt">Documentos</h2>

      <div className="space-y-4 mb-8">
        {requirements.map((pr) => {
          const doc = pr.documents[0]
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
                </div>

                <h3 className="text-base font-semibold text-txt">{pr.requirement.name}</h3>

                {doc ? (
                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 shrink-0 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-txt">{doc.name}</span>
                      <button
                        onClick={() => window.open(getDocumentUrl(doc.file), '_blank')}
                        className="flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ver
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-md border border-dashed border-border px-4 py-4 text-center">
                    <p className="text-xs text-txt-muted">Sin documento adjunto</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Inspection form */}
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-txt">Resultado de la inspección</h2>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-txt">Comentarios</label>
          <textarea
            placeholder="Observaciones de la inspección (opcional)..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt placeholder:text-txt-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setConfirmModal('APROBADO')}
            disabled={processing}
            className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Aprobar inspección
          </button>
          <button
            onClick={() => setConfirmModal('NO_APROBADO')}
            disabled={processing}
            className="rounded-md border border-red-300 px-6 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No aprobar inspección
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-txt">
              {confirmModal === 'APROBADO' ? 'Confirmar aprobación' : 'Confirmar rechazo'}
            </h3>
            <p className="mb-6 text-sm text-txt-muted">
              {confirmModal === 'APROBADO'
                ? '¿Estás seguro de aprobar esta inspección? El trámite será aprobado.'
                : '¿Estás seguro de no aprobar esta inspección? El trámite será rechazado.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={processing}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-txt transition hover:bg-surface disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSubmit(confirmModal)}
                disabled={processing}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
                  confirmModal === 'APROBADO'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Procesando...' : confirmModal === 'APROBADO' ? 'Sí, aprobar' : 'Sí, rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
