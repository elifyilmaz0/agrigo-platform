import { useId } from 'react'
import { Info } from 'lucide-react'

type InfoTooltipProps = {
  label: string
  text: string
  /** Optional visible hint next to the icon */
  hint?: string
  side?: 'left' | 'right'
  className?: string
}

export default function InfoTooltip({
  label,
  text,
  hint,
  side = 'left',
  className = '',
}: InfoTooltipProps) {
  const tooltipId = useId()
  const panelPosition =
    side === 'right'
      ? 'right-0 left-auto'
      : 'left-0 right-auto'

  return (
    <button
      type="button"
      className={`group relative inline-flex items-center gap-1 rounded-md text-left f360-focus ${className}`}
      aria-label={label}
      aria-describedby={tooltipId}
    >
      <Info className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
      {hint ? <span className="text-[11px] text-gray-400">{hint}</span> : null}
      <span
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-20 mb-2 hidden w-56 max-w-[min(14rem,calc(100vw-2rem))] rounded-md border border-gray-200 bg-white p-3 text-left shadow-md group-hover:block group-focus-within:block ${panelPosition}`}
      >
        <span className="block text-[11px] leading-relaxed text-gray-600">{text}</span>
      </span>
    </button>
  )
}
