import { useState, useEffect } from 'react'
import { appointmentService } from '../../lib/appointment.service'
import type { Appointment } from '../../types/appointment'
import { AppointmentStatus } from '../../types/appointment'
import AppointmentCard from '../../components/appointments/AppointmentCard'

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await appointmentService.getAll()
        if (!cancelled) setAppointments(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const now = new Date()
  const upcoming = appointments
    .filter((a) => a.status === AppointmentStatus.PROGRAMADA && new Date(a.scheduled_date) >= now)
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())

  const past = appointments
    .filter((a) => a.status !== AppointmentStatus.PROGRAMADA || new Date(a.scheduled_date) < now)
    .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Mis Citas</h1>
        <p className="text-sm text-txt-muted">Citas programadas para inspecciones</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando citas...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-txt">No tienes citas programadas</h3>
          <p className="max-w-sm text-sm text-txt-muted">
            Cuando se programe una inspección para tu trámite, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold text-txt-muted">Próximas</h2>
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold text-txt-muted">Anteriores</h2>
              <div className="space-y-3">
                {past.map((a) => (
                  <AppointmentCard key={a.id} appointment={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
