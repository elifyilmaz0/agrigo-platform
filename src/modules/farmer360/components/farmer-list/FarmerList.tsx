import { Users } from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'
import EmptyState from '../shared/EmptyState.tsx'
import FarmerListItem from './FarmerListItem.tsx'

type FarmerListProps = {
  farmers: Farmer[]
  selectedFarmerId: string | null
  onSelectFarmer: (farmerId: string) => void
}

export default function FarmerList({
  farmers,
  selectedFarmerId,
  onSelectFarmer,
}: FarmerListProps) {
  if (farmers.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-4">
        <EmptyState
          icon={Users}
          title="Çiftçi bulunamadı"
          description="Arama veya filtre kriterlerini değiştirin."
          className="w-full border-0 bg-transparent px-2 py-6 shadow-none"
        />
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 space-y-2 overflow-x-hidden overflow-y-auto px-3 py-3">
      {farmers.map((farmer) => (
        <FarmerListItem
          key={farmer.id}
          farmer={farmer}
          selected={selectedFarmerId === farmer.id}
          onSelect={onSelectFarmer}
        />
      ))}
    </div>
  )
}
