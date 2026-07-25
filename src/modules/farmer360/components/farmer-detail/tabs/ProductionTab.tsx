import { Info } from 'lucide-react'
import type { FieldSource, Farmer, FarmerFieldSourceKey } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import { getFieldSource } from '../../../utils/getFieldSource.ts'
import DetailFieldCard, {
  type DetailFieldKind,
} from '../DetailFieldCard.tsx'

type ProductionTabProps = {
  farmer: Farmer
}

const MISSING_LABEL = 'Girilmedi'

type StatusBadgeKind = 'farmer' | 'verified' | 'document' | 'ai'

function mapSourceBadge(source: FieldSource | undefined): {
  label: string
  kind: StatusBadgeKind
} | null {
  if (!source) {
    return null
  }

  switch (source) {
    case 'ai':
      return { label: 'AI Önerisi', kind: 'ai' }
    case 'form':
      return { label: 'Belge', kind: 'document' }
    case 'field':
      return { label: 'Doğrulandı', kind: 'verified' }
    case 'manual':
    case 'phone':
    case 'whatsapp':
      return { label: 'Çiftçi Beyanı', kind: 'farmer' }
  }
}

const statusBadgeClass: Record<StatusBadgeKind, string> = {
  farmer: 'border-amber-200 bg-amber-50 text-amber-800',
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  document: 'border-blue-200 bg-blue-50 text-blue-700',
  ai: 'border-violet-200 bg-violet-50 text-violet-700',
}

function StatusBadge({
  label,
  kind,
}: {
  label: string
  kind: StatusBadgeKind
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${statusBadgeClass[kind]}`}
    >
      {label}
    </span>
  )
}

function resolveProductCategory(farmer: Farmer): {
  value: string
  missing: boolean
  kind: DetailFieldKind
} {
  if (!isMeaningfulValue(farmer.productionType)) {
    return { value: MISSING_LABEL, missing: true, kind: 'standard' }
  }

  const categoryByType: Record<string, string> = {
    Bitkisel: 'Bitkisel ürün',
    Hayvansal: 'Hayvansal ürün',
    Arıcılık: 'Arıcılık ürünü',
    Karma: 'Karma üretim',
  }

  return {
    value: categoryByType[farmer.productionType] ?? farmer.productionType,
    missing: false,
    kind: 'dynamic',
  }
}

function resolveField(
  value: string,
  sourceKey: FarmerFieldSourceKey | undefined,
  farmer: Farmer,
  kindWhenPresent: DetailFieldKind = 'standard',
): {
  value: string
  missing: boolean
  kind: DetailFieldKind
  badge: ReturnType<typeof mapSourceBadge>
} {
  const source = sourceKey ? getFieldSource(farmer, sourceKey) : undefined
  const badge = mapSourceBadge(source)

  if (!isMeaningfulValue(value)) {
    return {
      value: MISSING_LABEL,
      missing: true,
      kind: 'standard',
      badge: null,
    }
  }

  const kind: DetailFieldKind =
    source === 'ai' ? 'ai' : kindWhenPresent

  return {
    value,
    missing: false,
    kind,
    badge,
  }
}

export default function ProductionTab({ farmer }: ProductionTabProps) {
  const productCategory = resolveProductCategory(farmer)
  const product = resolveField(
    farmer.production.product,
    'production.product',
    farmer,
  )
  const variety = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const area = resolveField(
    farmer.production.fieldSize,
    'production.fieldSize',
    farmer,
  )
  const growingMethod = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const plantingDate = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const harvestDate = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const irrigationMethod = resolveField(
    farmer.production.irrigationSystem,
    'production.irrigationSystem',
    farmer,
  )
  const irrigationStatus = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const soilAnalysis = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }
  const salesChannel = resolveField(
    farmer.production.salesChannel,
    'production.salesChannel',
    farmer,
  )
  const certification = {
    value: MISSING_LABEL,
    missing: true,
    kind: 'standard' as const,
    badge: null,
  }

  const leftColumn = [
    {
      label: 'Ürün Kategorisi',
      value: productCategory.value,
      missing: productCategory.missing,
      kind: productCategory.kind,
      badge: productCategory.missing
        ? null
        : mapSourceBadge(getFieldSource(farmer, 'productionType')),
    },
    { label: 'Çeşit (Variety)', ...variety },
    { label: 'Yetiştirme Şekli', ...growingMethod },
    { label: 'Tahmini Hasat Tarihi', ...harvestDate },
    { label: 'Sulama Durumu', ...irrigationStatus },
    { label: 'Satış Kanalı', ...salesChannel },
  ]

  const rightColumn = [
    { label: 'Ürün', ...product },
    { label: 'Alan', ...area },
    { label: 'Ekim/Dikim Tarihi', ...plantingDate },
    { label: 'Sulama Yöntemi (mevcut)', ...irrigationMethod },
    { label: 'Toprak Analizi', ...soilAnalysis },
    { label: 'Sertifikasyon', ...certification },
  ]

  const hasAiInsight = isMeaningfulValue(farmer.production.aiSummary)

  return (
    <div className="space-y-4">
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
              badge={
                field.badge ? (
                  <StatusBadge label={field.badge.label} kind={field.badge.kind} />
                ) : undefined
              }
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
              badge={
                field.badge ? (
                  <StatusBadge label={field.badge.label} kind={field.badge.kind} />
                ) : undefined
              }
            />
          ))}
        </div>
      </div>

      {hasAiInsight && (
        <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <Info
            className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="break-words text-sm leading-relaxed text-gray-700">
                {farmer.production.aiSummary}
              </p>
              <StatusBadge label="AI Önerisi" kind="ai" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
