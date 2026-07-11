import type { Establishment } from '../../types/organization'
import {
  BusinessCategory,
  BusinessCategoryLabels,
  EstablishmentSizeLabels,
} from '../../types/organization'

const categoryColors: Record<string, string> = {
  [BusinessCategory.RESTAURANT]: 'bg-red-100 text-red-700',
  [BusinessCategory.COMERCIO]: 'bg-blue-100 text-blue-700',
  [BusinessCategory.ALMACEN]: 'bg-green-100 text-green-700',
  [BusinessCategory.SERVICIOS]: 'bg-purple-100 text-purple-700',
  [BusinessCategory.INDUSTRIA]: 'bg-orange-100 text-orange-700',
}

interface EstablishmentCardProps {
  establishment: Establishment
  onEdit: () => void
  onDelete: () => void
}

export default function EstablishmentCard({
  establishment,
  onEdit,
  onDelete,
}: EstablishmentCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface/50 px-4 py-3">
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-txt">{establishment.name}</h4>
        <p className="truncate text-xs text-txt-muted">{establishment.address}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              categoryColors[establishment.business_category] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {BusinessCategoryLabels[establishment.business_category]}
          </span>
          <span className="inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-txt-muted">
            {EstablishmentSizeLabels[establishment.size]}
          </span>
          <span className="text-xs text-txt-muted">
            {establishment.square_meters} m²
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-txt-muted transition hover:bg-white hover:text-txt"
          aria-label="Editar establecimiento"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-txt-muted transition hover:bg-red-50 hover:text-red-600"
          aria-label="Eliminar establecimiento"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}
