import type { Company } from '../../types/organization'

interface CompanyCardProps {
  company: Company
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function CompanyCard({
  company,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: CompanyCardProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-5 shadow-sm transition ${
        isSelected ? 'border-l-4 border-l-primary border-t-border border-r-border border-b-border' : 'border-border'
      }`}
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-txt">{company.business_name}</h3>
        <p className="font-mono text-sm text-txt-muted">{company.ruc}</p>
      </div>

      <div className="mb-4">
        <span className="inline-block rounded-full bg-surface px-3 py-1 text-xs font-medium text-txt-muted">
          {company.establishments.length} establecimiento{company.establishments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSelect}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-hover"
        >
          Ver establecimientos
        </button>
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-txt-muted transition hover:bg-surface hover:text-txt"
          aria-label="Editar empresa"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-txt-muted transition hover:bg-red-50 hover:text-red-600"
          aria-label="Eliminar empresa"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}
