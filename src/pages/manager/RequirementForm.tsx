import { useState } from 'react'
import type { Requirement } from '../../types/procedure'
import type { RequirementCreateRequest, RequirementUpdateRequest } from '../../lib/requirement.service'
import { ProcedureTypeLabels, ProcedureType } from '../../types/procedure'

interface RequirementFormProps {
  requirement?: Requirement | null
  onSave: (data: RequirementCreateRequest | RequirementUpdateRequest) => Promise<void>
  onCancel: () => void
}

const ProcedureTypeEntries = Object.entries(ProcedureTypeLabels) as [string, string][]

export default function RequirementForm({ requirement, onSave, onCancel }: RequirementFormProps) {
  const isEditing = !!requirement

  const [name, setName] = useState(requirement?.name || '')
  const [description, setDescription] = useState(requirement?.description || '')
  const [isRequired, setIsRequired] = useState(requirement?.is_required ?? true)
  const [procedureType, setProcedureType] = useState<ProcedureType>(requirement?.procedure_type || ProcedureType.ITSE)
  const [formats, setFormats] = useState(requirement?.allowed_formats?.join(', ') || 'application/pdf, image/png, image/jpeg')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const allowedFormats = formats.split(',').map((f) => f.trim()).filter(Boolean)
      await onSave({
        name,
        description,
        is_required: isRequired,
        procedure_type: procedureType,
        allowed_formats: allowedFormats,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-lg rounded-lg border border-border bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-txt">
          {isEditing ? 'Editar requisito' : 'Crear requisito'}
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Tipo de trámite</label>
              <select
                value={procedureType}
                onChange={(e) => setProcedureType(e.target.value as ProcedureType)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                {ProcedureTypeEntries.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Requerido</label>
              <select
                value={isRequired ? 'true' : 'false'}
                onChange={(e) => setIsRequired(e.target.value === 'true')}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-txt">Formatos permitidos</label>
            <input
              type="text"
              value={formats}
              onChange={(e) => setFormats(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
              placeholder="application/pdf, image/png, image/jpeg"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear requisito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
