export const AppointmentStatus = {
  PENDIENTE_CONFIRMACION: 'PENDIENTE_CONFIRMACION',
  PROGRAMADA: 'PROGRAMADA',
  CONFIRMADA: 'CONFIRMADA',
  PENDIENTE_REPROGRAMACION: 'PENDIENTE_REPROGRAMACION',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
} as const

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDIENTE_CONFIRMACION]: 'Pendiente de confirmación',
  [AppointmentStatus.PROGRAMADA]: 'Programada',
  [AppointmentStatus.CONFIRMADA]: 'Confirmada',
  [AppointmentStatus.PENDIENTE_REPROGRAMACION]: 'Pendiente de reprogramación',
  [AppointmentStatus.COMPLETADA]: 'Completada',
  [AppointmentStatus.CANCELADA]: 'Cancelada',
}

export const AppointmentStatusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDIENTE_CONFIRMACION]: 'bg-yellow-100 text-yellow-700',
  [AppointmentStatus.PROGRAMADA]: 'bg-blue-100 text-blue-700',
  [AppointmentStatus.CONFIRMADA]: 'bg-green-100 text-green-700',
  [AppointmentStatus.PENDIENTE_REPROGRAMACION]: 'bg-orange-100 text-orange-700',
  [AppointmentStatus.COMPLETADA]: 'bg-emerald-100 text-emerald-700',
  [AppointmentStatus.CANCELADA]: 'bg-red-100 text-red-700',
}

export interface Appointment {
  id: number
  case_file: number
  case_file_tracking?: string
  case_file_procedure_type?: string
  establishment_name?: string
  inspector_name?: string
  scheduled_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes?: string
  cancel_reason?: string
  created_at?: string
}
