import { UsersRound } from 'lucide-react'
import type { Farmer, ProductionTypeFilterValue } from '../../types/farmer.ts'
import FarmerList from './FarmerList.tsx'
import FarmerSearch from './FarmerSearch.tsx'
import ProductionTypeFilter from './ProductionTypeFilter.tsx'

type FarmerPanelProps = {
  totalCount: number
  farmers: Farmer[]
  selectedFarmerId: string | null
  searchTerm: string
  productionTypeFilter: ProductionTypeFilterValue
  onSearchChange: (value: string) => void
  onProductionTypeFilterChange: (value: ProductionTypeFilterValue) => void
  onSelectFarmer: (farmerId: string) => void
}

export default function FarmerPanel({
  totalCount,
  farmers,
  selectedFarmerId,
  searchTerm,
  productionTypeFilter,
  onSearchChange,
  onProductionTypeFilterChange,
  onSelectFarmer,
}: FarmerPanelProps) {
  return (
    <section
      aria-label="Çiftçi listesi"
      className="flex h-auto max-h-[40vh] min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-gray-200 bg-stone-50 lg:h-full lg:max-h-none lg:w-[320px] lg:border-b-0 lg:border-r xl:w-[360px] 2xl:w-[380px]"
    >
      <div className="shrink-0 border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <UsersRound className="h-4 w-4 shrink-0 text-emerald-800" aria-hidden="true" />
            <h1 className="truncate text-base font-semibold text-gray-900">Çiftçiler</h1>
          </div>
          <span
            className="shrink-0 text-sm font-medium text-gray-500"
            aria-label={`Toplam ${totalCount} çiftçi`}
          >
            {totalCount}
          </span>
        </div>
      </div>

      <div className="shrink-0 space-y-3 border-b border-gray-200 px-4 py-3">
        <FarmerSearch value={searchTerm} onChange={onSearchChange} />
        <ProductionTypeFilter
          value={productionTypeFilter}
          onChange={onProductionTypeFilterChange}
        />
      </div>

      <FarmerList
        farmers={farmers}
        selectedFarmerId={selectedFarmerId}
        onSelectFarmer={onSelectFarmer}
      />
    </section>
  )
}
