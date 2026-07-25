import { useState } from 'react'
import { ArrowUpRight, MessageSquare } from 'lucide-react'
import type { Farmer, TimelineEvent } from '../../../types/farmer.ts'
import { formatTimelineDate } from '../../../utils/formatTimelineDate.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import { EMPTY_HELP_COPY } from '../../shared/explainabilityCopy.ts'

type ConversationsTabProps = {
  farmer: Farmer
  highlightConversationId?: string | null
}

type ConversationFilter = 'all' | 'visual' | 'qa' | 'commercial'

type ConversationCategory = Exclude<ConversationFilter, 'all'>

type ConversationItem = {
  id: string
  dateLabel: string
  channel: string
  category: ConversationCategory
  farmerMessage: string
  aiResponse: string | null
  tags: string[]
  hasMemory: boolean
  hasDocumentHint: boolean
}

const FILTERS: { id: ConversationFilter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'visual', label: 'Görsel' },
  { id: 'qa', label: 'Soru-Cevap' },
  { id: 'commercial', label: 'Ticari Etkileşim' },
]

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

function scrollToSection(elementId: string) {
  document.getElementById(elementId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function resolveChannel(farmer: Farmer, event: TimelineEvent): string {
  if (event.category !== 'conversation') {
    return 'Saha'
  }

  const preferred = normalize(farmer.preferredChannel)
  if (preferred.includes('whatsapp')) {
    return 'WhatsApp'
  }
  if (preferred.includes('telefon')) {
    return 'Telefon'
  }
  if (farmer.preferredChannel.trim() !== '' && farmer.preferredChannel.trim() !== '—') {
    return farmer.preferredChannel
  }

  return 'Konuşma'
}

function classifyConversation(
  event: TimelineEvent,
  aiDetail: string | null,
): ConversationCategory {
  const haystack = normalize(`${event.title} ${event.description} ${aiDetail ?? ''}`)

  const commercialKeywords = [
    'satış',
    'kooperatif',
    'kredi',
    'fiyat',
    'ticari',
    'hal',
    'online',
    'eşleştir',
    'pazar',
    'girdi',
    'bütçe',
  ]

  if (commercialKeywords.some((keyword) => haystack.includes(keyword))) {
    return 'commercial'
  }

  return 'qa'
}

function buildTags(
  event: TimelineEvent,
  relatedMemoryTitle: string | null,
  category: ConversationCategory,
): string[] {
  const tags: string[] = []
  const haystack = normalize(
    `${event.title} ${event.description} ${relatedMemoryTitle ?? ''}`,
  )

  if (
    haystack.includes('ilgi') ||
    haystack.includes('ilgilen') ||
    relatedMemoryTitle?.toLocaleLowerCase('tr-TR').includes('ilgi')
  ) {
    tags.push('İlgi ifadesi')
  }

  if (category === 'commercial' && (haystack.includes('satış') || haystack.includes('kooperatif') || haystack.includes('kredi'))) {
    tags.push('İlgi sinyali kaydedildi')
  }

  if (
    haystack.includes('sulama') ||
    haystack.includes('hasat') ||
    haystack.includes('teşhis') ||
    haystack.includes('kontrol')
  ) {
    tags.push('Teşhis talebi')
  }

  if (
    haystack.includes('sigorta') ||
    haystack.includes('doğrula') ||
    haystack.includes('eksik')
  ) {
    tags.push('Doğrulama bekliyor')
  }

  if (haystack.includes('profil')) {
    tags.push('Profil paylaşımı')
  }

  if (haystack.includes('dönüm') || haystack.includes('alan') || haystack.includes('ürün')) {
    tags.push('Ürün / alan bilgisi')
  }

  return [...new Set(tags)].slice(0, 4)
}

function buildConversations(farmer: Farmer): ConversationItem[] {
  const interactionEvents = farmer.timeline.filter(
    (event) => event.category === 'conversation',
  )

  return interactionEvents.map((event, index) => {
    const relatedMemory =
      farmer.aiMemory.find((memory) => {
        const memoryTime = new Date(memory.updatedAt).getTime()
        const eventTime = new Date(event.occurredAt).getTime()
        return Math.abs(memoryTime - eventTime) <= 1000 * 60 * 60 * 24
      }) ??
      farmer.aiMemory.find((memory) => memory.category === 'communication') ??
      farmer.aiMemory[index] ??
      null

    const aiResponse = relatedMemory?.detail ?? null
    const category = classifyConversation(event, aiResponse)
    const haystack = normalize(`${event.title} ${event.description}`)

    const hasDocumentHint =
      haystack.includes('belge') ||
      haystack.includes('poliçe') ||
      haystack.includes('form')

    return {
      id: event.id,
      dateLabel: formatTimelineDate(event.occurredAt),
      channel: resolveChannel(farmer, event),
      category,
      farmerMessage: event.description,
      aiResponse,
      tags: buildTags(event, relatedMemory?.title ?? null, category),
      hasMemory: relatedMemory !== null,
      hasDocumentHint,
    }
  })
}

function CategoryBadge({ category }: { category: ConversationCategory }) {
  const styles: Record<ConversationCategory, string> = {
    visual: 'border-violet-200 bg-violet-50 text-violet-700',
    qa: 'border-sky-200 bg-sky-50 text-sky-700',
    commercial: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }

  const labels: Record<ConversationCategory, string> = {
    visual: 'Görsel',
    qa: 'Soru-Cevap',
    commercial: 'Ticari',
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${styles[category]}`}
    >
      {labels[category]}
    </span>
  )
}

function InfoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500">
      {label}
    </span>
  )
}

function NavLinkButton({
  label,
  ariaLabel,
  targetId,
  withArrow = false,
}: {
  label: string
  ariaLabel: string
  targetId: string
  withArrow?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => scrollToSection(targetId)}
      className="f360-focus inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-emerald-800 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
    >
      {label}
      {withArrow && <ArrowUpRight className="h-3 w-3" aria-hidden="true" />}
    </button>
  )
}

export default function ConversationsTab({
  farmer,
  highlightConversationId = null,
}: ConversationsTabProps) {
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('all')
  const conversations = buildConversations(farmer)

  const visibleConversations =
    activeFilter === 'all'
      ? conversations
      : conversations.filter((item) => item.category === activeFilter)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Konuşma filtreleri">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`f360-focus f360-chip rounded-full border px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {visibleConversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Konuşma kaydı yok"
          description={
            conversations.length === 0
              ? EMPTY_HELP_COPY.conversations
              : 'Seçili filtre için konuşma bulunmuyor. Filtreyi değiştirerek diğer kayıtları görebilirsiniz.'
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {visibleConversations.map((conversation) => (
            <li key={conversation.id} id={`conversation-item-${conversation.id}`}>
              <article
                className={`f360-card-interactive min-w-0 rounded-xl border bg-white p-3.5 shadow-sm sm:p-4 ${
                  highlightConversationId === conversation.id
                    ? 'f360-highlight-pulse border-emerald-400 ring-2 ring-emerald-200'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    <span>{conversation.dateLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{conversation.channel}</span>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <CategoryBadge category={conversation.category} />
                    {conversation.hasMemory && (
                      <NavLinkButton
                        label="AI Hafızası"
                        ariaLabel="AI Hafıza bölümüne git"
                        targetId="farmer-ai-memory"
                        withArrow
                      />
                    )}
                  </div>
                </div>

                <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                  <div className="min-w-0 space-y-2.5">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-gray-500">Çiftçi</p>
                      <p className="mt-0.5 break-words text-sm leading-snug text-gray-800">
                        {conversation.farmerMessage}
                      </p>
                    </div>

                    {conversation.aiResponse && (
                      <div className="min-w-0 rounded-lg border border-violet-100 bg-violet-50/50 px-2.5 py-2">
                        <p className="text-[11px] font-semibold text-violet-700">AI</p>
                        <p className="mt-0.5 break-words text-sm leading-snug text-gray-700">
                          {conversation.aiResponse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {conversation.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {conversation.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2.5">
                  {conversation.hasDocumentHint && <InfoBadge label="Belge" />}

                  {conversation.hasMemory ? (
                    <NavLinkButton
                      label="AI Hafızası"
                      ariaLabel="AI Hafıza bölümüne git"
                      targetId="farmer-ai-memory"
                    />
                  ) : null}

                  <NavLinkButton
                    label="Zaman Çizelgesi"
                    ariaLabel="Zaman çizelgesi bölümüne git"
                    targetId="farmer-timeline"
                  />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
