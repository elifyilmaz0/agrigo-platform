import { useMemo, useState } from 'react'
import { Clock3 } from 'lucide-react'
import type { Farmer, TimelineCategory, TimelineEvent } from '../../../types/farmer.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import InfoTooltip from '../../shared/InfoTooltip.tsx'
import {
  EMPTY_HELP_COPY,
  TOOLTIP_COPY,
} from '../../shared/explainabilityCopy.ts'
import TimelineItem, {
  type TimelineSourceNavigation,
} from './TimelineItem.tsx'

type FarmerTimelineProps = {
  events: TimelineEvent[]
  farmer: Farmer
  navigation: TimelineSourceNavigation
}

type TimelineFilter =
  | 'all'
  | 'conversation'
  | 'document'
  | 'ai_inference'
  | 'profile'
  | 'consent'
  | 'segment'
  | 'employee_verification'

const FILTERS: { id: TimelineFilter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'conversation', label: 'Konuşmalar' },
  { id: 'document', label: 'Belgeler' },
  { id: 'ai_inference', label: 'AI' },
  { id: 'profile', label: 'Profil' },
  { id: 'consent', label: 'İzinler' },
  { id: 'segment', label: 'Segmentler' },
  { id: 'employee_verification', label: 'Çalışan Doğrulaması' },
]

function matchesFilter(event: TimelineEvent, filter: TimelineFilter): boolean {
  if (filter === 'all') {
    return true
  }

  return event.category === (filter as TimelineCategory)
}

export default function FarmerTimeline({
  events,
  farmer,
  navigation,
}: FarmerTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter>('all')

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      ),
    [events],
  )

  const filteredEvents = useMemo(
    () => sortedEvents.filter((event) => matchesFilter(event, filter)),
    [sortedEvents, filter],
  )

  return (
    <article
      id="farmer-timeline"
      className="flex h-full min-w-0 flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <header>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-900">Zaman Çizelgesi</h3>
                <InfoTooltip
                  label="Zaman çizelgesi hakkında bilgi"
                  text={TOOLTIP_COPY.timeline}
                />
              </div>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Her kayıtta aktör bilgisi yer alır
              </p>
            </div>
          </div>
        </div>

        <div
          className="mt-4 flex flex-wrap gap-1.5"
          role="group"
          aria-label="Zaman çizelgesi filtreleri"
        >
          {FILTERS.map((item) => {
            const active = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={`f360-focus f360-chip rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  active
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </header>

      {filteredEvents.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={Clock3}
          title="Zaman çizelgesi kaydı yok"
          description={
            sortedEvents.length === 0
              ? EMPTY_HELP_COPY.timeline
              : 'Seçili filtre için kayıt bulunmuyor. Filtreyi değiştirerek diğer olayları görebilirsiniz.'
          }
        />
      ) : (
        <ol className="mt-5 flex min-w-0 flex-col">
          {filteredEvents.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              farmer={farmer}
              isLast={index === filteredEvents.length - 1}
              navigation={navigation}
            />
          ))}
        </ol>
      )}
    </article>
  )
}
