import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import ProfileDetailFieldCard, {
  type ProfileDetailTone,
} from '../ProfileDetailFieldCard.tsx'

type BeekeepingTabProps = {
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

export default function BeekeepingTab({ farmer }: BeekeepingTabProps) {
  const beekeeping = farmer.beekeeping

  const leftColumn: FieldView[] = [
    {
      label: 'Arıcılık Tipi',
      ...resolveValue(beekeeping?.beekeepingType),
      tone: 'standard',
    },
    {
      label: 'Ana Ürün',
      ...resolveValue(beekeeping?.mainProduct),
      tone: 'standard',
    },
    {
      label: 'Gezginci Rota',
      ...resolveValue(beekeeping?.migratoryRoute),
      tone: 'dynamic',
    },
    {
      label: 'Besleme',
      ...resolveValue(beekeeping?.feedingMethod),
      tone: 'standard',
    },
  ]

  const rightColumn: FieldView[] = [
    {
      label: 'Kovan Sayısı',
      ...resolveValue(beekeeping?.hiveCount),
      tone: 'standard',
    },
    {
      label: 'Flora',
      ...resolveValue(beekeeping?.flora),
      tone: 'standard',
    },
    {
      label: 'Hastalık Geçmişi',
      ...resolveValue(beekeeping?.diseaseHistory),
      tone: 'standard',
    },
    {
      label: 'Ambalaj / Satış',
      ...resolveValue(beekeeping?.packagingSales),
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
