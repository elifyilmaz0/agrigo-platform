import type { LucideIcon } from 'lucide-react'
import {
  Bot,
  FileText,
  Hourglass,
  Image as ImageIcon,
  Link2,
  Lock,
  MessageCircle,
  Tags,
  UserCheck,
  UserRound,
} from 'lucide-react'
import type {
  Farmer,
  TimelineCategory,
  TimelineEvent,
  TimelineRelatedSource,
} from '../../../types/farmer.ts'
import { formatTimelineStreamTime } from '../../../utils/formatTimelineDate.ts'
import { resolveTimelineSourceRefs } from '../../../utils/resolveTimelineSourceRefs.ts'
import InfoTooltip from '../../shared/InfoTooltip.tsx'
import { TOOLTIP_COPY } from '../../shared/explainabilityCopy.ts'

export type TimelineSourceNavigation = {
  onOpenConversation: (conversationId?: string) => void
  onOpenDocument: (documentId?: string) => void
  onOpenMemory: (memoryId?: string) => void
}

type TimelineItemProps = {
  event: TimelineEvent
  farmer: Farmer
  isLast: boolean
  navigation: TimelineSourceNavigation
}

const categoryLabels: Record<TimelineCategory, string> = {
  conversation: 'Konuşma',
  image: 'Görsel',
  ai_inference: 'AI Çıkarımı',
  review: 'İncelemede',
  employee_verification: 'Çalışan Doğrulaması',
  consent: 'İzin',
  document: 'Belge',
  profile: 'Profil',
  segment: 'Segment',
}

const categoryBadgeClass: Record<TimelineCategory, string> = {
  conversation: 'bg-emerald-50 text-emerald-700',
  image: 'bg-green-50 text-green-700',
  ai_inference: 'bg-violet-50 text-violet-700',
  review: 'bg-gray-100 text-gray-600',
  employee_verification: 'bg-blue-50 text-blue-700',
  consent: 'bg-emerald-50 text-emerald-700',
  document: 'bg-sky-50 text-sky-700',
  profile: 'bg-teal-50 text-teal-700',
  segment: 'bg-amber-50 text-amber-800',
}

const nodeSurfaceClass: Record<TimelineCategory, string> = {
  conversation: 'bg-emerald-50 text-emerald-700',
  image: 'bg-green-50 text-green-700',
  ai_inference: 'bg-violet-50 text-violet-700',
  review: 'bg-gray-100 text-gray-500',
  employee_verification: 'bg-blue-50 text-blue-700',
  consent: 'bg-emerald-50 text-emerald-700',
  document: 'bg-sky-50 text-sky-700',
  profile: 'bg-teal-50 text-teal-700',
  segment: 'bg-amber-50 text-amber-700',
}

const categoryIcons: Record<TimelineCategory, LucideIcon> = {
  conversation: MessageCircle,
  image: ImageIcon,
  ai_inference: Bot,
  review: Hourglass,
  employee_verification: UserCheck,
  consent: Lock,
  document: FileText,
  profile: UserRound,
  segment: Tags,
}

const relatedSourceLabels: Record<TimelineRelatedSource, string> = {
  conversation: 'Konuşma',
  document: 'Belge',
  ai_memory: 'AI Hafızası',
}

const relatedSourceIcons: Record<TimelineRelatedSource, LucideIcon> = {
  conversation: MessageCircle,
  document: FileText,
  ai_memory: Bot,
}

export default function TimelineItem({
  event,
  farmer,
  isLast,
  navigation,
}: TimelineItemProps) {
  const Icon = categoryIcons[event.category]
  const relatedSources = event.relatedSources ?? []
  const refs = resolveTimelineSourceRefs(event, farmer)

  const handleSourceClick = (source: TimelineRelatedSource) => {
    if (source === 'conversation') {
      navigation.onOpenConversation(refs.conversationId)
      return
    }
    if (source === 'document') {
      navigation.onOpenDocument(refs.documentId)
      return
    }
    navigation.onOpenMemory(refs.memoryId)
  }

  return (
    <li className="relative flex min-w-0 gap-3.5">
      <div className="relative flex w-9 shrink-0 justify-center">
        {!isLast && (
          <span
            className="absolute top-9 bottom-0 w-px bg-gray-200"
            aria-hidden="true"
          />
        )}
        <span
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full ${nodeSurfaceClass[event.category]}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className={`min-w-0 flex-1 ${isLast ? 'pb-1' : 'pb-7'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-none ${categoryBadgeClass[event.category]}`}
          >
            {categoryLabels[event.category]}
          </span>
          {event.category === 'ai_inference' && (
            <InfoTooltip
              label="AI çıkarımı hakkında bilgi"
              text={TOOLTIP_COPY.aiInference}
            />
          )}
          {event.category === 'review' && (
            <InfoTooltip
              label="İnceleme durumu hakkında bilgi"
              text={TOOLTIP_COPY.aiReview}
            />
          )}
          <span
            className={`text-[11px] font-medium ${
              event.category === 'review' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {event.actor}
          </span>
        </div>

        <p className="mt-1.5 text-sm font-semibold leading-snug text-gray-900">
          {event.title}
        </p>

        <time
          dateTime={event.occurredAt}
          className="mt-1 block text-[11px] text-gray-400"
        >
          {formatTimelineStreamTime(event.occurredAt)}
        </time>

        {relatedSources.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-sky-500" aria-hidden="true" />
            {relatedSources.map((source) => {
              const SourceIcon = relatedSourceIcons[source]
              return (
                <button
                  key={source}
                  type="button"
                  onClick={() => handleSourceClick(source)}
                  className="f360-focus f360-chip inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 hover:border-sky-200 hover:bg-sky-100"
                >
                  <SourceIcon className="h-3 w-3" aria-hidden="true" />
                  {relatedSourceLabels[source]}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </li>
  )
}
