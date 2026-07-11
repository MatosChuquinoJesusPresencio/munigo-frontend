import type { Notification } from '../../types/notification'

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: number) => void
}

export default function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const sentDate = new Date(notification.sent_at).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm transition ${
        notification.is_read ? 'border-border' : 'border-primary/30'
      }`}
    >
      <div className="flex items-start gap-4 px-5 py-4">
        {!notification.is_read && (
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
        )}

        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-semibold ${notification.is_read ? 'text-txt-muted' : 'text-txt'}`}>
            {notification.title}
          </h3>
          <p className="mt-1 text-sm text-txt-muted">{notification.message}</p>
          <p className="mt-2 text-xs text-txt-muted">{sentDate}</p>
        </div>

        {!notification.is_read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="shrink-0 rounded-md p-1.5 text-txt-muted transition hover:bg-surface hover:text-txt"
            aria-label="Marcar como leída"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
