import { useEffect, useState } from 'react'
import {
  Brain,
  Check,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Link2,
  Pencil,
  Quote,
  X,
} from 'lucide-react'
import type {
  AIMemoryItem,
  Farmer,
  MemoryCategory,
  MemoryConfidence,
} from '../../../types/farmer.ts'
import { formatRelativeTime } from '../../../utils/formatTimelineDate.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import InfoTooltip from '../../shared/InfoTooltip.tsx'
import StatusBadge from '../../shared/StatusBadge.tsx'
import {
  EMPTY_HELP_COPY,
  TOOLTIP_COPY,
} from '../../shared/explainabilityCopy.ts'
import { useFarmerToast } from '../../shared/useFarmerToast.ts'

type AIMemoryCardProps = {
  items: AIMemoryItem[]
  farmer: Farmer
  highlightMemoryId?: string | null
}

type MemoryReviewStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'stale'
  | 'edited'

const confidencePercent: Record<MemoryConfidence, number> = {
  high: 88,
  medium: 64,
  low: 38,
}

const confidenceBarClass: Record<MemoryConfidence, string> = {
  high: 'bg-emerald-500',
  medium: 'bg-amber-500',
  low: 'bg-rose-400',
}

const confidenceTrackClass: Record<MemoryConfidence, string> = {
  high: 'bg-emerald-100',
  medium: 'bg-amber-100',
  low: 'bg-rose-100',
}

const confidenceLabelClass: Record<MemoryConfidence, string> = {
  high: 'text-emerald-700',
  medium: 'text-amber-700',
  low: 'text-rose-700',
}

const statusLabels: Record<MemoryReviewStatus, string> = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  stale: 'Eskimiş',
  edited: 'Düzeltildi',
}

const categoryFieldLabels: Record<MemoryCategory, string> = {
  communication: 'Tercih edilen kanal',
  production: 'Üretim / ürün',
  finance: 'Kredi ihtiyacı',
  insurance: 'Sigorta durumu',
}

const sourceChipsByCategory: Record<MemoryCategory, string[]> = {
  communication: ['WhatsApp', 'Telefon'],
  production: ['Saha', 'Görüşme'],
  finance: ['Görüşme', 'Form'],
  insurance: ['Form', 'AI'],
}

function resolveCurrentProfileValue(
  farmer: Farmer,
  category: MemoryCategory,
): string {
  switch (category) {
    case 'communication':
      return farmer.preferredChannel || '—'
    case 'production':
      return (
        [farmer.productionType, farmer.production.product]
          .filter((part) => part && part !== '—')
          .join(' · ') || '—'
      )
    case 'finance':
      return farmer.finance.creditNeed || '—'
    case 'insurance':
      return farmer.insurance.status || '—'
  }
}

function resolveEvidenceKind(item: AIMemoryItem): 'quote' | 'image' | 'document' {
  const text = `${item.title} ${item.detail}`.toLocaleLowerCase('tr-TR')
  if (text.includes('görsel') || text.includes('foto') || text.includes('image')) {
    return 'image'
  }
  if (text.includes('belge') || text.includes('doküman') || text.includes('pdf')) {
    return 'document'
  }
  return 'quote'
}

type MemoryItemCardProps = {
  item: AIMemoryItem
  farmer: Farmer
  extractedValue: string
  status: MemoryReviewStatus
  isEditing: boolean
  highlighted: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (value: string) => void
  onStatusChange: (status: MemoryReviewStatus) => void
}

function MemoryItemCard({
  item,
  farmer,
  extractedValue,
  status,
  isEditing,
  highlighted,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStatusChange,
}: MemoryItemCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [draftValue, setDraftValue] = useState(extractedValue)
  const [saveError, setSaveError] = useState(false)
  const { showToast } = useFarmerToast()

  useEffect(() => {
    if (isEditing) {
      setExpanded(false)
      setDraftValue(extractedValue)
      setSaveError(false)
    }
  }, [isEditing, extractedValue])

  const evidenceKind = resolveEvidenceKind(item)
  const percent = confidencePercent[item.confidence]
  const currentValue = resolveCurrentProfileValue(farmer, item.category)
  const sources = sourceChipsByCategory[item.category]
  const fieldLabel = categoryFieldLabels[item.category]

  const handleSave = () => {
    const trimmed = draftValue.trim()
    if (!trimmed) {
      setSaveError(true)
      return
    }
    onSaveEdit(trimmed)
  }

  return (
    <li
      id={`ai-memory-item-${item.id}`}
      className={`f360-card-interactive overflow-hidden rounded-xl border bg-white shadow-sm ${
        highlighted
          ? 'f360-highlight-pulse border-emerald-400 ring-2 ring-emerald-200'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-gray-500">{fieldLabel}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-900">{extractedValue}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusBadge label={statusLabels[status]} />
            <time dateTime={item.updatedAt} className="text-[11px] text-gray-400">
              {formatRelativeTime(item.updatedAt)}
            </time>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-3.5">
        <div className="rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-700">
            {evidenceKind === 'image' ? (
              <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            ) : evidenceKind === 'document' ? (
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Quote className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {evidenceKind === 'image'
              ? 'Görsel kanıt'
              : evidenceKind === 'document'
                ? 'Belge kanıtı'
                : 'Orijinal ifade'}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-700 italic">
            “{item.detail}”
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2">
            <p className="text-[11px] font-medium text-emerald-700">Çıkarılan değer</p>
            {isEditing ? (
              <div className="mt-1.5">
                <input
                  type="text"
                  value={draftValue}
                  onChange={(event) => {
                    setDraftValue(event.target.value)
                    if (saveError) {
                      setSaveError(false)
                    }
                  }}
                  className={`f360-focus w-full rounded-md border bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ${
                    saveError ? 'border-red-300' : 'border-emerald-200'
                  }`}
                  aria-label="Çıkarılan değeri düzenle"
                />
                {saveError && (
                  <p className="mt-1 text-[11px] text-red-600">
                    Boş değer kaydedilemez.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {extractedValue}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-[11px] font-medium text-gray-500">Profildeki değer</p>
            <p className="mt-0.5 break-words text-sm font-semibold text-gray-800">
              {currentValue}
            </p>
          </div>
        </div>

        {!isEditing && (
          <>
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-[11px] font-medium ${confidenceLabelClass[item.confidence]}`}
                  >
                    Güven skoru · %{percent}
                  </p>
                  <InfoTooltip
                    label="Güven skoru hakkında bilgi"
                    text={TOOLTIP_COPY.confidence}
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  {item.confidence === 'high'
                    ? 'Yüksek'
                    : item.confidence === 'medium'
                      ? 'Orta'
                      : 'Düşük'}
                </p>
              </div>
              <div
                className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${confidenceTrackClass[item.confidence]}`}
              >
                <div
                  className={`h-full rounded-full ${confidenceBarClass[item.confidence]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="f360-focus inline-flex items-center gap-1 rounded-md text-[11px] font-medium text-gray-600 transition-colors hover:text-gray-900"
                aria-expanded={expanded}
              >
                Ayrıntılar
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {expanded && (
                <div className="f360-accordion-open mt-2 space-y-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-[11px] leading-relaxed text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Alan:</span> {fieldLabel}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Özet:</span>{' '}
                    {item.detail}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Güven skoru:</span>{' '}
                    {item.confidence === 'high'
                      ? 'Yüksek'
                      : item.confidence === 'medium'
                        ? 'Orta'
                        : 'Düşük'}{' '}
                    (%{percent})
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Son güncelleme:</span>{' '}
                    {formatRelativeTime(item.updatedAt)}
                  </p>
                </div>
              )}
            </div>

            {(showSources || expanded) && (
              <div className="flex flex-wrap gap-1.5">
                {sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600"
                  >
                    {source}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-gray-50/80 px-3 py-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <Check className="h-3 w-3" aria-hidden="true" />
            Kaydet
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100"
          >
            Vazgeç
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-gray-50/80 px-3 py-2.5">
          <button
            type="button"
            onClick={() => {
              onStatusChange('approved')
              showToast('AI hafızası onaylandı')
            }}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <Check className="h-3 w-3" aria-hidden="true" />
            Onayla
          </button>
          <button
            type="button"
            onClick={onStartEdit}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-50"
          >
            <Pencil className="h-3 w-3" aria-hidden="true" />
            Düzelt
          </button>
          <button
            type="button"
            onClick={() => {
              onStatusChange('rejected')
              showToast('AI hafızası reddedildi')
            }}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Reddet
          </button>
          <button
            type="button"
            onClick={() => {
              onStatusChange('stale')
              showToast('AI hafızası eskimiş olarak işaretlendi', 'info')
            }}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100"
          >
            Eskimiş
          </button>
          <button
            type="button"
            onClick={() => setShowSources((value) => !value)}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-violet-200 bg-white px-2 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-50"
          >
            <Link2 className="h-3 w-3" aria-hidden="true" />
            Kaynak
          </button>
        </div>
      )}
    </li>
  )
}

export default function AIMemoryCard({
  items,
  farmer,
  highlightMemoryId = null,
}: AIMemoryCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [extractedOverrides, setExtractedOverrides] = useState<Record<string, string>>(
    {},
  )
  const [statusById, setStatusById] = useState<Record<string, MemoryReviewStatus>>({})
  const { showToast } = useFarmerToast()

  return (
    <article
      id="farmer-ai-memory"
      className="flex h-full min-w-0 flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      <header>
        <div className="flex items-center gap-1.5">
          <h3 className="text-[11px] font-semibold tracking-wide text-gray-500">
            AI HAFIZA
          </h3>
          <InfoTooltip
            label="AI Hafızası hakkında bilgi"
            text={TOOLTIP_COPY.aiMemory}
          />
        </div>
        <p className="mt-0.5 text-xs leading-snug text-gray-500">
          Konuşma ve belgelerden üretilen profil önerileri — onayınızı bekliyor
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          className="mt-4"
          icon={Brain}
          title="AI Hafızası henüz oluşmadı"
          description={EMPTY_HELP_COPY.aiMemory}
        />
      ) : (
        <ul className="mt-4 flex flex-1 flex-col gap-3">
          {items.map((item) => (
            <MemoryItemCard
              key={item.id}
              item={item}
              farmer={farmer}
              extractedValue={extractedOverrides[item.id] ?? item.title}
              status={statusById[item.id] ?? 'pending'}
              isEditing={editingId === item.id}
              highlighted={highlightMemoryId === item.id}
              onStartEdit={() => setEditingId(item.id)}
              onCancelEdit={() => setEditingId(null)}
              onSaveEdit={(value) => {
                setExtractedOverrides((prev) => ({ ...prev, [item.id]: value }))
                setStatusById((prev) => ({ ...prev, [item.id]: 'edited' }))
                setEditingId(null)
                showToast('AI hafızası güncellendi')
              }}
              onStatusChange={(nextStatus) =>
                setStatusById((prev) => ({ ...prev, [item.id]: nextStatus }))
              }
            />
          ))}
        </ul>
      )}
    </article>
  )
}
