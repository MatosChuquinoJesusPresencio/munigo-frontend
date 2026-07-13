import { useState } from 'react'
import type { EmployeeUser, EmployeeCreateRequest, EmployeeUpdateRequest } from '../../lib/employee.service'
import { PositionLabels, Position, Area, AreaLabels } from '../../types/auth'
import { DocumentType } from '../../types/auth'

interface EmployeeFormProps {
  employee?: EmployeeUser | null
  onSave: (data: EmployeeCreateRequest | EmployeeUpdateRequest) => Promise<void>
  onCancel: () => void
}

const PositionEntries = Object.entries(PositionLabels) as [Position, string][]
const AreaEntries = Object.entries(AreaLabels) as [Area, string][]
const DocumentTypeEntries = Object.entries(DocumentType) as [string, string][]

export default function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const isEditing = !!employee

  const [firstName, setFirstName] = useState(employee?.first_name || '')
  const [lastName, setLastName] = useState(employee?.last_name || '')
  const [email, setEmail] = useState(employee?.email || '')
  const [password, setPassword] = useState('')
  const [documentType, setDocumentType] = useState('DNI')
  const [documentNumber, setDocumentNumber] = useState('')
  const [position, setPosition] = useState(employee?.position || 'FUNCIONARIO')
  const [area, setArea] = useState(employee?.area || 'OTRO')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await onSave({ position, area } as EmployeeUpdateRequest)
      } else {
        if (!firstName || !lastName || !email || !password || !documentNumber) {
          setError('Todos los campos son obligatorios.')
          setSaving(false)
          return
        }
        await onSave({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          document_type: documentType,
          document_number: documentNumber,
          position,
          area,
        } as EmployeeCreateRequest)
      }
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
          {isEditing ? 'Editar empleado' : 'Crear empleado'}
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-txt">Nombre</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-txt">Apellido</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-txt">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-txt">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  minLength={6}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-txt">Tipo de documento</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                  >
                    {DocumentTypeEntries.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-txt">N° Documento</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Cargo</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                {PositionEntries.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                {AreaEntries.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
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
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
