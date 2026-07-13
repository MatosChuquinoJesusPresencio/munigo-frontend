import { useState } from 'react'
import { appointmentService } from '../../lib/appointment.service'
import type { Appointment } from '../../types/appointment'

interface RespondRescheduleModalProps {
  isOpen: boolean
  appointment: Appointment | null
  onConfirm: () => void
  onClose: () => void
}

export default function RespondRescheduleModal({
  isOpen,
  appointment,
  onConfirm,
  onClose,
}: RespondRescheduleModalProps) {
  const [accept, setAccept] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !appointment) return null

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      if (accept) {
        if (!newDate || !newStart || !newEnd) {
          setError('Fecha y horas son obligatorias al aceptar.')
          setLoading(false)
          return
        }
        await appointmentService.respondReschedule(appointment!.id, {
          accept: true,
          new_date: newDate,
          new_start_time: newStart,
          new_end_time: newEnd,
        })
      } else {
        await appointmentService.respondReschedule(appointment!.id, {
          accept: false,
        })
      }
      onConfirm()
      onClose()
    } catch {
      setError('Error al responder la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  const requestNote = appointment.notes ?? ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-white shadow-lg">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-txt">Responder reprogramación</h2>
          <p className="text-sm text-txt-muted">
            Trámite: <span className="font-medium text-txt">{appointment.case_file_tracking}</span>
          </p>
        </div>

        <div className="space-y-4 px-6 py-4">
          {requestNote && (
            <div className="rounded-md bg-orange-50 px-3 py-2">
              <p className="text-xs font-medium text-orange-700">Solicitud del ciudadano:</p>
              <p className="text-xs text-orange-600">{requestNote}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setAccept(true)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                accept
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-border text-txt hover:bg-surface'
              }`}
            >
              Aceptar
            </button>
            <button
              onClick={() => setAccept(false)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                !accept
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-border text-txt hover:bg-surface'
              }`}
            >
              Rechazar
            </button>
          </div>

          {accept && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-txt">Nueva fecha</label>
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
                  <label className="mb-1 block text-sm font-medium text-txt">Hora inicio</label>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-txt">Hora fin</label>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

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
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
              accept ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Procesando...' : accept ? 'Aceptar reprogramación' : 'Rechazar'}
          </button>
        </div>
      </div>
    </div>
  )
}
