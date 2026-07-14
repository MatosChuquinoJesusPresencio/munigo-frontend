import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { employeeService } from '../../lib/employee.service'
import { ApiClientError, getDocumentUrl } from '../../lib/api'
import type { CaseFile, ProcedureRequirement } from '../../types/procedure'
import { CaseFileStatus, CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'
import type { EmployeeUser } from '../../lib/employee.service'
import InfoSep from '../../components/InfoSep'

const ValidationStatusConfig: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  PENDIENTE: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-500',
    icon: '⏳',
    label: 'Pendiente de revisión',
  },
  APROBADO: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    icon: '✓',
    label: 'Aprobado',
  },
  OBSERVADO: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    icon: '👁',
    label: 'Observado',
  },
}

function DocumentCard({ pr, canReview, validatingDocId, observations, onValidate, onChangeObs }: {
  pr: ProcedureRequirement
  canReview: boolean
  validatingDocId: number | null
  observations: Record<number, string>
  onValidate: (docId: number, status: 'APROBADO' | 'OBSERVADO') => void
  onChangeObs: (docId: number, value: string) => void
}) {
  const doc = pr.documents[0]
  const isValidating = validatingDocId === doc?.id
  const statusConfig = doc ? (ValidationStatusConfig[doc.validation_status] ?? ValidationStatusConfig.PENDIENTE) : null

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
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
        {pr.requirement.description && (
          <p className="mt-1 text-sm text-txt-muted">{pr.requirement.description}</p>
        )}

        {doc ? (
          <div className="mt-3">
            <div className={`rounded-lg border ${statusConfig?.border ?? 'border-gray-200'} ${statusConfig?.bg ?? 'bg-gray-50'} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="h-5 w-5 shrink-0 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-txt">{doc.name}</span>
                </div>
                {statusConfig && (
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}>
                    <span>{statusConfig.icon}</span>
                    <span>{statusConfig.label}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => window.open(getDocumentUrl(doc.file), '_blank')}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Ver documento
                </button>
              </div>

              {canReview && (
                <div className="mt-3 space-y-2">
                  <textarea
                    placeholder="Observaciones (opcional)..."
                    value={observations[doc.id] ?? ''}
                    onChange={(e) => onChangeObs(doc.id, e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt placeholder:text-txt-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onValidate(doc.id, 'APROBADO')}
                      disabled={isValidating}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      {isValidating ? 'Guardando...' : 'Aprobar'}
                    </button>
                    <button
                      onClick={() => onValidate(doc.id, 'OBSERVADO')}
                      disabled={isValidating}
                      className="rounded-md border border-orange-300 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
                    >
                      Observar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-md border border-dashed border-border px-4 py-6 text-center">
            <p className="text-xs text-txt-muted">Sin documento adjunto</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CaseFileReview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [requirements, setRequirements] = useState<ProcedureRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validatingDocId, setValidatingDocId] = useState<number | null>(null)
  const [observations, setObservations] = useState<Record<number, string>>({})
  const [processing, setProcessing] = useState(false)
  const [confirmReject, setConfirmReject] = useState(false)

  // Inspector assignment form
  const [inspectors, setInspectors] = useState<EmployeeUser[]>([])
  const [inspectorId, setInspectorId] = useState<number>(0)
  const [scheduledDate, setScheduledDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  async function reload() {
    const cf = await employeeService.getCaseFileDetail(Number(id))
    setCaseFile(cf)
    setRequirements(cf.procedure_requirements ?? [])
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const cf = await employeeService.getCaseFileDetail(Number(id))
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

  useEffect(() => {
    if (caseFile?.status === CaseFileStatus.DOCUMENTOS_APROBADOS) {
      employeeService.getInspectors().then(setInspectors).catch(() => {})
    }
  }, [caseFile?.status])

  function extractError(err: unknown): string {
    if (err instanceof ApiClientError) {
      const data = err.data
      if (typeof data.detail === 'string') return data.detail
      const firstKey = Object.keys(data)[0]
      if (firstKey && Array.isArray(data[firstKey])) {
        return `${firstKey}: ${String(data[firstKey][0])}`
      }
      return JSON.stringify(data)
    }
    return 'Ocurrió un error.'
  }

  async function handleValidateDocument(docId: number, validationStatus: 'APROBADO' | 'OBSERVADO') {
    setValidatingDocId(docId)
    setError(null)
    try {
      await employeeService.validateDocument(docId, {
        validation_status: validationStatus,
        observations: observations[docId] || '',
      })
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setValidatingDocId(null)
    }
  }

  async function handleApproveDocuments() {
    setProcessing(true)
    setError(null)
    try {
      await employeeService.approveDocuments(Number(id))
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setProcessing(false)
    }
  }

  async function handleReject() {
    setProcessing(true)
    setError(null)
    setConfirmReject(false)
    try {
      await employeeService.setCaseFileStatus(Number(id), CaseFileStatus.RECHAZADO)
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setProcessing(false)
    }
  }

  async function handleAssignInspector() {
    if (!inspectorId || !scheduledDate || !startTime || !endTime) {
      setError('Completa todos los campos para asignar el inspector.')
      return
    }
    if (endTime <= startTime) {
      setError('La hora de fin debe ser posterior a la hora de inicio.')
      return
    }
    setProcessing(true)
    setError(null)
    try {
      await employeeService.assignInspector(Number(id), {
        inspector_id: inspectorId,
        scheduled_date: scheduledDate,
        start_time: startTime,
        end_time: endTime,
      })
      await reload()
      setInspectorId(0)
      setScheduledDate('')
      setStartTime('')
      setEndTime('')
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

  const requiredReqs = requirements.filter((pr) => pr.requirement.is_required)
  const allRequiredApproved = requiredReqs.length === 0 || requiredReqs.every((pr) =>
    pr.documents.some((doc) => doc.validation_status === 'APROBADO')
  )
  const allDocsReviewed = requirements.every((pr) =>
    pr.documents.every((doc) => doc.validation_status !== 'PENDIENTE')
  )

  const canReview = caseFile.status === CaseFileStatus.PENDIENTE_REVISION
  const docsApproved = caseFile.status === CaseFileStatus.DOCUMENTOS_APROBADOS
  const pendingInspection = caseFile.status === CaseFileStatus.PENDIENTE_INSPECCION

  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

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

        <div className="mt-4 text-sm text-txt-muted">
          <InfoSep items={[caseFile.company_name, caseFile.establishment_name, `Creado el ${createdDate}`]} />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-txt">Requisitos y Documentos</h2>

      <div className="space-y-4">
        {requirements.map((pr) => (
          <DocumentCard
            key={pr.id}
            pr={pr}
            canReview={canReview}
            validatingDocId={validatingDocId}
            observations={observations}
            onValidate={handleValidateDocument}
            onChangeObs={(docId, value) => setObservations((prev) => ({ ...prev, [docId]: value }))}
          />
        ))}
      </div>

      {/* Estado A: Pendiente de revisión — aprobar documentos o rechazar */}
      {canReview && (
        <div className="mt-8">
          {!allDocsReviewed && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Debes revisar todos los documentos antes de aprobar o rechazar el trámite.
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleApproveDocuments}
              disabled={processing || !allDocsReviewed || !allRequiredApproved}
              className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Procesando...' : 'Aprobar documentos'}
            </button>
            <button
              onClick={() => setConfirmReject(true)}
              disabled={processing || !allDocsReviewed}
              className="rounded-md border border-red-300 px-6 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rechazar trámite
            </button>
          </div>
        </div>
      )}

      {/* Estado B: Documentos aprobados — asignar inspector */}
      {docsApproved && (
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-1 text-base font-semibold text-blue-900">Asignar inspector</h3>
          <p className="mb-4 text-sm text-blue-700">
            Los documentos fueron aprobados. Selecciona un inspector y programar la inspección.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-txt">Inspector</label>
              <select
                value={inspectorId}
                onChange={(e) => setInspectorId(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={0}>Seleccionar inspector...</option>
                {inspectors.map((insp) => (
                  <option key={insp.id} value={insp.id}>
                    {insp.first_name} {insp.last_name} — {insp.area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Fecha</label>
              <input
                type="date"
                min={today}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Hora de inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Hora de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAssignInspector}
              disabled={processing || !inspectorId || !scheduledDate || !startTime || !endTime}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Asignando...' : 'Asignar inspector'}
            </button>
          </div>
        </div>
      )}

      {/* Estado C: Pendiente de inspección — mensaje informativo */}
      {pendingInspection && (
        <div className="mt-6 rounded-md border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          Inspección programada. Un inspector visitará el establecimiento para verificar el cumplimiento.
        </div>
      )}

      {/* Estado D: Otros — banner informativo */}
      {!canReview && !docsApproved && !pendingInspection && (
        <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {caseFile.status === CaseFileStatus.APROBADO
            ? 'Este trámite fue aprobado.'
            : caseFile.status === CaseFileStatus.RECHAZADO
              ? 'Este trámite fue rechazado.'
              : caseFile.status === CaseFileStatus.OBSERVADO
                ? 'Este trámite fue observado.'
                : 'Este trámite ya fue revisado.'}
        </div>
      )}

      {/* Modal confirmación rechazo */}
      {confirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-txt">Confirmar rechazo</h3>
            <p className="mb-6 text-sm text-txt-muted">
              ¿Estás seguro de rechazar este trámite? Esta acción devolverá el trámite al ciudadano.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmReject(false)}
                disabled={processing}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-txt transition hover:bg-surface disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Procesando...' : 'Sí, rechazar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
