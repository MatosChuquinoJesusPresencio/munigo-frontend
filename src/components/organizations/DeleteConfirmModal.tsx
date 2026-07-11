interface DeleteConfirmModalProps {
  isOpen: boolean
  title: string
  itemName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  async function handleConfirm() {
    await onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-semibold text-txt">{title}</h2>
        <p className="mb-6 text-sm text-txt-muted">
          Esta acción no se puede deshacer. Se eliminará{' '}
          <span className="font-medium text-txt">{itemName}</span> permanentemente.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-txt-muted transition hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
