import { useState } from 'react'

interface CancelAppointmentModalProps {
  isOpen: boolean
  trackingCode: string
  onConfirm: (reason: string) => Promise<void>
  onClose: () => void
}

export default function CancelAppointmentModal({
  isOpen,
  trackingCode,
  onConfirm,
  onClose,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit() {
    if (!reason.trim()) {
      setError('El motivo es obligatorio.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onConfirm(reason.trim())
      setReason('')
      onClose()
    } catch {
      setError('Error al cancelar la cita.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-white shadow-lg">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-txt">Cancelar cita</h2>
          <p className="text-sm text-txt-muted">
            Trámite: <span className="font-medium text-txt">{trackingCode}</span>
          </p>
        </div>

        <div className="px-6 py-4">
          <label className="mb-1 block text-sm font-medium text-txt">
            Motivo de cancelación <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Describe el motivo de la cancelación..."
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md px-4 py-2 text-sm font-medium text-txt-muted transition hover:bg-surface"
          >
            Volver
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cancelando...' : 'Cancelar cita'}
          </button>
        </div>
      </div>
    </div>
  )
}
