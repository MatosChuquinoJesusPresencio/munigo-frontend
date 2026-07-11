import { useState } from 'react'
import type { Establishment } from '../../types/organization'
import { BusinessCategory, BusinessCategoryLabels } from '../../types/organization'

interface EstablishmentModalProps {
  isOpen: boolean
  establishment: Establishment | null
  companyId: number
  onClose: () => void
  onSubmit: (data: {
    company: number
    name: string
    address: string
    business_category: BusinessCategory
    square_meters: number
  }) => Promise<void>
}

export default function EstablishmentModal({
  isOpen,
  establishment,
  companyId,
  onClose,
  onSubmit,
}: EstablishmentModalProps) {
  const [name, setName] = useState(establishment?.name ?? '')
  const [address, setAddress] = useState(establishment?.address ?? '')
  const [category, setCategory] = useState<BusinessCategory>(
    establishment?.business_category ?? BusinessCategory.COMERCIO,
  )
  const [squareMeters, setSquareMeters] = useState(
    establishment?.square_meters?.toString() ?? '',
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const isEditing = establishment !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!address.trim()) {
      setError('La dirección es requerida')
      return
    }
    const m2 = parseInt(squareMeters, 10)
    if (!squareMeters || isNaN(m2) || m2 <= 0) {
      setError('Los metros cuadrados deben ser un número positivo')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        company: companyId,
        name: name.trim(),
        address: address.trim(),
        business_category: category,
        square_meters: m2,
      })
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
          {isEditing ? 'Editar establecimiento' : 'Registrar establecimiento'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="est-name" className="mb-1 block text-sm font-medium text-txt">
              Nombre
            </label>
            <input
              id="est-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary"
              placeholder="Nombre del establecimiento"
            />
          </div>

          <div>
            <label htmlFor="est-address" className="mb-1 block text-sm font-medium text-txt">
              Dirección
            </label>
            <input
              id="est-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary"
              placeholder="Dirección del establecimiento"
            />
          </div>

          <div>
            <label htmlFor="est-category" className="mb-1 block text-sm font-medium text-txt">
              Categoría de negocio
            </label>
            <select
              id="est-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BusinessCategory)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary"
            >
              {Object.values(BusinessCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {BusinessCategoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="est-m2" className="mb-1 block text-sm font-medium text-txt">
              Metros cuadrados (m²)
            </label>
            <input
              id="est-m2"
              type="number"
              min={1}
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary"
              placeholder="Ej: 120"
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
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear establecimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
