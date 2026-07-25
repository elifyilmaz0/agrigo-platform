import type { Farmer } from '../../../types/farmer.ts'
import AIMemoryCard from './AIMemoryCard.tsx'
import FarmerTimeline from './FarmerTimeline.tsx'
import type { TimelineSourceNavigation } from './TimelineItem.tsx'

type FarmerMemoryTimelineSectionProps = {
  farmer: Farmer
  highlightMemoryId?: string | null
  navigation: TimelineSourceNavigation
}

export default function FarmerMemoryTimelineSection({
  farmer,
  highlightMemoryId = null,
  navigation,
}: FarmerMemoryTimelineSectionProps) {
  return (
    <section className="mt-4 grid min-w-0 grid-cols-1 items-stretch gap-4 overflow-x-hidden xl:grid-cols-2">
      <AIMemoryCard
        items={farmer.aiMemory ?? []}
        farmer={farmer}
        highlightMemoryId={highlightMemoryId}
      />
      <FarmerTimeline
        events={farmer.timeline ?? []}
        farmer={farmer}
        navigation={navigation}
      />
    </section>
  )
}
