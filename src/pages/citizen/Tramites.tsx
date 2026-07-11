import { useState, useEffect } from 'react'
import { caseFileService } from '../../lib/case-file.service'
import { getCompanies } from '../../lib/company.service'
import type { CaseFile } from '../../types/procedure'
import { CaseFileStatus } from '../../types/procedure'
import type { Company } from '../../types/organization'
import CaseFileCard from '../../components/procedures/CaseFileCard'
import CaseFileModal from '../../components/procedures/CaseFileModal'
import DeleteCaseFileModal from '../../components/procedures/DeleteCaseFileModal'
import CaseFileEmptyState from '../../components/procedures/CaseFileEmptyState'

const statusFilters = [
  { label: 'Todos', value: '' },
  { label: 'Borrador', value: CaseFileStatus.BORRADOR },
  { label: 'En proceso', value: CaseFileStatus.PENDIENTE_REVISION },
  { label: 'Aprobados', value: CaseFileStatus.APROBADO },
  { label: 'Observados', value: CaseFileStatus.OBSERVADO },
  { label: 'Rechazados', value: CaseFileStatus.RECHAZADO },
]

export default function Tramites() {
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCaseFile, setEditingCaseFile] = useState<CaseFile | null>(null)
  const [deletingCaseFile, setDeletingCaseFile] = useState<CaseFile | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [cf, co] = await Promise.all([
          caseFileService.getAll(),
          getCompanies(),
        ])
        if (!cancelled) {
          setCaseFiles(cf)
          setCompanies(co)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = filter
    ? caseFiles.filter((cf) => cf.status === filter)
    : caseFiles

  async function reload() {
    const [cf, co] = await Promise.all([
      caseFileService.getAll(),
      getCompanies(),
    ])
    setCaseFiles(cf)
    setCompanies(co)
  }

  function handleEdit(caseFile: CaseFile) {
    setEditingCaseFile(caseFile)
    setModalOpen(true)
  }

  function handleCreate() {
    setEditingCaseFile(null)
    setModalOpen(true)
  }

  function handleCloseModal() {
    setModalOpen(false)
    setEditingCaseFile(null)
  }

  async function handleDeleteConfirm() {
    if (!deletingCaseFile) return
    await caseFileService.remove(deletingCaseFile.id)
    setDeletingCaseFile(null)
    reload()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt">Mis Trámites</h1>
          <p className="text-sm text-txt-muted">Gestiona tus expedientes de trámites</p>
        </div>
        {caseFiles.length > 0 && (
          <button
            onClick={handleCreate}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
          >
            Nuevo Trámite
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando trámites...</p>
        </div>
      ) : caseFiles.length === 0 ? (
        <CaseFileEmptyState onCreate={handleCreate} />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {statusFilters.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setFilter(sf.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === sf.value
                    ? 'bg-primary text-white'
                    : 'bg-surface text-txt-muted hover:bg-surface/80 hover:text-txt'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((cf) => (
              <CaseFileCard
                key={cf.id}
                caseFile={cf}
                onEdit={() => handleEdit(cf)}
                onDelete={() => setDeletingCaseFile(cf)}
              />
            ))}
          </div>
        </>
      )}

      <CaseFileModal
        key={editingCaseFile?.id ?? 'new'}
        isOpen={modalOpen}
        editingCaseFile={editingCaseFile}
        companies={companies}
        onClose={handleCloseModal}
        onSaved={() => {
          handleCloseModal()
          reload()
        }}
      />

      <DeleteCaseFileModal
        isOpen={!!deletingCaseFile}
        trackingCode={deletingCaseFile?.tracking_code ?? ''}
        onClose={() => setDeletingCaseFile(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
