import { useState } from 'react'
import type { Company } from '../../types/organization'

interface CompanyModalProps {
  isOpen: boolean
  company: Company | null
  onClose: () => void
  onSubmit: (data: { business_name: string; ruc: string }) => Promise<void>
}

export default function CompanyModal({
  isOpen,
  company,
  onClose,
  onSubmit,
}: CompanyModalProps) {
  const [businessName, setBusinessName] = useState(company?.business_name ?? '')
  const [ruc, setRuc] = useState(company?.ruc ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const isEditing = company !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!businessName.trim()) {
      setError('La razón social es requerida')
      return
    }

    if (ruc.length !== 11 || !/^\d+$/.test(ruc)) {
      setError('El RUC debe tener exactamente 11 dígitos')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ business_name: businessName.trim(), ruc })
      onClose()
    } catch {
      setError('Ocurrió un error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-txt">
          {isEditing ? 'Editar empresa' : 'Registrar empresa'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="business_name" className="mb-1 block text-sm font-medium text-txt">
              Razón Social
            </label>
            <input
              id="business_name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary"
              placeholder="Nombre de la empresa"
            />
          </div>

          <div>
            <label htmlFor="ruc" className="mb-1 block text-sm font-medium text-txt">
              RUC
            </label>
            <input
              id="ruc"
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="w-full rounded-md border border-border px-3 py-2 font-mono text-sm text-txt outline-none transition focus:border-primary"
              placeholder="11 dígitos"
              inputMode="numeric"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
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
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
