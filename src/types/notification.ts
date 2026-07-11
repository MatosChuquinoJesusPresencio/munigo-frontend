export interface Notification {
  id: number
  title: string
  message: string
  case_file: number | null
  is_read: boolean
  sent_at: string
}
