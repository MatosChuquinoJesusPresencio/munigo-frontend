export const AppointmentStatus = {
  PROGRAMADA: 'PROGRAMADA',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA',
} as const

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PROGRAMADA]: 'Programada',
  [AppointmentStatus.COMPLETADA]: 'Completada',
  [AppointmentStatus.CANCELADA]: 'Cancelada',
}

export const AppointmentStatusColors: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PROGRAMADA]: 'bg-blue-100 text-blue-700',
  [AppointmentStatus.COMPLETADA]: 'bg-green-100 text-green-700',
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
}
