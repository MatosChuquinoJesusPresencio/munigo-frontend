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

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm">
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${AppointmentStatusColors[appointment.status]}`}>
            {AppointmentStatusLabels[appointment.status]}
          </span>
          {appointment.case_file_tracking && (
            <span className="text-xs text-txt-muted">{appointment.case_file_tracking}</span>
          )}
        </div>

        <h3 className="text-base font-semibold text-txt capitalize">{date}</h3>
        <p className="text-sm text-txt-muted">{startTime} - {endTime}</p>

        {appointment.inspector_name && (
          <p className="mt-1 text-sm text-txt-muted">Inspector: {appointment.inspector_name}</p>
        )}
      </div>
    </div>
  )
}
