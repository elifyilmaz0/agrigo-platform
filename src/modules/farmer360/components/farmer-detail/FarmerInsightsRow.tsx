import type { Farmer } from '../../types/farmer.ts'
import ActiveRiskCard from './ActiveRiskCard.tsx'
import CriticalMissingInfoCard from './CriticalMissingInfoCard.tsx'
import ProfileCompletenessCard from './ProfileCompletenessCard.tsx'

type FarmerInsightsRowProps = {
  farmer: Farmer
}

export default function FarmerInsightsRow({ farmer }: FarmerInsightsRowProps) {
  return (
    <section
      aria-label="Profil içgörüleri"
      className="mt-4 grid min-w-0 grid-cols-1 items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-4"
    >
      <ProfileCompletenessCard farmer={farmer} />
      <ActiveRiskCard farmer={farmer} />
      <CriticalMissingInfoCard farmer={farmer} />
    </section>
  )
}
