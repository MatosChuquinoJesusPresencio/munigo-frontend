import { useState, useEffect } from 'react'
import { notificationService } from '../../lib/notification.service'
import type { Notification } from '../../types/notification'
import NotificationCard from '../../components/notifications/NotificationCard'
import NotificationEmptyState from '../../components/notifications/NotificationEmptyState'

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await notificationService.getAll()
        if (!cancelled) setNotifications(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  async function handleMarkAsRead(id: number) {
    await notificationService.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  async function handleMarkAllAsRead() {
    await notificationService.markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt">Mis Notificaciones</h1>
          <p className="text-sm text-txt-muted">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
              : 'No tienes notificaciones sin leer'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="rounded-md px-4 py-2 text-sm font-medium text-primary transition hover:bg-surface"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando notificaciones...</p>
        </div>
      ) : notifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
