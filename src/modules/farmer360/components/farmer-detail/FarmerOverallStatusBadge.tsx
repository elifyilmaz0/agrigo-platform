import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, CheckCircle2, TriangleAlert } from 'lucide-react'
import type {
  FarmerOverallStatus,
  FarmerOverallStatusLevel,
} from '../../utils/getFarmerOverallStatus.ts'

type FarmerOverallStatusBadgeProps = {
  status: FarmerOverallStatus
}

const badgeBaseClass =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

const levelStyles: Record<
  FarmerOverallStatusLevel,
  { className: string; Icon: LucideIcon }
> = {
  good: {
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Icon: CheckCircle2,
  },
  follow_up: {
    className: 'border-amber-200 bg-amber-50 text-amber-700',
    Icon: AlertCircle,
  },
  priority: {
    className: 'border-red-200 bg-red-50 text-red-700',
    Icon: TriangleAlert,
  },
}

export default function FarmerOverallStatusBadge({
  status,
}: FarmerOverallStatusBadgeProps) {
  const { className, Icon } = levelStyles[status.level]
  const tooltipId = useId()

  return (
    <button
      type="button"
      className={`group relative ${badgeBaseClass} f360-focus ${className}`}
      aria-label={`${status.label}: ayrıntı için odaklanın`}
      aria-describedby={tooltipId}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {status.label}
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-56 max-w-[min(14rem,calc(100vw-2rem))] rounded-md border border-gray-200 bg-white p-3 text-left shadow-md group-hover:block group-focus-within:block"
      >
        <span className="block text-[11px] leading-relaxed text-gray-600">
          {status.description}
        </span>
      </span>
    </button>
  )
}
