import { useState, useEffect } from 'react'
import { appointmentService } from '../../lib/appointment.service'
import { employeeService } from '../../lib/employee.service'
import type { Appointment } from '../../types/appointment'
import { AppointmentStatusLabels, AppointmentStatusColors } from '../../types/appointment'
import type { EmployeeUser } from '../../lib/employee.service'
import { useNavigate } from 'react-router'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function AppointmentCalendar() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [inspectors, setInspectors] = useState<EmployeeUser[]>([])
  const [selectedInspector, setSelectedInspector] = useState<number | ''>('')

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [inspList] = await Promise.all([
          employeeService.getAllEmployees().then((emps) =>
            emps.filter((e) => e.position === 'INSPECTOR')
          ),
        ])
        if (!cancelled) setInspectors(inspList)
      } catch {
        // silent
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadAppointments() {
      const firstDay = formatDateKey(currentYear, currentMonth, 1)
      const lastDay = formatDateKey(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth))
      try {
        const params: { start: string; end: string; inspector_id?: number } = {
          start: firstDay,
          end: lastDay,
        }
        if (selectedInspector) params.inspector_id = selectedInspector
        const data = await appointmentService.getCalendar(params)
        if (!cancelled) setAppointments(data)
      } catch {
        if (!cancelled) setAppointments([])
      }
    }
    loadAppointments()
    return () => { cancelled = true }
  }, [currentYear, currentMonth, selectedInspector])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const appointmentsByDate: Record<string, Appointment[]> = {}
  for (const a of appointments) {
    if (!appointmentsByDate[a.scheduled_date]) {
      appointmentsByDate[a.scheduled_date] = []
    }
    appointmentsByDate[a.scheduled_date].push(a)
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(null)
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(null)
  }

  function goToToday() {
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDay(formatDateKey(today.getFullYear(), today.getMonth(), today.getDate()))
  }

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('es-PE', {
    month: 'long',
    year: 'numeric',
  })

  const selectedAppointments = selectedDay ? (appointmentsByDate[selectedDay] ?? []) : []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt">Calendario de Citas</h1>
          <p className="text-sm text-txt-muted">Vista general de inspecciones programadas</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedInspector}
            onChange={(e) => setSelectedInspector(e.target.value ? Number(e.target.value) : '')}
            className="rounded-md border border-border bg-white px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todos los inspectores</option>
            {inspectors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.first_name} {i.last_name}
              </option>
            ))}
          </select>
          <button
            onClick={goToToday}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-txt transition hover:bg-surface"
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="rounded p-1 text-txt-muted hover:bg-surface">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-txt capitalize">{monthLabel}</h2>
            <button onClick={nextMonth} className="rounded p-1 text-txt-muted hover:bg-surface">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-medium text-txt-muted">{d}</div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-surface/30" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateKey = formatDateKey(currentYear, currentMonth, day)
              const dayAppts = appointmentsByDate[dateKey] ?? []
              const isToday = dateKey === formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
              const isSelected = dateKey === selectedDay

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(dateKey)}
                  className={`h-24 border border-border p-1 text-left transition ${
                    isSelected ? 'bg-primary/10 ring-2 ring-primary' : isToday ? 'bg-surface' : 'hover:bg-surface/50'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-txt'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayAppts.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${AppointmentStatusColors[a.status]}`}
                      >
                        {a.start_time.slice(0, 5)} {a.inspector_name?.split(' ')[0] ?? ''}
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <span className="text-[10px] text-txt-muted">+{dayAppts.length - 3} más</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-txt">
            {selectedDay
              ? new Date(selectedDay + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })
              : 'Selecciona un día'}
          </h3>

          {!selectedDay ? (
            <p className="text-xs text-txt-muted">Haz clic en un día del calendario para ver las citas.</p>
          ) : selectedAppointments.length === 0 ? (
            <p className="text-xs text-txt-muted">No hay citas programadas para este día.</p>
          ) : (
            <div className="space-y-2">
              {selectedAppointments
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((a) => (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/panel/${a.case_file}`)}
                    className="w-full rounded-md border border-border p-3 text-left transition hover:border-primary/50 hover:bg-surface/50"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium text-txt">
                        {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${AppointmentStatusColors[a.status]}`}>
                        {AppointmentStatusLabels[a.status]}
                      </span>
                    </div>
                    <p className="text-xs text-txt-muted">{a.case_file_tracking} · {a.case_file_procedure_type}</p>
                    {a.establishment_name && (
                      <p className="text-xs text-txt-muted">{a.establishment_name}</p>
                    )}
                    {a.inspector_name && (
                      <p className="text-xs text-txt-muted">Inspector: {a.inspector_name}</p>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
