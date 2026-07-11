import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { caseFileService } from '../../lib/case-file.service'
import { ApiClientError } from '../../lib/api'
import type { CaseFile, ProcedureRequirement } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

const ValidationStatusColors: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  APROBADO: 'bg-green-100 text-green-700',
  OBSERVADO: 'bg-orange-100 text-orange-700',
}

const ValidationStatusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  OBSERVADO: 'Observado',
}

export default function CaseFileDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseFile, setCaseFile] = useState<CaseFile | null>(null)
  const [requirements, setRequirements] = useState<ProcedureRequirement[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const cf = await caseFileService.getById(Number(id))
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

  async function handleUpload(prId: number) {
    const input = fileInputRefs.current[prId]
    if (!input?.files?.[0]) return

    const file = input.files[0]
    setUploadingId(prId)
    setError(null)

    try {
      await caseFileService.uploadDocument(prId, file, file.name)
      const cf = await caseFileService.getById(Number(id))
      setCaseFile(cf)
      setRequirements(cf.procedure_requirements ?? [])
      input.value = ''
    } catch (err) {
      if (err instanceof ApiClientError) {
        const data = err.data
        if (typeof data.detail === 'string') {
          setError(data.detail)
        } else {
          setError('Error al subir el documento.')
        }
      } else {
        setError('Error al subir el documento.')
      }
    } finally {
      setUploadingId(null)
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
          <button onClick={() => navigate('/tramites')} className="mt-4 text-sm text-primary hover:underline">
            Volver a Mis Trámites
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
        onClick={() => navigate('/tramites')}
        className="mb-6 flex items-center gap-1 text-sm text-txt-muted transition hover:text-txt"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a Mis Trámites
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

      <h2 className="mb-4 text-lg font-semibold text-txt">Requisitos</h2>

      <div className="space-y-4">
        {requirements.map((pr) => (
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
              <p className="mt-1 text-xs text-txt-muted">
                Formatos aceptados: {pr.requirement.allowed_formats.join(', ')}
              </p>

              {pr.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {pr.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 rounded-md bg-surface/50 px-3 py-2">
                      <svg className="h-4 w-4 shrink-0 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      <span className="min-w-0 flex-1 truncate text-sm text-txt">{doc.name}</span>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ValidationStatusColors[doc.validation_status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {ValidationStatusLabels[doc.validation_status] ?? doc.validation_status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="file"
                  ref={(el) => { fileInputRefs.current[pr.id] = el }}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={() => handleUpload(pr.id)}
                />
                <button
                  onClick={() => fileInputRefs.current[pr.id]?.click()}
                  disabled={uploadingId === pr.id}
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface disabled:opacity-50"
                >
                  {uploadingId === pr.id ? (
                    'Subiendo...'
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      Subir archivo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
