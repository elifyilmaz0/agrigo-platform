type MetricCardProps = {
  label: string
  value: string | number
  hint?: string
  tooltip?: React.ReactNode
  onClick?: () => void
  accent?: 'default' | 'emerald' | 'amber' | 'sky' | 'orange' | 'slate'
}

const accentStyles = {
  default: 'border-slate-200 bg-white hover:border-slate-300',
  emerald: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300',
  amber: 'border-amber-200 bg-amber-50/40 hover:border-amber-300',
  sky: 'border-sky-200 bg-sky-50/40 hover:border-sky-300',
  orange: 'border-orange-200 bg-orange-50/40 hover:border-orange-300',
  slate: 'border-slate-200 bg-slate-50/60 hover:border-slate-300',
}

export default function MetricCard({
  label,
  value,
  hint,
  tooltip,
  onClick,
  accent = 'default',
}: MetricCardProps) {
  const baseClass = `rounded-lg border px-4 py-3 text-left transition-colors ${accentStyles[accent]} ${
    onClick ? 'cursor-pointer' : ''
  }`
  const content = (
    <>
      <div className="flex items-center gap-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {tooltip}
      </div>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{hint}</p>
      ) : null}
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClass} w-full`}>
        {content}
      </button>
    )
  }

  return <div className={baseClass}>{content}</div>
}
