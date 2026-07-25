import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import ProfileDetailFieldCard, {
  type ProfileDetailTone,
} from '../ProfileDetailFieldCard.tsx'

type LivestockTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

type FieldView = {
  label: string
  value: string
  missing: boolean
  tone: ProfileDetailTone
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

export default function LivestockTab({ farmer }: LivestockTabProps) {
  const livestock = farmer.livestock

  const leftColumn: FieldView[] = [
    {
      label: 'Hayvan Türü',
      ...resolveValue(livestock?.animalType),
      tone: 'standard',
    },
    {
      label: 'Irk',
      ...resolveValue(livestock?.breed),
      tone: 'standard',
    },
    {
      label: 'Barınak',
      ...resolveValue(livestock?.housingType),
      tone: 'standard',
    },
    {
      label: 'Sağlık Takibi',
      ...resolveValue(livestock?.healthMonitoring),
      tone: 'standard',
    },
    {
      label: 'Satış Kanalı',
      ...resolveValue(livestock?.salesChannel ?? farmer.production.salesChannel),
      tone: 'standard',
    },
  ]

  const rightColumn: FieldView[] = [
    {
      label: 'Üretim Amacı',
      ...resolveValue(livestock?.productionPurpose),
      tone: 'dynamic',
    },
    {
      label: 'Hayvan Sayısı',
      ...resolveValue(livestock?.animalCount),
      tone: 'standard',
    },
    {
      label: 'Besleme',
      ...resolveValue(livestock?.feedingMethod),
      tone: 'standard',
    },
    {
      label: 'Süt Verimi',
      ...resolveValue(livestock?.milkYield),
      tone: 'standard',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        {leftColumn.map((field) => (
          <ProfileDetailFieldCard
            key={field.label}
            label={field.label}
            value={field.value}
            missing={field.missing}
            tone={field.tone}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        {rightColumn.map((field) => (
          <ProfileDetailFieldCard
            key={field.label}
            label={field.label}
            value={field.value}
            missing={field.missing}
            tone={field.tone}
          />
        ))}
      </div>
    </div>
  )
}
