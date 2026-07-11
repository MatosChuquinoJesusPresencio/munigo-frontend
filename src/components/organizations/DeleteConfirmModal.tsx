import { useState } from 'react'
import { ApiClientError } from '../../lib/api'

interface DeleteConfirmModalProps {
  isOpen: boolean
  title: string
  itemName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  async function handleConfirm() {
    setError(null)
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      if (err instanceof ApiClientError) {
        const data = err.data
        if (typeof data.detail === 'string') {
          setError(data.detail)
        } else {
          setError('Error al eliminar. Intenta nuevamente.')
        }
      } else {
        setError('Error al eliminar. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-semibold text-txt">{title}</h2>
        <p className="mb-6 text-sm text-txt-muted">
          Esta acción no se puede deshacer. Se eliminará{' '}
          <span className="font-medium text-txt">{itemName}</span> permanentemente.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-txt-muted transition hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
