import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Farmer, MissingProfileCategory, MissingProfileItem } from '../../types/farmer.ts'
import { getMissingProfileItems } from '../../utils/getMissingProfileItems.ts'
import InfoTooltip from '../shared/InfoTooltip.tsx'
import { TOOLTIP_COPY } from '../shared/explainabilityCopy.ts'

type MissingProfileSectionProps = {
  farmer: Farmer
}

const CATEGORY_ORDER: MissingProfileCategory[] = [
  'always_critical',
  'conditional_critical',
  'complementary',
]

const CATEGORY_META: Record<
  MissingProfileCategory,
  {
    label: string
    tooltip: string
    sectionClass: string
    labelClass: string
    itemClass: string
  }
> = {
  always_critical: {
    label: 'HER ZAMAN KRİTİK',
    tooltip: TOOLTIP_COPY.alwaysCritical,
    sectionClass: 'rounded-xl border border-red-200/80 bg-red-50/70 p-3',
    labelClass: 'text-red-700',
    itemClass: 'rounded-lg border border-red-100 bg-white/80',
  },
  conditional_critical: {
    label: 'ŞARTLI KRİTİK',
    tooltip: TOOLTIP_COPY.conditionalCritical,
    sectionClass: 'rounded-xl border border-amber-200/80 bg-amber-50/70 p-3',
    labelClass: 'text-amber-800',
    itemClass: 'rounded-lg border border-amber-100 bg-white/80',
  },
  complementary: {
    label: 'TAMAMLAYICI',
    tooltip: TOOLTIP_COPY.complementary,
    sectionClass: 'rounded-xl border border-gray-200 bg-gray-50/80 p-3',
    labelClass: 'text-gray-600',
    itemClass: 'rounded-lg border border-gray-100 bg-white',
  },
}

function MissingProfileItemCard({
  item,
  expanded,
  onToggle,
  itemClass,
}: {
  item: MissingProfileItem
  expanded: boolean
  onToggle: () => void
  itemClass: string
}) {
  const isExpandable =
    item.category === 'always_critical' || item.category === 'conditional_critical'

  return (
    <div className={`min-w-0 px-3 py-2.5 ${itemClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 text-sm font-semibold text-gray-900">{item.title}</p>
        <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
          {item.module}
        </span>
      </div>

      {isExpandable ? (
        <>
          <button
            type="button"
            onClick={onToggle}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800"
            aria-expanded={expanded}
          >
            Neden gerekli, nasıl tamamlanır?
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
              <p className="text-xs leading-relaxed text-gray-600">{item.explanation}</p>
              <dl className="grid grid-cols-1 gap-1.5 text-[11px] sm:grid-cols-3">
                <div>
                  <dt className="text-gray-500">Gerekli</dt>
                  <dd className="font-medium text-gray-800">{item.requiredFor}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">İzin</dt>
                  <dd className="font-medium text-gray-800">
                    {item.permissionRequirement}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Son sorulma</dt>
                  <dd className="font-medium text-gray-800">{item.lastAskedStatus}</dd>
                </div>
              </dl>
              <p className="text-[11px] font-medium text-gray-700">
                {item.recommendedMethod}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.explanation}</p>
      )}
    </div>
  )
}

export default function MissingProfileSection({ farmer }: MissingProfileSectionProps) {
  const items = getMissingProfileItems(farmer)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <section className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-gray-900">Eksik Profil Bilgileri</h2>
          <InfoTooltip
            label="Eksik profil bilgileri hakkında"
            text={TOOLTIP_COPY.criticalMissing}
          />
        </div>
        <p className="shrink-0 text-[11px] text-gray-400">Önceliğe göre gruplanır</p>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-emerald-700">
          Bu profil için tamamlanması gereken öncelikli alan bulunmuyor.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {grouped.map(({ category, items: categoryItems }) => {
            const meta = CATEGORY_META[category]

            return (
              <div key={category} className={meta.sectionClass}>
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-[11px] font-semibold tracking-wide ${meta.labelClass}`}
                  >
                    {meta.label}
                  </h3>
                  <InfoTooltip
                    label={`${meta.label} hakkında bilgi`}
                    text={meta.tooltip}
                  />
                </div>
                <div className="mt-2 space-y-2">
                  {categoryItems.map((item) => (
                    <MissingProfileItemCard
                      key={item.id}
                      item={item}
                      expanded={expandedIds.has(item.id)}
                      onToggle={() => toggle(item.id)}
                      itemClass={meta.itemClass}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
