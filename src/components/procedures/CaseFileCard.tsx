import { useNavigate } from 'react-router'
import type { CaseFile } from '../../types/procedure'
import { CaseFileStatusLabels, CaseFileStatusColors, ProcedureTypeLabels, RiskLevelLabels, RiskLevelColors } from '../../types/procedure'

interface CaseFileCardProps {
  caseFile: CaseFile
  onDelete: () => void
}

export default function CaseFileCard({ caseFile, onDelete }: CaseFileCardProps) {
  const navigate = useNavigate()
  const isDraft = caseFile.status === 'BORRADOR'
  const createdDate = new Date(caseFile.created_at).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm">
      <div className="px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${CaseFileStatusColors[caseFile.status]}`}>
            {CaseFileStatusLabels[caseFile.status]}
          </span>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${RiskLevelColors[caseFile.risk_level]}`}>
            Riesgo: {RiskLevelLabels[caseFile.risk_level]}
          </span>
        </div>

        <h3 className="text-base font-semibold text-txt">{caseFile.tracking_code}</h3>
        <p className="text-sm text-txt-muted">{ProcedureTypeLabels[caseFile.procedure_type]}</p>

        <div className="mt-2 flex items-center gap-4 text-xs text-txt-muted">
          <span>{caseFile.company_name}</span>
          <span>•</span>
          <span>{caseFile.establishment_name}</span>
          <span>•</span>
          <span>{createdDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <button
          onClick={() => navigate(`/tramites/${caseFile.id}`)}
          className="text-sm font-medium text-primary transition hover:underline"
        >
          Ver requisitos
        </button>
        {isDraft && (
          <button
            onClick={onDelete}
            className="rounded-md p-1.5 text-txt-muted transition hover:bg-red-50 hover:text-red-600"
            aria-label="Eliminar trámite"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
