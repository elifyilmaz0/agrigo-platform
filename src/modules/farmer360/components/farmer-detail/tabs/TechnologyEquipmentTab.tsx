import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import DetailFieldCard, {
  type DetailFieldKind,
} from '../DetailFieldCard.tsx'

type TechnologyEquipmentTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

type FieldView = {
  label: string
  value: string
  missing: boolean
  kind: DetailFieldKind
}

function resolveValue(value: string | null | undefined): {
  value: string
  missing: boolean
} {
  if (!isMeaningfulValue(value)) {
    return { value: MISSING_LABEL, missing: true }
  }

  return { value: value as string, missing: false }
}

export default function TechnologyEquipmentTab({
  farmer,
}: TechnologyEquipmentTabProps) {
  const tech = farmer.technologyEquipment

  const leftColumn: FieldView[] = [
    {
      label: 'Traktör',
      ...resolveValue(tech.tractorStatus),
      kind: 'standard',
    },
    {
      label: 'Traktör Modeli',
      ...resolveValue(tech.tractorModel),
      kind: 'standard',
    },
    {
      label: 'Sahip Olunan Ekipman',
      ...resolveValue(tech.ownedEquipment),
      kind: 'dynamic',
    },
    {
      label: 'Sensör Kullanımı',
      ...resolveValue(tech.sensorUsage),
      kind: 'ai',
    },
    {
      label: 'Makine Satın Alma İlgisi',
      ...resolveValue(tech.machineryPurchaseInterest),
      kind: 'dynamic',
    },
  ]

  const rightColumn: FieldView[] = [
    {
      label: 'Traktör Markası',
      ...resolveValue(tech.tractorBrand),
      kind: 'standard',
    },
    {
      label: 'Traktör Yaş Aralığı',
      ...resolveValue(tech.tractorAgeRange),
      kind: 'standard',
    },
    {
      label: 'Drone Kullanımı',
      ...resolveValue(tech.droneUsage),
      kind: 'ai',
    },
    {
      label: 'Uydu / NDVI İlgisi',
      ...resolveValue(tech.satelliteNdviInterest),
      kind: 'ai',
    },
    {
      label: 'Bakım / Yedek Parça İhtiyacı',
      ...resolveValue(tech.maintenanceSparePartNeed),
      kind: 'standard',
    },
  ]

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-500"
        aria-label="Alan türü açıklaması"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          Standart Alan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden="true" />
          AI Önerisi
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
          Dinamik Alan
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          {leftColumn.map((field) => (
            <DetailFieldCard
              key={field.label}
              label={field.label}
              value={field.value}
              missing={field.missing}
              kind={field.kind}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          {rightColumn.map((field) => (
            <DetailFieldCard
              key={field.label}
              label={field.label}
              value={field.value}
              missing={field.missing}
              kind={field.kind}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
