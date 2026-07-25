import { History } from 'lucide-react'
import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import DetailFieldCard from '../DetailFieldCard.tsx'

type ProfileTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

function displayValue(value: string | null | undefined): {
  value: string
  missing: boolean
} {
  if (!isMeaningfulValue(value)) {
    return { value: MISSING_LABEL, missing: true }
  }

  return { value: value as string, missing: false }
}

function buildPrimaryIncome(farmer: Farmer): { value: string; missing: boolean } {
  const hasType = isMeaningfulValue(farmer.productionType)
  const hasProduct = isMeaningfulValue(farmer.production.product)

  if (hasType && hasProduct) {
    return {
      value: `${farmer.productionType} üretim — ${farmer.production.product}`,
      missing: false,
    }
  }

  if (hasType) {
    return { value: `${farmer.productionType} üretim`, missing: false }
  }

  if (hasProduct) {
    return { value: farmer.production.product, missing: false }
  }

  return { value: MISSING_LABEL, missing: true }
}

function buildOrganizationMembership(farmer: Farmer): {
  value: string
  missing: boolean
} {
  const channel = farmer.production.salesChannel

  if (!isMeaningfulValue(channel)) {
    return { value: MISSING_LABEL, missing: true }
  }

  const normalized = channel.trim().toLocaleLowerCase('tr-TR')

  if (normalized.includes('kooperatif')) {
    return { value: 'Kooperatif üyesi', missing: false }
  }

  return { value: MISSING_LABEL, missing: true }
}

export default function ProfileTab({ farmer }: ProfileTabProps) {
  const userType = displayValue(farmer.userType)
  const primaryIncome = buildPrimaryIncome(farmer)
  const productionScale = displayValue(farmer.production.fieldSize)
  const organization = buildOrganizationMembership(farmer)
  const mainProblem = { value: MISSING_LABEL, missing: true }
  const experience = { value: MISSING_LABEL, missing: true }
  const secondaryActivities = { value: MISSING_LABEL, missing: true }
  const commercialOrientation = { value: MISSING_LABEL, missing: true }
  const marketOrientation = displayValue(farmer.production.salesChannel)

  const leftColumn = [
    { label: 'Kullanıcı Tipi', ...userType, kind: 'standard' as const },
    { label: 'Ana Gelir Kaynağı', ...primaryIncome, kind: 'dynamic' as const },
    { label: 'Üretim Ölçeği', ...productionScale, kind: 'standard' as const },
    { label: 'Örgüt Üyeliği', ...organization, kind: 'dynamic' as const },
    {
      label: 'Ana Sorun Alanı',
      ...mainProblem,
      kind: 'standard' as const,
      trailing: (
        <History
          className="h-3.5 w-3.5 shrink-0 text-gray-400"
          aria-hidden="true"
        />
      ),
    },
  ]

  const rightColumn = [
    { label: 'Tarımsal Deneyim', ...experience, kind: 'standard' as const },
    {
      label: 'İkincil Faaliyetler',
      ...secondaryActivities,
      kind: 'standard' as const,
    },
    {
      label: 'Ticari Yönelim',
      ...commercialOrientation,
      kind: 'standard' as const,
    },
    {
      label: 'Pazar Yönelimi',
      ...marketOrientation,
      kind: 'standard' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        {leftColumn.map((field) => (
          <DetailFieldCard
            key={field.label}
            label={field.label}
            value={field.value}
            missing={field.missing}
            kind={field.kind}
            trailing={'trailing' in field ? field.trailing : undefined}
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
  )
}
