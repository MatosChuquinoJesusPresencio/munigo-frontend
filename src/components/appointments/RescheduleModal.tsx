import { useState } from 'react'
import { appointmentService } from '../../lib/appointment.service'

interface RescheduleModalProps {
  isOpen: boolean
  appointmentId: number
  trackingCode: string
  onConfirm: () => void
  onClose: () => void
}

export default function RescheduleModal({
  isOpen,
  appointmentId,
  trackingCode,
  onConfirm,
  onClose,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit() {
    if (!newDate || !newStart || !newEnd || !reason.trim()) {
      setError('Todos los campos son obligatorios.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await appointmentService.reschedule(appointmentId, {
        new_date: newDate,
        new_start_time: newStart,
        new_end_time: newEnd,
        reason: reason.trim(),
      })
      onConfirm()
      onClose()
    } catch {
      setError('Error al solicitar reprogramación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-white shadow-lg">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-txt">Solicitar reprogramación</h2>
          <p className="text-sm text-txt-muted">
            Trámite: <span className="font-medium text-txt">{trackingCode}</span>
          </p>
        </div>

        <div className="space-y-4 px-6 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-txt">
              Nueva fecha <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">
                Hora inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-txt">
                Hora fin <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-txt">
              Motivo <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Describe por qué necesitas reprogramar..."
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
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
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Solicitar reprogramación'}
          </button>
        </div>
      </div>
    </div>
  )
}
