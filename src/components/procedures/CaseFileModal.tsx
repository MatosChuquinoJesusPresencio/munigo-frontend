import { useState } from 'react'
import { ApiClientError } from '../../lib/api'
import { caseFileService } from '../../lib/case-file.service'
import { getCompanyById } from '../../lib/company.service'
import type { CaseFile, ProcedureType } from '../../types/procedure'
import { ProcedureTypeLabels } from '../../types/procedure'
import type { Company, Establishment } from '../../types/organization'

interface CaseFileModalProps {
  isOpen: boolean
  editingCaseFile?: CaseFile | null
  companies: Company[]
  onClose: () => void
  onSaved: () => void
}

export default function CaseFileModal({
  isOpen,
  editingCaseFile,
  companies,
  onClose,
  onSaved,
}: CaseFileModalProps) {
  const [procedureType, setProcedureType] = useState<ProcedureType | ''>(
    editingCaseFile?.procedure_type ?? '',
  )
  const [companyId, setCompanyId] = useState<number | ''>(
    editingCaseFile?.establishment ? '' : '',
  )
  const [establishmentId, setEstablishmentId] = useState<number | ''>(
    editingCaseFile?.establishment ?? '',
  )
  const [companyEstablishments, setCompanyEstablishments] = useState<Establishment[]>([])
  const [loadingEstablishments, setLoadingEstablishments] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isEditing = !!editingCaseFile

  if (!isOpen) return null

  async function handleCompanyChange(value: string) {
    const id = value ? Number(value) : ''
    setCompanyId(id)
    setEstablishmentId('')
    setCompanyEstablishments([])

    if (id) {
      setLoadingEstablishments(true)
      try {
        const company = await getCompanyById(id)
        setCompanyEstablishments(company.establishments ?? [])
      } catch {
        setError('Error al cargar los establecimientos.')
      } finally {
        setLoadingEstablishments(false)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!procedureType || !establishmentId) {
      setError('Completa todos los campos.')
      return
    }

    setLoading(true)
    try {
      if (isEditing && editingCaseFile) {
        await caseFileService.update(editingCaseFile.id, {
          establishment: establishmentId as number,
          procedure_type: procedureType as ProcedureType,
        })
      } else {
        await caseFileService.create({
          establishment: establishmentId as number,
          procedure_type: procedureType as ProcedureType,
        })
      }
      onSaved()
    } catch (err) {
      if (err instanceof ApiClientError) {
        const data = err.data
        if (typeof data.detail === 'string') {
          setError(data.detail)
        } else {
          const firstKey = Object.keys(data)[0]
          if (firstKey && Array.isArray(data[firstKey])) {
            setError(String(data[firstKey][0]))
          } else {
            setError('Error al guardar. Intenta nuevamente.')
          }
        }
      } else {
        setError('Error al guardar. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-txt">
          {isEditing ? 'Editar Trámite' : 'Nuevo Trámite'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Tipo de trámite</label>
            <select
              value={procedureType}
              onChange={(e) => setProcedureType(e.target.value as ProcedureType | '')}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar tipo...</option>
              {Object.entries(ProcedureTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Empresa</label>
            <select
              value={companyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Seleccionar empresa...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.business_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Establecimiento</label>
            <select
              value={establishmentId}
              onChange={(e) => setEstablishmentId(e.target.value ? Number(e.target.value) : '')}
              disabled={!companyId || loadingEstablishments}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              <option value="">
                {loadingEstablishments ? 'Cargando...' : !companyId ? 'Primero selecciona una empresa' : 'Seleccionar establecimiento...'}
              </option>
              {companyEstablishments.map((est) => (
                <option key={est.id} value={est.id}>{est.name}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-txt-muted transition hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear trámite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
