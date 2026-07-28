import { useId } from 'react'
import { Info } from 'lucide-react'

type InfoTooltipProps = {
  label: string
  text: string
  side?: 'left' | 'right'
  className?: string
}

export default function InfoTooltip({
  label,
  text,
  side = 'left',
  className = '',
}: InfoTooltipProps) {
  const tooltipId = useId()
  const panelPosition = side === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'

  return (
    <button
      type="button"
      className={`group relative inline-flex items-center rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      aria-label={label}
      aria-describedby={tooltipId}
    >
      <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-20 mb-2 hidden w-64 max-w-[min(16rem,calc(100vw-2rem))] rounded-md border border-slate-200 bg-white p-3 text-left shadow-md group-hover:block group-focus-within:block ${panelPosition}`}
      >
        <span className="block text-[11px] leading-relaxed text-slate-600">
          {text}
        </span>
      </span>
    </button>
  )
}
