import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import DetailFieldCard from '../DetailFieldCard.tsx'

type InsuranceTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

function resolveValue(value: string): { value: string; missing: boolean } {
  if (!isMeaningfulValue(value)) {
    return { value: MISSING_LABEL, missing: true }
  }

  return { value, missing: false }
}

export default function InsuranceTab({ farmer }: InsuranceTabProps) {
  const fields = [
    { label: 'Durum', ...resolveValue(farmer.insurance.status) },
    { label: 'Poliçe Kapsamı', ...resolveValue(farmer.insurance.type) },
    { label: 'Yenileme Tarihi', ...resolveValue(farmer.insurance.policyEndDate) },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {fields.map((field) => (
          <DetailFieldCard
            key={field.label}
            label={field.label}
            value={field.value}
            missing={field.missing}
            kind="standard"
          />
        ))}
      </div>

      <p className="px-0.5 text-xs leading-relaxed text-gray-500">
        <span className="font-medium text-gray-600">Bu bilgi neden gösteriliyor?</span>{' '}
        Sigorta durumu, poliçe kapsamı ve yenileme tarihi; risk takibi ve yenileme
        planlaması için mevcut CRM kayıtlarından derlenir.
      </p>
    </div>
  )
}
