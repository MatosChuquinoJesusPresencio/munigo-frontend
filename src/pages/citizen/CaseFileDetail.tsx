import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { caseFileService } from '../../lib/case-file.service'
import { ApiClientError } from '../../lib/api'
import type { CaseFile, ProcedureRequirement, AttachedDocument } from '../../types/procedure'
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
  const [uploadingIds, setUploadingIds] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function addUploading(id: number) {
    setUploadingIds((prev) => new Set(prev).add(id))
  }
  function removeUploading(id: number) {
    setUploadingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  async function reload() {
    const cf = await caseFileService.getById(Number(id))
    setCaseFile(cf)
    setRequirements(cf.procedure_requirements ?? [])
  }

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

  async function handleUpload(prId: number, replaceFile?: File) {
    const input = fileInputRefs.current[String(prId)]
    const file = replaceFile ?? input?.files?.[0]
    if (!file) return

    addUploading(prId)
    setError(null)

    try {
      await caseFileService.uploadDocument(prId, file, file.name)
      await reload()
      if (input) input.value = ''
    } catch (err) {
      setError(extractError(err))
    } finally {
      removeUploading(prId)
    }
  }

  async function handleDelete(doc: AttachedDocument, prId: number) {
    addUploading(prId)
    setError(null)
    setConfirmDeleteId(null)

    try {
      await caseFileService.deleteDocument(doc.id)
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      removeUploading(prId)
    }
  }

  async function handleReplace(prId: number, oldDoc: AttachedDocument) {
    const input = fileInputRefs.current[`replace_${prId}`]
    if (!input?.files?.[0]) return

    const newFile = input.files[0]
    addUploading(prId)
    setError(null)

    try {
      await caseFileService.deleteDocument(oldDoc.id)
      await caseFileService.uploadDocument(prId, newFile, newFile.name)
      await reload()
      input.value = ''
    } catch (err) {
      setError(extractError(err))
    } finally {
      removeUploading(prId)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    setConfirmSubmit(false)

    try {
      await caseFileService.submit(Number(id))
      await reload()
    } catch (err) {
      setError(extractError(err))
    } finally {
      setSubmitting(false)
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

  const isDraft = caseFile.status === 'BORRADOR'

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
        {requirements.map((pr) => {
          const doc = pr.documents[0]
          const isUploading = uploadingIds.has(pr.id)

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
                <p className="mt-1 text-xs text-txt-muted">
                  Formatos aceptados: {pr.requirement.allowed_formats.join(', ')}
                </p>

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
                        disabled={isUploading}
                        className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                        Ver
                      </button>

                      <input
                        type="file"
                        ref={(el) => { fileInputRefs.current[`replace_${pr.id}`] = el }}
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={() => handleReplace(pr.id, doc)}
                      />
                      <button
                        onClick={() => fileInputRefs.current[`replace_${pr.id}`]?.click()}
                        disabled={isUploading || !isDraft}
                        className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                        </svg>
                        Cambiar
                      </button>

                      {confirmDeleteId === doc.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(doc, pr.id)}
                            disabled={isUploading}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isUploading}
                            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(doc.id)}
                          disabled={isUploading || !isDraft}
                          className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="file"
                      ref={(el) => { fileInputRefs.current[String(pr.id)] = el }}
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={() => handleUpload(pr.id)}
                    />
                    <button
                      onClick={() => fileInputRefs.current[String(pr.id)]?.click()}
                      disabled={isUploading || !isDraft}
                      className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
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
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!isDraft && (
        <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Este trámite ya fue enviado y no se pueden modificar los documentos.
        </div>
      )}

      {isDraft && (
        <div className="mt-8 flex flex-col items-center gap-3">
          {confirmSubmit ? (
            <div className="rounded-lg border border-border bg-white p-4 shadow-sm text-center">
              <p className="mb-3 text-sm text-txt">
                ¿Estás seguro de enviar este trámite? Se verificará que todos los requisitos obligatorios estén cumplidos.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Enviando...' : 'Sí, enviar'}
                </button>
                <button
                  onClick={() => setConfirmSubmit(false)}
                  disabled={submitting}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium text-txt transition hover:bg-surface disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmSubmit(true)}
              disabled={submitting}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              Enviar Trámite
            </button>
          )}
        </div>
      )}
    </div>
  )
}
