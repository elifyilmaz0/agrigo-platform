import type { Farmer } from '../../types/farmer.ts'
import {
  calculateProfileCompleteness,
  COMPLETENESS_STATUS_LABELS,
  type CompletenessStatus,
} from '../../utils/calculateProfileCompleteness.ts'
import InfoTooltip from '../shared/InfoTooltip.tsx'
import { TOOLTIP_COPY } from '../shared/explainabilityCopy.ts'

type ProfileCompletenessCardProps = {
  farmer: Farmer
}

const statusStyles: Record<
  CompletenessStatus,
  { text: string; bar: string; track: string }
> = {
  sufficient: {
    text: 'text-emerald-700',
    bar: 'bg-emerald-700',
    track: 'bg-emerald-100',
  },
  partial: {
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    track: 'bg-amber-100',
  },
  insufficient: {
    text: 'text-red-700',
    bar: 'bg-red-500',
    track: 'bg-red-100',
  },
}

export default function ProfileCompletenessCard({ farmer }: ProfileCompletenessCardProps) {
  const results = calculateProfileCompleteness(farmer)

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <h3 className="text-[11px] font-semibold tracking-wide text-gray-500">
          PROFİL TAMLIĞI — AMACA GÖRE
        </h3>
        <InfoTooltip
          label="Profil tamlığı hakkında bilgi"
          text={TOOLTIP_COPY.profileCompleteness}
        />
      </div>

      <ul className="mt-3 flex flex-1 flex-col justify-center space-y-2.5">
        {results.map((purpose) => {
          const styles = statusStyles[purpose.status]
          const statusLabel = COMPLETENESS_STATUS_LABELS[purpose.status]

          return (
            <li key={purpose.key} className="space-y-1">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="w-[8.5rem] shrink-0 truncate text-[13px] text-gray-700">
                  {purpose.label}
                </span>
                <div
                  className={`h-1.5 min-w-0 flex-1 overflow-hidden rounded-full ${styles.track}`}
                >
                  <div
                    className={`h-full rounded-full ${styles.bar}`}
                    style={{ width: `${purpose.percentage}%` }}
                  />
                </div>
                <span
                  className={`w-14 shrink-0 text-right text-[11px] font-medium ${styles.text}`}
                >
                  {statusLabel}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
