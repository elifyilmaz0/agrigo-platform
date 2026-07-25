import { MinusCircle } from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'
import {
  countMissingProfileByCategory,
  formatMissingProfileDescription,
  formatMissingProfilePriorityHint,
  getMissingProfileItems,
} from '../../utils/getMissingProfileItems.ts'
import InfoTooltip from '../shared/InfoTooltip.tsx'
import { TOOLTIP_COPY } from '../shared/explainabilityCopy.ts'

type CriticalMissingInfoCardProps = {
  farmer: Farmer
}

export default function CriticalMissingInfoCard({ farmer }: CriticalMissingInfoCardProps) {
  const missingItems = getMissingProfileItems(farmer).filter(
    (item) =>
      item.category === 'always_critical' || item.category === 'conditional_critical',
  )
  const { alwaysCritical, conditionalCritical, total } =
    countMissingProfileByCategory(missingItems)
  const hasMissingFields = total > 0

  const description = formatMissingProfileDescription(missingItems)
  const priorityHint = formatMissingProfilePriorityHint(
    alwaysCritical,
    conditionalCritical,
    total,
  )

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <h3 className="text-[11px] font-semibold tracking-wide text-gray-500">
          KRİTİK EKSİK BİLGİ
        </h3>
        <InfoTooltip
          label="Kritik eksik bilgi hakkında bilgi"
          text={TOOLTIP_COPY.criticalMissing}
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-end gap-2">
          <p
            className={`text-3xl font-bold leading-none ${
              hasMissingFields ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {total}
          </p>
          <p className="pb-0.5 text-[11px] text-gray-500">
            {hasMissingFields ? 'eksik alan' : 'Kritik eksik bulunmuyor'}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-gray-500">{priorityHint}</p>

        <p className="mt-1.5 break-words text-xs leading-relaxed text-gray-600">
          {description}
        </p>

        {hasMissingFields && (
          <ul className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            {missingItems.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <MinusCircle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 break-words text-[13px] font-medium text-gray-800">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
