import type { Appointment } from '../../types/appointment'
import { AppointmentStatusLabels, AppointmentStatusColors } from '../../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
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
      </div>
    </div>
  )
}
