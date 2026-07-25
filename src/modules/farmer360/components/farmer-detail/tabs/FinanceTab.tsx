import type { Farmer } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import DetailFieldCard from '../DetailFieldCard.tsx'

type FinanceTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

function resolveValue(value: string | null | undefined): {
  value: string
  missing: boolean
} {
  if (!isMeaningfulValue(value)) {
    return { value: MISSING_LABEL, missing: true }
  }

  return { value: value as string, missing: false }
}

export default function FinanceTab({ farmer }: FinanceTabProps) {
  // Modelde yalnızca incomeRange ve creditNeed eşleşiyor.
  // Diğer Claude alanları modelde yok → Girilmedi. Yeni type/mock eklenmedi.
  const leftColumn = [
    { label: 'Yıllık Ciro Aralığı', ...resolveValue(farmer.finance.incomeRange) },
    { label: 'Dijital Ödeme Kullanımı', ...resolveValue(null) },
    { label: 'Depolama İhtiyacı', ...resolveValue(null) },
    { label: 'Paketleme İhtiyacı', ...resolveValue(null) },
  ]

  const rightColumn = [
    { label: 'Finansman İhtiyacı', ...resolveValue(farmer.finance.creditNeed) },
    { label: 'Satış Sıklığı', ...resolveValue(null) },
    { label: 'Yatırım İlgisi', ...resolveValue(null) },
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
            kind="standard"
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
            kind="standard"
          />
        ))}
      </div>
    </div>
  )
}
