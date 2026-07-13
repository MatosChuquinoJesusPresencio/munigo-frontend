import { AppointmentStatus } from '../../types/appointment'
import type { Appointment } from '../../types/appointment'
import { AppointmentStatusLabels, AppointmentStatusColors } from '../../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
  onConfirm?: (id: number) => void
  onCancel?: (id: number) => void
  onReschedule?: (id: number) => void
  loading?: boolean
}

export default function AppointmentCard({
  appointment,
  onConfirm,
  onCancel,
  onReschedule,
  loading,
}: AppointmentCardProps) {
  const date = new Date(appointment.scheduled_date).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const startTime = appointment.start_time.slice(0, 5)
  const endTime = appointment.end_time.slice(0, 5)

  const subtitle = [appointment.case_file_tracking, appointment.case_file_procedure_type]
    .filter(Boolean)
    .join(' · ')

  const canConfirm = appointment.status === AppointmentStatus.PENDIENTE_CONFIRMACION
  const canReschedule = appointment.status === AppointmentStatus.CONFIRMADA
  const canCancel = appointment.status === AppointmentStatus.PENDIENTE_CONFIRMACION
    || appointment.status === AppointmentStatus.CONFIRMADA
  const showReschedulePending = appointment.status === AppointmentStatus.PENDIENTE_REPROGRAMACION
  const showCancelled = appointment.status === AppointmentStatus.CANCELADA

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm">
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${AppointmentStatusColors[appointment.status]}`}>
            {AppointmentStatusLabels[appointment.status]}
          </span>
          {subtitle && (
            <span className="text-xs text-txt-muted">{subtitle}</span>
          )}
        </div>

        {appointment.establishment_name && (
          <p className="mb-1 text-sm font-semibold text-txt">{appointment.establishment_name}</p>
        )}

        <h3 className="text-sm font-medium text-txt capitalize">{date}</h3>
        <p className="text-sm text-txt-muted">{startTime} - {endTime}</p>

        {appointment.inspector_name && (
          <p className="mt-1 text-sm text-txt-muted">Inspector: {appointment.inspector_name}</p>
        )}

        {appointment.notes && (
          <p className="mt-2 rounded-md bg-surface px-3 py-2 text-xs text-txt-muted">
            {appointment.notes}
          </p>
        )}

        {showCancelled && appointment.cancel_reason && (
          <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            Motivo: {appointment.cancel_reason}
          </p>
        )}

        {showReschedulePending && (
          <p className="mt-2 rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-600">
            Esperando respuesta del funcionario...
          </p>
        )}

        {(canConfirm || canReschedule || canCancel) && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
            {canConfirm && onConfirm && (
              <button
                onClick={() => onConfirm(appointment.id)}
                disabled={loading}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                Confirmar
              </button>
            )}
            {canReschedule && onReschedule && (
              <button
                onClick={() => onReschedule(appointment.id)}
                disabled={loading}
                className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                Reprogramar
              </button>
            )}
            {canCancel && onCancel && (
              <button
                onClick={() => onCancel(appointment.id)}
                disabled={loading}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
