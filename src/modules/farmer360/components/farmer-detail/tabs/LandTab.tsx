import type { FieldSource, Farmer, FarmerFieldSourceKey } from '../../../types/farmer.ts'
import { isMeaningfulValue } from '../../../utils/calculateProfileCompleteness.ts'
import { getFieldSource } from '../../../utils/getFieldSource.ts'
import ProfileDetailFieldCard from '../ProfileDetailFieldCard.tsx'

type LandTabProps = {
  farmer: Farmer
}

type SourceBadgeKind = 'farmer' | 'verified' | 'document' | 'ai'

function mapSourceBadge(source: FieldSource | undefined): {
  label: string
  kind: SourceBadgeKind
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

const sourceBadgeClass: Record<SourceBadgeKind, string> = {
  farmer: 'border-amber-200 bg-amber-50 text-amber-800',
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  document: 'border-blue-200 bg-blue-50 text-blue-700',
  ai: 'border-violet-200 bg-violet-50 text-violet-700',
}

function SourceBadge({
  label,
  kind,
}: {
  label: string
  kind: SourceBadgeKind
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${sourceBadgeClass[kind]}`}
    >
      {label}
    </span>
  )
}

type LandField = {
  label: string
  value: string
  sourceKey: FarmerFieldSourceKey
}

function LandFieldCard({
  label,
  value,
  sourceKey,
  farmer,
}: LandField & { farmer: Farmer }) {
  const missing = !isMeaningfulValue(value)
  const badge = mapSourceBadge(getFieldSource(farmer, sourceKey))

  return (
    <ProfileDetailFieldCard
      label={label}
      value={missing ? '—' : value}
      missing={missing}
      tone="standard"
      badge={badge ? <SourceBadge label={badge.label} kind={badge.kind} /> : undefined}
    />
  )
}

export default function LandTab({ farmer }: LandTabProps) {
  const leftColumn: LandField[] = [
    {
      label: 'Alan Büyüklüğü',
      value: farmer.production.fieldSize,
      sourceKey: 'production.fieldSize',
    },
    {
      label: 'Sulama Sistemi',
      value: farmer.production.irrigationSystem,
      sourceKey: 'production.irrigationSystem',
    },
    {
      label: 'Toprak Tipi',
      value: farmer.production.soilType,
      sourceKey: 'production.soilType',
    },
  ]

  const rightColumn: LandField[] = [
    {
      label: 'İl',
      value: farmer.province,
      sourceKey: 'province',
    },
    {
      label: 'İlçe',
      value: farmer.district,
      sourceKey: 'district',
    },
    {
      label: 'Mahalle / Köy',
      value: farmer.village,
      sourceKey: 'village',
    },
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Arazi Bilgileri</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          {leftColumn.map((field) => (
            <LandFieldCard key={field.label} {...field} farmer={farmer} />
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          {rightColumn.map((field) => (
            <LandFieldCard key={field.label} {...field} farmer={farmer} />
          ))}
        </div>
      </div>
    </div>
  )
}
