import { useEffect, useMemo, useState } from 'react'
import { Check, ClipboardList, Pencil, X } from 'lucide-react'
import type { Farmer, FarmerOperationItem } from '../../../types/farmer.ts'
import { getFarmerOperations } from '../../../utils/getFarmerOperations.ts'
import { formatRelativeTime } from '../../../utils/formatTimelineDate.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import InfoTooltip from '../../shared/InfoTooltip.tsx'
import StatusBadge from '../../shared/StatusBadge.tsx'
import {
  EMPTY_HELP_COPY,
  TOOLTIP_COPY,
} from '../../shared/explainabilityCopy.ts'
import { useFarmerToast } from '../../shared/useFarmerToast.ts'
import SideDrawer from './SideDrawer.tsx'

export type OperationsFilter = 'all' | 'ai_review' | 'manual'

type OperationsCenterDrawerProps = {
  open: boolean
  farmer: Farmer
  initialFilter?: OperationsFilter
  onClose: () => void
}

type ItemStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'deferred'

type ItemState = {
  status: ItemStatus
  titleOverride?: string
}

const FILTERS: { id: OperationsFilter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'ai_review', label: 'AI İncelemesi' },
  { id: 'manual', label: 'Manuel Görevler' },
]

const confidenceBarClass = {
  high: 'bg-emerald-500',
  medium: 'bg-amber-500',
  low: 'bg-rose-400',
} as const

const confidenceTrackClass = {
  high: 'bg-emerald-100',
  medium: 'bg-amber-100',
  low: 'bg-rose-100',
} as const

const confidenceLabel = {
  high: 'Yüksek',
  medium: 'Orta',
  low: 'Düşük',
} as const

function stateKey(farmerId: string, itemId: string) {
  return `${farmerId}:${itemId}`
}

function isActivePending(status: ItemStatus) {
  return status === 'pending'
}

export default function OperationsCenterDrawer({
  open,
  farmer,
  initialFilter = 'all',
  onClose,
}: OperationsCenterDrawerProps) {
  const [filter, setFilter] = useState<OperationsFilter>(initialFilter)
  const [itemState, setItemState] = useState<Record<string, ItemState>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [saveError, setSaveError] = useState(false)
  const { showToast } = useFarmerToast()

  useEffect(() => {
    if (open) {
      setFilter(initialFilter)
    }
  }, [open, initialFilter])

  const baseItems = useMemo(() => getFarmerOperations(farmer), [farmer])

  const resolvedItems = baseItems.map((item) => {
    const key = stateKey(farmer.id, item.id)
    const state = itemState[key]
    return {
      ...item,
      title: state?.titleOverride ?? item.title,
      status: state?.status ?? ('pending' as ItemStatus),
    }
  })

  const pendingItems = resolvedItems.filter((item) => isActivePending(item.status))

  const counts = {
    all: pendingItems.length,
    ai_review: pendingItems.filter((item) => item.kind === 'ai_review').length,
    manual: pendingItems.filter((item) => item.kind === 'manual').length,
  }

  const visibleItems =
    filter === 'all'
      ? pendingItems
      : pendingItems.filter((item) => item.kind === filter)

  const updateStatus = (itemId: string, status: ItemStatus) => {
    const key = stateKey(farmer.id, itemId)
    setItemState((prev) => ({
      ...prev,
      [key]: { ...prev[key], status },
    }))
    if (editingId === itemId) {
      setEditingId(null)
    }

    if (status === 'accepted') {
      showToast('AI incelemesi kabul edildi')
    } else if (status === 'rejected') {
      showToast('AI incelemesi reddedildi')
    } else if (status === 'completed') {
      showToast('Manuel görev tamamlandı')
    } else if (status === 'deferred') {
      showToast('Görev ertelendi', 'info')
    }
  }

  const startEdit = (item: FarmerOperationItem & { title: string }) => {
    setEditingId(item.id)
    setDraftTitle(item.title)
    setSaveError(false)
  }

  const saveEdit = (itemId: string) => {
    const trimmed = draftTitle.trim()
    if (!trimmed) {
      setSaveError(true)
      return
    }
    const key = stateKey(farmer.id, itemId)
    setItemState((prev) => ({
      ...prev,
      [key]: {
        status: prev[key]?.status ?? 'pending',
        titleOverride: trimmed,
      },
    }))
    setEditingId(null)
    setSaveError(false)
    showToast('Operasyon notu güncellendi')
  }

  return (
    <SideDrawer
      open={open}
      title="Operasyon Merkezi"
      subtitle="İnceleme ve görevler tek ekranda"
      icon={ClipboardList}
      onClose={onClose}
    >
      <div className="mb-3 flex items-start gap-1.5">
        <InfoTooltip
          label="Operasyon Merkezi hakkında bilgi"
          text={TOOLTIP_COPY.operationsCenter}
        />
        <p className="text-[11px] leading-relaxed text-gray-500">
          AI incelemeleri ve manuel görevler burada toplanır.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Operasyon filtreleri"
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
              {item.label} ({counts[item.id]})
            </button>
          )
        })}
      </div>

      {visibleItems.length === 0 ? (
        <EmptyState
          className="mt-5"
          icon={ClipboardList}
          title="Bekleyen operasyon yok"
          description={EMPTY_HELP_COPY.operations}
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {visibleItems.map((item) => {
            const isEditing = editingId === item.id

            return (
              <li
                key={item.id}
                className="f360-card-interactive rounded-xl border border-gray-200 bg-white px-3.5 py-3 hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={item.kind === 'ai_review' ? 'AI İncelemesi' : 'Manuel Görev'}
                  />
                  {item.kind === 'ai_review' && (
                    <InfoTooltip
                      label="AI İncelemesi hakkında bilgi"
                      text={TOOLTIP_COPY.aiReview}
                    />
                  )}
                  {item.module && (
                    <StatusBadge label={item.module} tone="neutral" />
                  )}
                  {item.priority && item.kind === 'manual' && (
                    <span className="text-[10px] font-medium text-gray-400">
                      Öncelik: {item.priority === 'high' ? 'Yüksek' : 'Orta'}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(event) => {
                        setDraftTitle(event.target.value)
                        if (saveError) {
                          setSaveError(false)
                        }
                      }}
                      className={`f360-focus w-full rounded-md border px-2.5 py-1.5 text-sm font-semibold text-gray-900 ${
                        saveError ? 'border-red-300' : 'border-gray-200'
                      }`}
                      aria-label="Operasyon başlığını düzenle"
                    />
                    {saveError && (
                      <p className="mt-1 text-[11px] text-red-600">
                        Boş değer kaydedilemez.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-semibold leading-snug text-gray-900">
                    {item.title}
                  </p>
                )}

                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  {item.description}
                </p>

                {item.sourceLabel && (
                  <p className="mt-2 inline-flex rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    {item.sourceLabel}
                  </p>
                )}

                {item.kind === 'ai_review' &&
                  item.confidence &&
                  item.confidencePercent != null && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] font-medium text-gray-600">
                            Güven skoru · {confidenceLabel[item.confidence]} %
                            {item.confidencePercent}
                          </p>
                          <InfoTooltip
                            label="Güven skoru hakkında bilgi"
                            text={TOOLTIP_COPY.confidence}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Tespit: {formatRelativeTime(item.detectedAt)}
                        </p>
                      </div>
                      <div
                        className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${confidenceTrackClass[item.confidence]}`}
                      >
                        <div
                          className={`h-full rounded-full ${confidenceBarClass[item.confidence]}`}
                          style={{ width: `${item.confidencePercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                {item.kind === 'manual' && (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
                    {item.dueLabel && <span>Termin: {item.dueLabel}</span>}
                    <span>Oluşturulma: {formatRelativeTime(item.detectedAt)}</span>
                  </div>
                )}

                {isEditing ? (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => saveEdit(item.id)}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setSaveError(false)
                      }}
                      className="f360-focus inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : item.kind === 'ai_review' ? (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'accepted')}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Kabul Et
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-50"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'rejected')}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                      Reddet
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'completed')}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      <Check className="h-3 w-3" aria-hidden="true" />
                      Tamamla
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-[11px] font-medium text-sky-700 hover:bg-sky-50"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'deferred')}
                      className="f360-focus inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Ertele
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </SideDrawer>
  )
}
