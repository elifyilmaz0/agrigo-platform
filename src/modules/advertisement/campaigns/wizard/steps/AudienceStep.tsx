import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { formatNumber } from '../../../utils/formatters.ts'
import type { AudienceDraft, CampaignDraft } from '../campaignDraft.ts'
import type { CampaignWizardStepId } from '../campaignWizardSteps.ts'
import {
  buildTargetingSummary,
  summarizeRuleCounts,
} from '../buildTargetingSummary.ts'
import {
  audienceSegmentCategoryLabels,
  getAudienceSegmentsForCompany,
  type AudienceSegment,
  type AudienceSegmentCategory,
} from '../wizardAudienceSegments.ts'
import { useTenant } from '../../../tenant/TenantProvider.tsx'
import PrivacyNotice from './PrivacyNotice.tsx'

type AudienceStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
  onGoToStep: (stepId: CampaignWizardStepId) => void
}

export default function AudienceStep({
  draft,
  errors,
  onChange,
  onGoToStep,
}: AudienceStepProps) {
  const { selectedCompanyId } = useTenant()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<AudienceSegmentCategory | 'all'>(
    'all',
  )

  const tenantSegments = useMemo(
    () => getAudienceSegmentsForCompany(draft.companyId ?? selectedCompanyId),
    [draft.companyId, selectedCompanyId],
  )

  const categories = useMemo(() => {
    const present = new Set(tenantSegments.map((segment) => segment.category))
    return Array.from(present)
  }, [tenantSegments])

  const filteredSegments = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR')
    return tenantSegments.filter((segment) => {
      if (category !== 'all' && segment.category !== category) return false
      if (!normalized) return true
      return (
        segment.name.toLocaleLowerCase('tr-TR').includes(normalized) ||
        segment.description.toLocaleLowerCase('tr-TR').includes(normalized)
      )
    })
  }, [query, category, tenantSegments])

  const selectedSegment = tenantSegments.find(
    (segment) => segment.id === draft.audience.segmentId,
  )

  function setMode(mode: NonNullable<AudienceDraft['mode']>) {
    onChange({
      audience: {
        ...draft.audience,
        mode,
        ...(mode === 'saved-segment'
          ? {}
          : {
              segmentId: draft.audience.segmentId,
            }),
        ...(mode === 'rule-based'
          ? {
              segmentId: null,
              segmentName: draft.audience.segmentName || 'Özel Hedef Kitle',
              estimatedSize: draft.audience.estimatedSize,
            }
          : {}),
      },
    })
  }

  function selectSegment(segment: AudienceSegment) {
    onChange({
      audience: {
        mode: 'saved-segment',
        segmentId: segment.id,
        segmentName: segment.name,
        estimatedSize: segment.estimatedSize,
        lastCalculatedAt: segment.updatedAt,
      },
    })
  }

  const ruleCounts = summarizeRuleCounts(draft.targetingRules)
  const ruleSummary = buildTargetingSummary(draft.targetingRules)

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Hedef Kitle Modu
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Hazır segment kullanın veya anonim kurallarla özel hedef kitle
            oluşturun.
          </p>
        </div>

        <div
          id="wiz-audience-mode"
          role="radiogroup"
          aria-labelledby="wiz-audience-mode-label"
          aria-describedby={
            errors['audience-mode'] ? 'wiz-audience-mode-error' : undefined
          }
          tabIndex={-1}
          className="grid gap-3 sm:grid-cols-2 outline-none"
        >
          <p id="wiz-audience-mode-label" className="sr-only">
            Hedef kitle modu
          </p>
          <ModeCard
            selected={draft.audience.mode === 'saved-segment'}
            title="Hazır Segment Kullan"
            description="AgriGO tarafından önceden tanımlanmış anonim çiftçi segmentlerinden birini seçin."
            onSelect={() => setMode('saved-segment')}
          />
          <ModeCard
            selected={draft.audience.mode === 'rule-based'}
            title="Kurallarla Hedef Kitle Oluştur"
            description="Üretim tipi, ürün, il ve diğer kriterleri kullanarak özel hedef kitle oluşturun."
            onSelect={() => setMode('rule-based')}
          />
        </div>
        {errors['audience-mode'] ? (
          <p id="wiz-audience-mode-error" className="mt-2 text-[11px] text-red-600">
            {errors['audience-mode']}
          </p>
        ) : null}
      </section>

      {draft.audience.mode === 'saved-segment' ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <section className="min-w-0 flex-1 space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Hazır Segmentler
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Tüm segmentler anonim ve toplulaştırılmış mock veridir.
              </p>
            </div>

            {(selectedSegment || draft.audience.segmentId) && (
              <SelectedSegmentSummary
                name={selectedSegment?.name ?? draft.audience.segmentName}
                description={
                  selectedSegment?.description ??
                  'Seçilen anonim hedef kitle segmenti.'
                }
                category={
                  selectedSegment
                    ? audienceSegmentCategoryLabels[selectedSegment.category]
                    : 'Segment'
                }
                estimatedSize={
                  selectedSegment?.estimatedSize ??
                  draft.audience.estimatedSize
                }
                criteriaCount={selectedSegment?.criteriaCount ?? null}
              />
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
              <div>
                <label
                  htmlFor="wiz-audience-search"
                  className="mb-1.5 block text-xs font-medium text-slate-700"
                >
                  Segment Ara
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    id="wiz-audience-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Segment adı veya açıklama ara"
                    className="h-9 w-full rounded-md border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="wiz-audience-category"
                  className="mb-1.5 block text-xs font-medium text-slate-700"
                >
                  Kategori
                </label>
                <select
                  id="wiz-audience-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as AudienceSegmentCategory | 'all',
                    )
                  }
                  className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400"
                >
                  <option value="all">Tümü</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {audienceSegmentCategoryLabels[item]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {filteredSegments.length} segment bulundu
            </p>

            {errors['audience-segmentId'] ? (
              <p
                id="wiz-audience-segmentId-error"
                className="text-[11px] text-red-600"
                role="alert"
              >
                {errors['audience-segmentId']}
              </p>
            ) : null}

            <div
              id="wiz-audience-segmentId"
              role="radiogroup"
              aria-labelledby="wiz-audience-segment-label"
              tabIndex={-1}
              className="outline-none"
            >
              <p id="wiz-audience-segment-label" className="sr-only">
                Segment seçimi
              </p>
              {filteredSegments.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-200 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    Aramanızla eşleşen segment bulunamadı.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Farklı bir arama yapabilir veya kurallarla özel hedef kitle
                    oluşturabilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredSegments.map((segment) => {
                    const selected = draft.audience.segmentId === segment.id
                    return (
                      <button
                        key={segment.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectSegment(segment)}
                        className={`rounded-lg border p-4 text-left transition-colors ${
                          selected
                            ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {segment.name}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {
                                audienceSegmentCategoryLabels[
                                  segment.category
                                ]
                              }
                            </p>
                          </div>
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                              selected
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                            aria-hidden
                          >
                            {selected ? <Check className="h-3 w-3" /> : null}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-medium text-emerald-700">
                          Tahmini {formatNumber(segment.estimatedSize)} çiftçi
                        </p>
                        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                          {segment.description}
                        </p>
                        <p className="mt-3 text-[11px] text-slate-500">
                          {segment.criteriaCount} kriter · Güncelleme:{' '}
                          {segment.updatedAt}
                        </p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <div className="w-full shrink-0 space-y-4 lg:w-[340px]">
            <PrivacyNotice />
          </div>
        </div>
      ) : null}

      {draft.audience.mode === 'rule-based' ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <section className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Özel hedef kitle oluşturun
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Üretim tipi, ürün, il, işletme ölçeği ve diğer kriterleri
              kullanarak kampanyaya özel hedef kitle tanımlayın.
            </p>

            <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 px-3.5 py-3">
              <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                Mevcut kural özeti
              </p>
              {ruleCounts.length === 0 ? (
                <p className="mt-2 text-xs text-slate-600">
                  Henüz hedefleme kuralı eklenmedi.
                </p>
              ) : (
                <>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {ruleCounts.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    {ruleSummary}
                  </p>
                  {draft.audience.estimatedSize != null ? (
                    <p className="mt-2 text-xs font-medium text-emerald-700">
                      Tahmini {formatNumber(draft.audience.estimatedSize)}{' '}
                      çiftçi
                    </p>
                  ) : null}
                </>
              )}
            </div>

            {errors['audience-rules'] ? (
              <p
                id="wiz-audience-rules-error"
                className="mt-2 text-[11px] text-red-600"
                role="alert"
              >
                {errors['audience-rules']}
              </p>
            ) : null}

            <button
              type="button"
              id="wiz-audience-rules"
              onClick={() => onGoToStep('targeting-rules')}
              className="mt-4 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Hedef Kurallarını Düzenle
            </button>
          </section>
          <div className="w-full shrink-0 space-y-4 lg:w-[340px]">
            <PrivacyNotice />
          </div>
        </div>
      ) : null}

      {!draft.audience.mode ? (
        <PrivacyNotice />
      ) : null}
    </div>
  )
}

function ModeCard({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean
  title: string
  description: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-lg border p-4 text-left transition-colors ${
        selected
          ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-200'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            {description}
          </p>
        </div>
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-slate-300 bg-white'
          }`}
          aria-hidden
        >
          {selected ? <Check className="h-3 w-3" /> : null}
        </span>
      </div>
    </button>
  )
}

function SelectedSegmentSummary({
  name,
  description,
  category,
  estimatedSize,
  criteriaCount,
}: {
  name: string
  description: string
  category: string
  estimatedSize: number | null
  criteriaCount: number | null
}) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
      <p className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
        Seçilen Hedef Kitle
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{name}</p>
      <p className="mt-1 text-xs text-slate-600">
        {category}
        {criteriaCount != null ? ` · ${criteriaCount} kriter` : ''}
      </p>
      {estimatedSize != null ? (
        <p className="mt-2 text-xs font-medium text-emerald-800">
          Tahmini {formatNumber(estimatedSize)} çiftçi
        </p>
      ) : null}
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        {description}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
        Bu sayı anonim ve toplulaştırılmış bir tahmindir. Reklamverene çiftçi
        isimleri veya iletişim bilgileri gösterilmez.
      </p>
    </div>
  )
}
