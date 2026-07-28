import { useMemo, useState } from 'react'
import { Plus, Search, Sparkles, X } from 'lucide-react'
import EmptyState from '../components/EmptyState.tsx'
import MetricCard from '../components/MetricCard.tsx'
import PageHeader from '../components/PageHeader.tsx'
import UnauthorizedCompanyAccess from '../components/UnauthorizedCompanyAccess.tsx'
import {
  getAudienceDatasetForCompany,
  getEmptyAudienceDataset,
} from '../data/audience.ts'
import { useToast } from '../hooks/useToast.tsx'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type {
  AudienceCreatedFilter,
  AudienceSegmentRecord,
  AudienceSegmentStatus,
  AudienceUsageFilter,
} from '../types/audience.ts'
import { formatDate, formatNumber } from '../utils/formatters.ts'

const REFERENCE_NOW = new Date('2026-07-27T12:00:00').getTime()

const statusLabels: Record<AudienceSegmentStatus, string> = {
  active: 'Aktif',
  inactive: 'Pasif',
  draft: 'Taslak',
}

const statusBadgeStyles: Record<AudienceSegmentStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-50 text-slate-600 border-slate-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
}

function matchesCreatedFilter(
  createdAt: string,
  filter: AudienceCreatedFilter,
): boolean {
  if (filter === 'all') return true
  const created = new Date(`${createdAt}T12:00:00`).getTime()
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90
  return REFERENCE_NOW - created <= days * 24 * 60 * 60 * 1000
}

export default function AudiencePage() {
  const { selectedCompany, selectedCompanyId, canAccessSelectedCompany } =
    useTenant()
  const { showToast, toastNode } = useToast()

  const [nameQuery, setNameQuery] = useState('')
  const [status, setStatus] = useState<AudienceSegmentStatus | 'all'>('all')
  const [usage, setUsage] = useState<AudienceUsageFilter>('all')
  const [createdFilter, setCreatedFilter] =
    useState<AudienceCreatedFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const dataset = useMemo(() => {
    if (!selectedCompanyId || !canAccessSelectedCompany) {
      return getEmptyAudienceDataset(selectedCompanyId)
    }
    return (
      getAudienceDatasetForCompany(selectedCompanyId) ??
      getEmptyAudienceDataset(selectedCompanyId)
    )
  }, [selectedCompanyId, canAccessSelectedCompany])

  const filteredSegments = useMemo(() => {
    const normalized = nameQuery.trim().toLowerCase()
    return dataset.segments.filter((segment) => {
      const matchesName =
        !normalized ||
        segment.name.toLowerCase().includes(normalized) ||
        segment.description.toLowerCase().includes(normalized)
      const matchesStatus = status === 'all' || segment.status === status
      const matchesUsage =
        usage === 'all' ||
        (usage === 'used'
          ? segment.campaignUsageCount > 0
          : segment.campaignUsageCount === 0)
      const matchesCreated = matchesCreatedFilter(
        segment.createdAt,
        createdFilter,
      )
      return matchesName && matchesStatus && matchesUsage && matchesCreated
    })
  }, [dataset.segments, nameQuery, status, usage, createdFilter])

  const filteredKpis = useMemo(() => {
    const totalSegments = filteredSegments.length
    const activeSegments = filteredSegments.filter(
      (s) => s.status === 'active',
    ).length
    const usedInCampaigns = filteredSegments.filter(
      (s) => s.campaignUsageCount > 0,
    ).length
    const averageSegmentSize =
      totalSegments === 0
        ? 0
        : Math.round(
            filteredSegments.reduce((sum, s) => sum + s.estimatedSize, 0) /
              totalSegments,
          )
    return {
      totalSegments,
      activeSegments,
      usedInCampaigns,
      averageSegmentSize,
    }
  }, [filteredSegments])

  if (!canAccessSelectedCompany || !selectedCompanyId) {
    return <UnauthorizedCompanyAccess />
  }

  const companyName = selectedCompany?.name ?? 'Reklam Hesabı'
  const filtersActive =
    nameQuery.trim() !== '' ||
    status !== 'all' ||
    usage !== 'all' ||
    createdFilter !== 'all'
  const kpis = filtersActive ? filteredKpis : dataset.kpis

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hedef Kitle"
        context={`${companyName} Reklam Hesabı`}
        description="Kampanyalarınız için kayıtlı segmentleri ve hedef kitle kurallarını yönetin."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Yeni Hedef Kitle
          </button>
        }
      />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block space-y-1.5 sm:col-span-2 xl:col-span-1">
            <span className="text-[11px] font-medium text-slate-500">
              Segment adı
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={nameQuery}
                onChange={(event) => setNameQuery(event.target.value)}
                placeholder="Segment ara…"
                className="w-full rounded-md border border-slate-200 bg-white py-2 pr-2.5 pl-8 text-xs text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </label>

          <FilterField label="Durum">
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AudienceSegmentStatus | 'all')
              }
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tüm durumlar</option>
              <option value="active">Aktif</option>
              <option value="draft">Taslak</option>
              <option value="inactive">Pasif</option>
            </select>
          </FilterField>

          <FilterField label="Kampanyada kullanılıyor">
            <select
              value={usage}
              onChange={(event) =>
                setUsage(event.target.value as AudienceUsageFilter)
              }
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tümü</option>
              <option value="used">Kullanılıyor</option>
              <option value="unused">Kullanılmıyor</option>
            </select>
          </FilterField>

          <FilterField label="Oluşturulma tarihi">
            <select
              value={createdFilter}
              onChange={(event) =>
                setCreatedFilter(event.target.value as AudienceCreatedFilter)
              }
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tüm tarihler</option>
              <option value="7d">Son 7 gün</option>
              <option value="30d">Son 30 gün</option>
              <option value="90d">Son 90 gün</option>
            </select>
          </FilterField>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Segment Özeti</h2>
        <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Toplam Segment"
            value={formatNumber(kpis.totalSegments)}
            hint={filtersActive ? 'Filtrelenmiş sonuç' : 'Kayıtlı tüm segmentler'}
          />
          <MetricCard
            label="Aktif Segment"
            value={formatNumber(kpis.activeSegments)}
            accent="emerald"
            hint="Yayında kullanılabilir"
          />
          <MetricCard
            label="Kampanyada Kullanılan"
            value={formatNumber(kpis.usedInCampaigns)}
            accent="sky"
            hint="En az bir kampanyada bağlı"
          />
          <MetricCard
            label="Ortalama Segment Büyüklüğü"
            value={formatNumber(kpis.averageSegmentSize)}
            hint="Hedef çiftçi sayısı ortalaması"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Segment Listesi
          </h2>
          <p className="text-xs text-slate-500">
            {filteredSegments.length} segment
          </p>
        </div>

        {filteredSegments.length === 0 ? (
          <EmptyState
            title="Segment bulunamadı"
            description="Seçili filtrelere uygun hedef kitle segmenti yok. Filtreleri temizleyin veya yeni segment oluşturun."
            action={
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Yeni Hedef Kitle
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredSegments.map((segment) => (
              <SegmentCard
                key={segment.id}
                segment={segment}
                expanded={expandedId === segment.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === segment.id ? null : segment.id,
                  )
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-800">
            AI Segment Özeti
          </h2>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
          {dataset.aiInsights.length === 0 ? (
            <p className="text-sm text-slate-600">
              Bu şirket için henüz AI özeti bulunmuyor.
            </p>
          ) : (
            <ul className="space-y-2">
              {dataset.aiInsights.map((insight) => (
                <li
                  key={insight}
                  className="flex gap-2 text-sm leading-relaxed text-slate-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {createOpen ? (
        <CreateAudienceModal
          companyName={companyName}
          onClose={() => setCreateOpen(false)}
          onConfirm={(draftName) => {
            showToast(`“${draftName}” taslağı oluşturuldu (mock).`)
            setCreateOpen(false)
          }}
        />
      ) : null}

      {toastNode}
    </div>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function SegmentCard({
  segment,
  expanded,
  onToggle,
}: {
  segment: AudienceSegmentRecord
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {segment.name}
            </h3>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusBadgeStyles[segment.status]}`}
            >
              {statusLabels[segment.status]}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {segment.description}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          {expanded ? 'Kuralları gizle' : 'Kuralları göster'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <MiniStat
          label="Hedef çiftçi sayısı"
          value={formatNumber(segment.estimatedSize)}
        />
        <MiniStat
          label="Son güncelleme"
          value={formatDate(segment.updatedAt)}
        />
        <MiniStat
          label="Kullanıldığı kampanya"
          value={formatNumber(segment.campaignUsageCount)}
        />
        <MiniStat label="Oluşturulma" value={formatDate(segment.createdAt)} />
      </div>

      {expanded ? (
        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            Segment kuralları özeti
          </p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {segment.rules.map((rule) => (
              <div
                key={`${segment.id}-${rule.label}`}
                className="rounded-md border border-slate-100 bg-white px-2.5 py-2"
              >
                <dt className="text-[10px] font-medium text-slate-500">
                  {rule.label}
                </dt>
                <dd className="mt-0.5 text-xs font-semibold text-slate-800">
                  {rule.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {segment.rules.slice(0, 3).map((rule) => (
            <span
              key={`${segment.id}-chip-${rule.label}`}
              className="inline-flex max-w-full items-center truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
            >
              {rule.label}: {rule.value}
            </span>
          ))}
          {segment.rules.length > 3 ? (
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
              +{segment.rules.length - 3}
            </span>
          ) : null}
        </div>
      )}
    </article>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/80 px-2.5 py-2">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function CreateAudienceModal({
  companyName,
  onClose,
  onConfirm,
}: {
  companyName: string
  onClose: () => void
  onConfirm: (draftName: string) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const canSubmit = name.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-audience-title"
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-emerald-700">{companyName}</p>
            <h3
              id="create-audience-title"
              className="mt-1 text-sm font-semibold text-slate-900"
            >
              Yeni Hedef Kitle
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Segment taslağı oluşturun. Kural sihirbazı sonraki adımda
              eklenecektir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">
              Segment adı
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Ege Damla Sulama Üreticileri"
              className="w-full rounded-md border border-slate-200 px-2.5 py-2 text-xs text-slate-700"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-medium text-slate-500">
              Açıklama
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Segmentin kimleri hedeflediğini kısaca yazın."
              className="w-full resize-none rounded-md border border-slate-200 px-2.5 py-2 text-xs text-slate-700"
            />
          </label>
          {description.trim() ? (
            <p className="text-[11px] leading-relaxed text-slate-500">
              Önizleme: {description.trim()}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm(name.trim())}
            className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Taslak Oluştur
          </button>
        </div>
      </div>
    </div>
  )
}
