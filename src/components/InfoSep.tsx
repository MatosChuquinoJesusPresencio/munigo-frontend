interface InfoSepProps {
  items: (string | undefined | null | false)[]
}

export default function InfoSep({ items }: InfoSepProps) {
  const filtered = items.filter(Boolean) as string[]
  if (filtered.length === 0) return null
  return (
    <div className="flex items-center gap-4 text-xs text-txt-muted">
      {filtered.map((item, i) => (
        <span key={i} className="flex items-center gap-4">
          {i > 0 && <span>•</span>}
          <span>{item}</span>
        </span>
      ))}
    </div>
  )
}
