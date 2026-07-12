import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { employeeService, type EmployeeUser } from '../../lib/employee.service'
import { ApiClientError } from '../../lib/api'
import type { CaseFile, ProcedureRequirement, AttachedDocument } from '../../types/procedure'
import { CaseFileStatus, CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

const ValidationStatusColors: Record<string, string> = {
  PENDIENTE: 'bg-gray-100 text-gray-700',
  APROBADO: 'bg-green-100 text-green-700',
  OBSERVADO: 'bg-orange-100 text-orange-700',
}

const ValidationStatusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  OBSERVADO: 'Observado',
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
  const [approving, setApproving] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [inspectorId, setInspectorId] = useState<number | ''>('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [inspectors, setInspectors] = useState<EmployeeUser[]>([])
  const [finalizing, setFinalizing] = useState(false)
  const [finalStatus, setFinalStatus] = useState<string>('')

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
        const [cf, insp] = await Promise.all([
          employeeService.getCaseFileDetail(Number(id)),
          employeeService.getInspectors(),
        ])
        if (!cancelled) {
          setCaseFile(cf)
          setRequirements(cf.procedure_requirements ?? [])
          setInspectors(insp)
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
    setApproving(true)
    setError(null)
    try {
      await employeeService.approveDocuments(Number(id))
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setApproving(false)
    }
  }

  async function handleAssignInspector() {
    if (!inspectorId || !scheduledDate || !startTime || !endTime) return
    setAssigning(true)
    setError(null)
    try {
      await employeeService.assignInspector(Number(id), {
        inspector_id: Number(inspectorId),
        scheduled_date: scheduledDate,
        start_time: startTime,
        end_time: endTime,
      })
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setAssigning(false)
    }
  }

  async function handleFinalize() {
    if (!finalStatus) return
    setFinalizing(true)
    setError(null)
    try {
      await employeeService.setCaseFileStatus(Number(id), finalStatus)
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setFinalizing(false)
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
          <button onClick={() => navigate('/panel')} className="mt-4 text-sm text-primary hover:underline">
            Volver al Panel
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
  const allRequiredApproved = requiredReqs.length > 0 && requiredReqs.every((pr) =>
    pr.documents.some((doc) => doc.validation_status === 'APROBADO')
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => navigate('/panel')}
        className="mb-6 flex items-center gap-1 text-sm text-txt-muted transition hover:text-txt"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al Panel
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
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-txt">Requisitos y Documentos</h2>

      <div className="space-y-4">
        {requirements.map((pr) => {
          const doc = pr.documents[0]
          const isValidating = validatingDocId === doc?.id

          return (
            <div key={pr.id} className="rounded-lg border border-border bg-white shadow-sm">
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
                    <div className="flex items-center gap-3 rounded-md bg-surface/50 px-3 py-2">
                      <svg className="h-4 w-4 shrink-0 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span className="min-w-0 flex-1 truncate text-sm text-txt">{doc.name}</span>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ValidationStatusColors[doc.validation_status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {ValidationStatusLabels[doc.validation_status] ?? doc.validation_status}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => window.open(doc.file, '_blank')}
                        className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ver
                      </button>
                    </div>

                    {caseFile.status === CaseFileStatus.PENDIENTE_REVISION && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          placeholder="Observaciones (opcional)..."
                          value={observations[doc.id] ?? ''}
                          onChange={(e) => setObservations((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                          rows={2}
                          className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt placeholder:text-txt-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleValidateDocument(doc.id, 'APROBADO')}
                            disabled={isValidating}
                            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                          >
                            {isValidating ? 'Guardando...' : 'Aprobar'}
                          </button>
                          <button
                            onClick={() => handleValidateDocument(doc.id, 'OBSERVADO')}
                            disabled={isValidating}
                            className="rounded-md border border-orange-300 px-3 py-1.5 text-xs font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
                          >
                            Observar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 rounded-md border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-xs text-txt-muted">Sin documento adjunto</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {caseFile.status === CaseFileStatus.PENDIENTE_REVISION && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleApproveDocuments}
            disabled={approving || !allRequiredApproved}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {approving ? 'Aprobando...' : 'Aprobar trámite'}
          </button>
          {!allRequiredApproved && (
            <p className="text-xs text-txt-muted">
              Todos los requisitos obligatorios deben estar aprobados para continuar.
            </p>
          )}
        </div>
      )}

      {caseFile.status === CaseFileStatus.DOCUMENTOS_APROBADOS && (
        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-txt">Asignar Inspector</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Inspector</label>
              <select
                value={inspectorId}
                onChange={(e) => setInspectorId(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Seleccionar inspector...</option>
                {inspectors.map((insp) => (
                  <option key={insp.id} value={insp.id}>
                    {insp.first_name} {insp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Fecha</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Hora inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Hora fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAssignInspector}
              disabled={assigning || !inspectorId || !scheduledDate || !startTime || !endTime}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assigning ? 'Asignando...' : 'Asignar inspector'}
            </button>
          </div>
        </div>
      )}

      {caseFile.status === CaseFileStatus.PENDIENTE_INSPECCION && (
        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-txt">Resultado de la inspección</h3>
          <p className="mb-4 text-sm text-txt-muted">
            Una vez completada la inspección, seleccione el resultado final del trámite.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setFinalStatus(CaseFileStatus.APROBADO); handleFinalize() }}
              disabled={finalizing}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {finalizing && finalStatus === CaseFileStatus.APROBADO ? 'Procesando...' : 'Aprobar'}
            </button>
            <button
              onClick={() => { setFinalStatus(CaseFileStatus.OBSERVADO); handleFinalize() }}
              disabled={finalizing}
              className="rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50 disabled:opacity-50"
            >
              {finalizing && finalStatus === CaseFileStatus.OBSERVADO ? 'Procesando...' : 'Observar'}
            </button>
            <button
              onClick={() => { setFinalStatus(CaseFileStatus.RECHAZADO); handleFinalize() }}
              disabled={finalizing}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              {finalizing && finalStatus === CaseFileStatus.RECHAZADO ? 'Procesando...' : 'Rechazar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
