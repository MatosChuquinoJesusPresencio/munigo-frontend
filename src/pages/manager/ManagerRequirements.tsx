import { useState, useEffect } from 'react'
import { requirementService } from '../../lib/requirement.service'
import type { Requirement } from '../../types/procedure'
import type { RequirementCreateRequest, RequirementUpdateRequest } from '../../lib/requirement.service'
import { ProcedureTypeLabels, ProcedureType } from '../../types/procedure'
import RequirementForm from './RequirementForm'

const ProcedureTypeEntries = Object.entries(ProcedureTypeLabels) as [string, string][]

export default function ManagerRequirements() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>(ProcedureType.ITSE)
  const [showForm, setShowForm] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function loadRequirements() {
    const data = await requirementService.getAll(activeTab)
    setRequirements(data)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await requirementService.getAll(activeTab)
        if (!cancelled) setRequirements(data)
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [activeTab])

  async function handleCreate(data: RequirementCreateRequest | RequirementUpdateRequest) {
    await requirementService.create(data as RequirementCreateRequest)
    setShowForm(false)
    try { await loadRequirements() } catch { /* form already closed */ }
  }

  async function handleUpdate(data: RequirementUpdateRequest) {
    if (!editingRequirement) return
    await requirementService.update(editingRequirement.id, data)
    setEditingRequirement(null)
    try { await loadRequirements() } catch { /* form already closed */ }
  }

  async function confirmDelete() {
    if (deletingId === null) return
    try {
      await requirementService.delete(deletingId)
      setDeletingId(null)
      await loadRequirements()
    } catch {
      // silent
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt">Requisitos</h1>
          <p className="text-sm text-txt-muted">Gestión de requisitos por tipo de trámite</p>
        </div>
        <button
          onClick={() => { setEditingRequirement(null); setShowForm(true) }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          + Crear requisito
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1">
        {ProcedureTypeEntries.map(([value, label]) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === value
                ? 'bg-white text-txt shadow-sm'
                : 'text-txt-muted hover:text-txt'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando requisitos...</p>
        </div>
      ) : requirements.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <h3 className="mb-2 text-lg font-semibold text-txt">No hay requisitos</h3>
          <p className="text-sm text-txt-muted">Crea el primer requisito para este tipo de trámite.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Nombre</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Descripción</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Requerido</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Formatos</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-txt-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-sm font-medium text-txt">{req.name}</td>
                  <td className="px-5 py-3 text-sm text-txt-muted max-w-xs truncate">{req.description}</td>
                  <td className="px-5 py-3 text-sm text-txt-muted">
                    {req.is_required ? (
                      <span className="inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Sí</span>
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">No</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-txt-muted max-w-xs truncate">
                    {req.allowed_formats.join(', ')}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingRequirement(req); setShowForm(true) }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeletingId(req.id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <RequirementForm
          requirement={editingRequirement}
          onSave={editingRequirement ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingRequirement(null) }}
        />
      )}

      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-txt">Confirmar eliminación</h3>
            <p className="mb-4 text-sm text-txt-muted">
              ¿Estás seguro de eliminar este requisito? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
