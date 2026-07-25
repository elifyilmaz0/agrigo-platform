import { CircleCheck } from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'

type FarmerListItemProps = {
  farmer: Farmer
  selected: boolean
  onSelect: (farmerId: string) => void
}

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ProductionTypeBadge({ productionType }: { productionType: Farmer['productionType'] }) {
  const styles: Record<Farmer['productionType'], string> = {
    Bitkisel: 'text-green-700',
    Hayvansal: 'text-blue-700',
    Arıcılık: 'text-amber-700',
    Karma: 'text-purple-700',
  }

  return (
    <span className={`text-[11px] font-medium ${styles[productionType]}`}>
      {productionType}
    </span>
  )
}

export default function FarmerListItem({
  farmer,
  selected,
  onSelect,
}: FarmerListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(farmer.id)}
      aria-current={selected ? 'true' : undefined}
      aria-label={
        selected
          ? `${farmer.fullName}, seçili çiftçi`
          : `${farmer.fullName}, çiftçi profilini göster`
      }
      className={`f360-focus f360-card-interactive min-w-0 w-full rounded-lg border px-3 py-3 text-left shadow-sm ${
        selected
          ? 'border-emerald-700 bg-emerald-50/80'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
          {getInitials(farmer.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {farmer.fullName}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
            <ProductionTypeBadge productionType={farmer.productionType} />
            <span className="text-gray-300">•</span>
            <span className="truncate">{farmer.province}</span>
          </div>
        </div>

        {farmer.status === 'Aktif' && (
          <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
        )}
      </div>
    </button>
  )
}
