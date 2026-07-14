import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { employeeService } from '../../lib/employee.service'
import { appointmentService } from '../../lib/appointment.service'
import type { CaseFile } from '../../types/procedure'
import type { Appointment } from '../../types/appointment'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'
import { AppointmentStatusLabels, AppointmentStatusColors } from '../../types/appointment'
import InfoSep from '../../components/InfoSep'
import RespondRescheduleModal from '../../components/appointments/RespondRescheduleModal'

export default function Panel() {
  const navigate = useNavigate()
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([])
  const [rescheduleAppts, setRescheduleAppts] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [cfData, apptData] = await Promise.all([
          employeeService.getPendingReview(),
          appointmentService.getAll(),
        ])
        if (!cancelled) {
          setCaseFiles(cfData)
          setRescheduleAppts(apptData.filter((a) => a.status === 'PENDIENTE_REPROGRAMACION'))
        }
      } catch {
        if (!cancelled) setError('Error al cargar los datos del panel.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function reloadReschedule() {
    const apptData = await appointmentService.getAll()
    setRescheduleAppts(apptData.filter((a) => a.status === 'PENDIENTE_REPROGRAMACION'))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Panel de Revisión</h1>
        <p className="text-sm text-txt-muted">
          Trámites pendientes de revisión
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium underline">
            Cerrar
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando datos...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {rescheduleAppts.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-txt-muted">Solicitudes de reprogramación</h2>
              <div className="space-y-3">
                {rescheduleAppts.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border border-orange-200 bg-orange-50 shadow-sm"
                  >
                    <div className="px-5 py-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${AppointmentStatusColors[a.status]}`}>
                          {AppointmentStatusLabels[a.status]}
                        </span>
                        <span className="text-xs text-txt-muted">
                          {a.scheduled_date} · {a.start_time?.slice(0, 5)} - {a.end_time?.slice(0, 5)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-txt">{a.case_file_tracking}</h3>
                      <p className="text-sm text-txt-muted">{a.case_file_procedure_type}</p>
                      {a.notes && (
                        <p className="mt-1 text-xs text-orange-700">{a.notes}</p>
                      )}
                    </div>
                    <div className="border-t border-orange-200 px-5 py-3 bg-orange-100/50">
                      <button
                        onClick={() => setRescheduleTarget(a)}
                        className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                      >
                        Responder solicitud
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold text-txt-muted">Trámites pendientes de revisión</h2>
            {caseFiles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
                <svg className="mx-auto mb-4 h-12 w-12 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-2 text-lg font-semibold text-txt">No hay trámites pendientes</h3>
                <p className="text-sm text-txt-muted">
                  Cuando los ciudadanos envíen trámites, aparecerán aquí para su revisión.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {caseFiles.map((cf) => {
                  const createdDate = new Date(cf.created_at).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })

                  return (
                    <div
                      key={cf.id}
                      className="cursor-pointer rounded-lg border border-border bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
                      onClick={() => navigate(`/panel/${cf.id}`)}
                    >
                      <div className="px-5 py-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CaseFileStatusColors[cf.status]}`}>
                            {CaseFileStatusLabels[cf.status]}
                          </span>
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RiskLevelColors[cf.risk_level]}`}>
                            Riesgo: {RiskLevelLabels[cf.risk_level]}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-txt">{cf.tracking_code}</h3>
                        <p className="text-sm text-txt-muted">{ProcedureTypeLabels[cf.procedure_type]}</p>

                        <InfoSep items={[cf.company_name, cf.establishment_name, createdDate]} />
                      </div>

                      <div className="border-t border-border px-5 py-3 bg-surface/30">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/panel/${cf.id}`) }}
                          className="w-full rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                        >
                          Revisar trámite
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}

      <RespondRescheduleModal
        isOpen={!!rescheduleTarget}
        appointment={rescheduleTarget}
        onConfirm={reloadReschedule}
        onClose={() => setRescheduleTarget(null)}
      />
    </div>
  )
}
