import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  ClipboardCopy,
  Lightbulb,
  Printer,
  Sparkles,
} from 'lucide-react'
import {
  getProductBrand,
  getProductById,
  getProductDiscountedPrice,
  getProductListPrice,
} from '../../../data/products.ts'
import { getProductSalesStatusLabel } from '../../../data/productSalesStatus.ts'
import { getProductStockStatusLabel } from '../../../data/productStockStatus.ts'
import {
  formatCurrency,
  formatCurrencyTRY,
  formatNumber,
} from '../../../utils/formatters.ts'
import { analyzeCampaignOpportunities } from '../analyzeCampaignOpportunities.ts'
import { analyzeCampaignRisks } from '../analyzeCampaignRisks.ts'
import { getBidStrategyLabel } from '../bidStrategies.ts'
import { getBudgetModelLabel } from '../budgetModels.ts'
import {
  buildTargetingSummary,
  countMeaningfulTargetingGroups,
} from '../buildTargetingSummary.ts'
import { calculateCampaignBudgetEstimates } from '../calculateCampaignBudgetEstimates.ts'
import {
  calculateCampaignOfferPrice,
  getCatalogEffectivePrice,
} from '../calculateCampaignOfferPrice.ts'
import { calculateCampaignReadiness } from '../calculateCampaignReadiness.ts'
import type { CampaignDraft } from '../campaignDraft.ts'
import { formatSelectedDeliveryDays } from '../campaignDeliveryDays.ts'
import { getCampaignObjectiveLabel } from '../campaignObjectives.ts'
import { getCampaignOfferTypeLabel } from '../campaignOfferTypes.ts'
import {
  assistantPriorityLabels,
  deriveOverallRiskLevel,
  overallRiskLabels,
  previewSectionStatusLabels,
  readinessStatusLabels,
  riskSeverityLabels,
  type PreviewSectionStatus,
} from '../campaignReadinessTypes.ts'
import { getCampaignTypeLabel } from '../campaignTypes.ts'
import type { CampaignWizardStepId } from '../campaignWizardSteps.ts'
import {
  validateAudienceStep,
  validateBudgetStep,
  validateCampaignInfo,
  validateCreativeStep,
  validateProductStep,
  validateScheduleStep,
  validateTargetingRulesStep,
} from '../campaignWizardValidation.ts'
import { getCreativeCallToActionLabel } from '../creativeCallToActions.ts'
import { generateCampaignAssistantSuggestions } from '../generateCampaignAssistantSuggestions.ts'
import { sanitizeCampaignDraftForExport } from '../sanitizeCampaignDraftForExport.ts'
import { formatScheduleDateTime } from '../scheduleDateHelpers.ts'
import {
  getTargetingOptionLabel,
  targetingCropOptions,
  targetingFarmScaleOptions,
  targetingProductionTypeOptions,
  targetingProvinceOptions,
} from '../targetingConfigs.ts'
import { getTimezoneLabel } from '../timezoneOptions.ts'
import {
  audienceSegmentCategoryLabels,
  getAudienceSegmentById,
} from '../wizardAudienceSegments.ts'

type PreviewStepProps = {
  draft: CampaignDraft
  onGoToStep: (stepId: CampaignWizardStepId) => void
}

export default function PreviewStep({ draft, onGoToStep }: PreviewStepProps) {
  const [jsonOpen, setJsonOpen] = useState(false)
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const savedSegment = draft.audience.segmentId
    ? getAudienceSegmentById(draft.audience.segmentId, draft.companyId)
    : undefined
  const listPrice = product ? getProductListPrice(product) : null
  const discountedPrice = product ? getProductDiscountedPrice(product) : null
  const catalogEffective = getCatalogEffectivePrice(listPrice, discountedPrice)
  const campaignOfferPrice = calculateCampaignOfferPrice({
    listPrice,
    discountedPrice,
    offer: draft.creative.offer,
  })
  const targetingSummary = buildTargetingSummary(draft.targetingRules)
  const ruleGroupCount = countMeaningfulTargetingGroups(draft.targetingRules)
  const budgetEstimates = calculateCampaignBudgetEstimates({
    budget: draft.budget,
    schedule: draft.schedule,
    audienceEstimatedSize: draft.audience.estimatedSize,
    campaignType: draft.campaignType,
  })
  const readiness = calculateCampaignReadiness(draft)
  const risks = analyzeCampaignRisks(draft)
  const opportunities = analyzeCampaignOpportunities(draft)
  const suggestions = generateCampaignAssistantSuggestions(draft)
  const overallRisk = deriveOverallRiskLevel(risks)

  const startLabel =
    draft.schedule.startMode === 'now'
      ? 'Hemen başlat'
      : formatScheduleDateTime(draft.schedule.startDate, draft.schedule.startTime)
  const endLabel =
    draft.schedule.endMode === 'no-end-date'
      ? 'Bitiş tarihi yok'
      : formatScheduleDateTime(draft.schedule.endDate, draft.schedule.endTime)

  const audienceModeLabel =
    draft.audience.mode === 'saved-segment'
      ? 'Hazır Segment'
      : draft.audience.mode === 'rule-based'
        ? 'Özel Hedef Kitle'
        : 'Henüz belirlenmedi'

  const sectionStatuses = useMemo(
    () => ({
      info: statusFromValid(validateCampaignInfo(draft).valid),
      product: statusFromValid(validateProductStep(draft).valid),
      creative: statusFromValid(validateCreativeStep(draft).valid),
      audience: statusFromValid(validateAudienceStep(draft).valid),
      targeting:
        draft.audience.mode === 'saved-segment'
          ? ('saved-segment' as const)
          : statusFromValid(validateTargetingRulesStep(draft).valid),
      schedule: statusFromValid(validateScheduleStep(draft).valid),
      budget: statusFromValid(validateBudgetStep(draft).valid),
      privacy:
        readiness.requiredChecks.find((c) => c.id === 'consent')?.passed
          ? ('ready' as const)
          : ('incomplete' as const),
    }),
    [draft, readiness.requiredChecks],
  )

  return (
    <div className="campaign-wizard-preview space-y-4">
      <header className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">
          Kampanya Son Kontrolü
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Kampanyayı yayın simülasyonuna göndermeden önce tüm bilgileri,
          tahminleri ve hazırlık durumunu inceleyin.
        </p>
        <ExportActions
          onPrint={() => window.print()}
          onJsonPreview={() => setJsonOpen(true)}
        />
      </header>

      <section
        aria-labelledby="executive-summary-heading"
        className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3
              id="executive-summary-heading"
              className="text-sm font-semibold text-slate-900"
            >
              Yönetici Özeti
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyanın kritik metriklerine hızlı bakış.
            </p>
          </div>
          <ReadinessBadge status={readiness.status} />
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Kampanya" value={draft.name || 'Henüz belirlenmedi'} />
          <Kpi
            label="Amaç"
            value={getCampaignObjectiveLabel(draft.objective) || 'Henüz belirlenmedi'}
          />
          <Kpi
            label="Tür"
            value={getCampaignTypeLabel(draft.campaignType) || 'Henüz belirlenmedi'}
          />
          <Kpi label="Ürün" value={product?.name || 'Henüz belirlenmedi'} />
          <Kpi label="Hedef kitle tipi" value={audienceModeLabel} />
          <Kpi
            label="Tahmini hedef kitle"
            value={
              draft.audience.estimatedSize != null
                ? `${formatNumber(draft.audience.estimatedSize)} çiftçi`
                : 'Henüz belirlenmedi'
            }
          />
          <Kpi
            label="Tahmini erişim"
            value={
              budgetEstimates.estimatedReach != null
                ? `${formatNumber(budgetEstimates.estimatedReach)} kişi`
                : 'Henüz belirlenmedi'
            }
          />
          <Kpi
            label="Tahmini gösterim"
            value={
              budgetEstimates.estimatedImpressions != null
                ? `${formatNumber(budgetEstimates.estimatedImpressions)} gösterim`
                : 'Henüz belirlenmedi'
            }
          />
          <Kpi
            label="Tahmini reklam harcaması"
            value={formatMoney(budgetEstimates.estimatedTotalSpend)}
          />
          <Kpi label="Başlangıç" value={startLabel} />
          <Kpi label="Bitiş" value={endLabel} />
          <Kpi
            label="Genel risk"
            value={overallRiskLabels[overallRisk]}
          />
        </dl>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <PreviewSection
            title="Kampanya Bilgileri"
            description="Ad, amaç, tip ve açıklama."
            status={sectionStatuses.info}
            editLabel="Kampanya bilgileri bölümünü düzenle"
            onEdit={() => onGoToStep('campaign-info')}
          >
            <Row label="Ad" value={draft.name} />
            <Row label="Amaç" value={getCampaignObjectiveLabel(draft.objective)} />
            <Row label="Tip" value={getCampaignTypeLabel(draft.campaignType)} />
            <Row label="Açıklama" value={draft.description} />
          </PreviewSection>

          <PreviewSection
            title="Ürün"
            description="Katalog ürünü ve satış durumu."
            status={sectionStatuses.product}
            editLabel="Ürün bölümünü düzenle"
            onEdit={() => onGoToStep('product')}
          >
            {product ? (
              <div className="flex gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-100 text-[10px] text-slate-400">
                    Görsel yok
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Row label="Ürün" value={product.name} />
                  <Row label="Marka" value={getProductBrand(product)} />
                  <Row label="Kategori" value={product.category} />
                  <Row
                    label="Katalog fiyatı"
                    value={
                      catalogEffective != null
                        ? formatCurrencyTRY(catalogEffective)
                        : undefined
                    }
                  />
                  {discountedPrice != null ? (
                    <Row
                      label="Katalog indirimli fiyat"
                      value={formatCurrencyTRY(discountedPrice)}
                    />
                  ) : null}
                  <Row
                    label="Satış durumu"
                    value={getProductSalesStatusLabel(product.salesStatus)}
                  />
                  <Row
                    label="Stok durumu"
                    value={getProductStockStatusLabel(product.stockStatus)}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Henüz belirlenmedi</p>
            )}
          </PreviewSection>

          <PreviewSection
            title="Kreatif"
            description="Mesaj, CTA ve kampanya teklifi."
            status={sectionStatuses.creative}
            editLabel="Kreatif bölümünü düzenle"
            onEdit={() => onGoToStep('creative')}
          >
            {draft.campaignType === 'native' ? (
              <>
                <Row
                  label="Öneri başlığı"
                  value={draft.creative.native.recommendationTitle}
                />
                <Row
                  label="Öneri metni"
                  value={draft.creative.native.recommendationText}
                />
                <Row
                  label="CTA"
                  value={getCreativeCallToActionLabel(
                    draft.creative.native.callToAction,
                  )}
                />
                <Row
                  label="Disclosure"
                  value={draft.creative.native.disclosureText}
                />
              </>
            ) : null}
            {draft.campaignType === 'bulk' ? (
              <>
                <Row
                  label="Mesaj başlığı"
                  value={draft.creative.bulk.messageTitle}
                />
                <Row label="Mesaj metni" value={draft.creative.bulk.messageBody} />
                <Row label="Gönderen" value={draft.creative.bulk.senderName} />
                <Row
                  label="CTA"
                  value={getCreativeCallToActionLabel(
                    draft.creative.bulk.callToAction,
                  )}
                />
                <Row label="Alt bilgi" value={draft.creative.bulk.footerText} />
              </>
            ) : null}
            {!draft.campaignType ? (
              <p className="text-xs text-slate-500">Henüz belirlenmedi</p>
            ) : null}
            <Row
              label="Kampanya teklifi"
              value={
                draft.creative.offer.offerType === 'none'
                  ? 'Teklif yok'
                  : getCampaignOfferTypeLabel(draft.creative.offer.offerType)
              }
            />
            {campaignOfferPrice != null ? (
              <Row
                label="Teklif fiyatı"
                value={formatCurrencyTRY(campaignOfferPrice)}
              />
            ) : null}
          </PreviewSection>

          <PreviewSection
            title="Hedef Kitle"
            description="Segment veya özel kitle özeti."
            status={sectionStatuses.audience}
            editLabel="Hedef kitle bölümünü düzenle"
            onEdit={() => onGoToStep('audience')}
          >
            <Row label="Mod" value={audienceModeLabel} />
            {draft.audience.mode === 'saved-segment' ? (
              <>
                <Row
                  label="Segment"
                  value={savedSegment?.name ?? draft.audience.segmentName}
                />
                <Row
                  label="Kategori"
                  value={
                    savedSegment
                      ? audienceSegmentCategoryLabels[savedSegment.category]
                      : undefined
                  }
                />
                <Row
                  label="Kriter sayısı"
                  value={
                    savedSegment
                      ? formatNumber(savedSegment.criteriaCount)
                      : undefined
                  }
                />
              </>
            ) : null}
            {draft.audience.mode === 'rule-based' ? (
              <>
                <Row label="Özet" value={targetingSummary} />
                <Row label="Kural grubu" value={formatNumber(ruleGroupCount)} />
              </>
            ) : null}
            <Row
              label="Tahmini büyüklük"
              value={
                draft.audience.estimatedSize != null
                  ? `${formatNumber(draft.audience.estimatedSize)} çiftçi`
                  : undefined
              }
            />
          </PreviewSection>

          <PreviewSection
            title="Hedef Kuralları"
            description="Üretim, konum, işletme ve consent kuralları."
            status={sectionStatuses.targeting}
            editLabel="Hedef kuralları bölümünü düzenle"
            onEdit={() =>
              onGoToStep(
                draft.audience.mode === 'saved-segment'
                  ? 'audience'
                  : 'targeting-rules',
              )
            }
          >
            {draft.audience.mode === 'saved-segment' ? (
              <p className="text-xs text-slate-600">
                Hazır segment kullanıldığı için özel kural düzenlemesi
                gerekmiyor.
              </p>
            ) : (
              <>
                <Row
                  label="Üretim"
                  value={joinOptionLabels(
                    draft.targetingRules.productionTypes,
                    targetingProductionTypeOptions,
                  )}
                />
                <Row
                  label="Ürün"
                  value={joinOptionLabels(
                    draft.targetingRules.crops,
                    targetingCropOptions,
                  )}
                />
                <Row
                  label="Konum"
                  value={
                    draft.targetingRules.allTurkey
                      ? 'Tüm Türkiye'
                      : joinOptionLabels(
                          draft.targetingRules.provinces,
                          targetingProvinceOptions,
                        )
                  }
                />
                <Row
                  label="İşletme ölçeği"
                  value={joinOptionLabels(
                    draft.targetingRules.farmScales,
                    targetingFarmScaleOptions,
                  )}
                />
                <Row
                  label="Veri işleme"
                  value={
                    draft.targetingRules.consentRequirements
                      .dataProcessingRequired
                      ? 'Gerekli'
                      : 'Kapalı'
                  }
                />
                <Row
                  label="Pazarlama izni"
                  value={
                    draft.targetingRules.consentRequirements
                      .marketingConsentRequired
                      ? 'Gerekli'
                      : 'Kapalı'
                  }
                />
              </>
            )}
          </PreviewSection>

          <PreviewSection
            title="Zamanlama"
            description="Başlangıç, bitiş ve teslimat penceresi."
            status={sectionStatuses.schedule}
            editLabel="Zamanlama bölümünü düzenle"
            onEdit={() => onGoToStep('schedule')}
          >
            <Row label="Başlangıç" value={startLabel} />
            <Row label="Bitiş" value={endLabel} />
            <Row
              label="Saat dilimi"
              value={getTimezoneLabel(draft.schedule.timezone)}
            />
            <Row
              label="Aktif günler"
              value={formatSelectedDeliveryDays(draft.schedule.deliveryDays)}
            />
            <Row
              label="Teslimat penceresi"
              value={
                draft.schedule.deliveryWindow.mode === 'all-day'
                  ? '00:00–23:59'
                  : `${draft.schedule.deliveryWindow.startTime}–${draft.schedule.deliveryWindow.endTime}`
              }
            />
            {draft.campaignType === 'bulk' ? (
              <Row
                label="Gönderim modeli"
                value={
                  draft.schedule.bulkSendMode === 'single-send'
                    ? 'Tek seferlik gönderim'
                    : 'Teslimat penceresine yay'
                }
              />
            ) : null}
          </PreviewSection>

          <PreviewSection
            title="Bütçe"
            description="Reklam harcaması ve tahmini sonuçlar."
            status={sectionStatuses.budget}
            editLabel="Bütçe bölümünü düzenle"
            onEdit={() => onGoToStep('budget')}
          >
            <Row
              label="Model"
              value={getBudgetModelLabel(draft.budget.model)}
            />
            <Row
              label={draft.budget.model === 'daily' ? 'Günlük bütçe' : 'Toplam bütçe'}
              value={
                draft.budget.model === 'daily'
                  ? formatMoney(draft.budget.dailyBudget)
                  : formatMoney(draft.budget.totalBudget)
              }
            />
            <Row
              label="Harcama limiti"
              value={formatMoney(draft.budget.spendLimit)}
            />
            <Row
              label="Harcama stratejisi"
              value={getBidStrategyLabel(draft.budget.bidStrategy)}
            />
            <Row
              label="Tahmini harcama"
              value={formatMoney(budgetEstimates.estimatedTotalSpend)}
            />
            <Row
              label="Tahmini erişim"
              value={
                budgetEstimates.estimatedReach != null
                  ? `${formatNumber(budgetEstimates.estimatedReach)} kişi`
                  : undefined
              }
            />
            <Row
              label="Tahmini gösterim"
              value={
                budgetEstimates.estimatedImpressions != null
                  ? formatNumber(budgetEstimates.estimatedImpressions)
                  : undefined
              }
            />
          </PreviewSection>

          <PreviewSection
            title="Gizlilik ve İzin Varsayımları"
            description="Anonim hedefleme ve consent varsayımları."
            status={sectionStatuses.privacy}
            editLabel="Gizlilik varsayımlarını düzenle"
            onEdit={() =>
              onGoToStep(
                draft.audience.mode === 'saved-segment'
                  ? 'audience'
                  : 'targeting-rules',
              )
            }
          >
            <Row
              label="Hedefleme modeli"
              value="Anonim / toplulaştırılmış hedefleme"
            />
            <Row
              label="Veri işleme"
              value={
                draft.targetingRules.consentRequirements.dataProcessingRequired
                  ? 'Gerekli'
                  : 'Kapalı'
              }
            />
            <Row
              label="Pazarlama izni"
              value={
                draft.targetingRules.consentRequirements.marketingConsentRequired
                  ? 'Gerekli'
                  : 'Kapalı'
              }
            />
            <Row
              label="Çiftçi verisi"
              value="Tekil çiftçi bilgileri reklamverene gösterilmez."
            />
          </PreviewSection>
        </div>

        <aside className="campaign-wizard-analysis space-y-4 xl:sticky xl:top-4 xl:self-start">
          <ReadinessPanel readiness={readiness} onGoToStep={onGoToStep} />
          <RiskPanel risks={risks} onGoToStep={onGoToStep} />
          <OpportunityPanel
            opportunities={opportunities}
            onGoToStep={onGoToStep}
          />
          <AssistantPanel
            suggestions={suggestions}
            onGoToStep={onGoToStep}
          />
        </aside>
      </div>

      {jsonOpen ? (
        <JsonPreviewModal
          draft={draft}
          onClose={() => setJsonOpen(false)}
        />
      ) : null}
    </div>
  )
}

function statusFromValid(valid: boolean): PreviewSectionStatus {
  return valid ? 'ready' : 'incomplete'
}

function ExportActions({
  onPrint,
  onJsonPreview,
}: {
  onPrint: () => void
  onJsonPreview: () => void
}) {
  return (
    <div className="preview-export-actions mt-4 flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={onPrint}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <Printer className="h-3.5 w-3.5" aria-hidden />
        Özeti Yazdır
      </button>
      <button
        type="button"
        onClick={onJsonPreview}
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        JSON Önizle
      </button>
      <button
        type="button"
        disabled
        title="Yakında"
        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400"
      >
        Özeti İndir
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
          Yakında
        </span>
      </button>
    </div>
  )
}

function ReadinessBadge({
  status,
}: {
  status: keyof typeof readinessStatusLabels
}) {
  const Icon =
    status === 'ready'
      ? CheckCircle2
      : status === 'needs-review'
        ? CircleAlert
        : AlertTriangle
  const tone =
    status === 'ready'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === 'needs-review'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-rose-200 bg-rose-50 text-rose-800'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {readinessStatusLabels[status]}
    </span>
  )
}

function ReadinessPanel({
  readiness,
  onGoToStep,
}: {
  readiness: ReturnType<typeof calculateCampaignReadiness>
  onGoToStep: (stepId: CampaignWizardStepId) => void
}) {
  return (
    <section
      aria-labelledby="readiness-heading"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h3 id="readiness-heading" className="text-sm font-semibold text-slate-900">
        Kampanya Hazırlık Skoru
      </h3>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
        {readiness.score}{' '}
        <span className="text-sm font-medium text-slate-500">/ 100</span>
      </p>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={readiness.score}
        aria-label="Kampanya hazırlık skoru"
      >
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{ width: `${readiness.score}%` }}
        />
      </div>
      <div className="mt-2">
        <ReadinessBadge status={readiness.status} />
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-slate-800">Zorunlu Kontroller</h4>
        <ul className="mt-2 space-y-1.5">
          {readiness.requiredChecks.map((check) => (
            <li key={check.id} className="flex items-start justify-between gap-2 text-xs">
              <span className="text-slate-700">
                {check.passed ? '✓' : '○'} {check.label}
                {check.detail ? (
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    {check.detail}
                  </span>
                ) : null}
              </span>
              {!check.passed && check.relatedStep ? (
                <button
                  type="button"
                  onClick={() => onGoToStep(check.relatedStep!)}
                  className="shrink-0 text-[11px] font-semibold text-emerald-700 underline"
                >
                  Düzenle
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold text-slate-800">Öneri Kontrolleri</h4>
        <ul className="mt-2 space-y-1.5">
          {readiness.advisoryChecks.map((check) => (
            <li key={check.id} className="text-xs text-slate-700">
              {check.passed ? '✓' : '○'} {check.label}
              {!check.passed && check.detail ? (
                <span className="mt-0.5 block text-[11px] text-amber-800">
                  {check.detail}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Bu skor, kampanya alanları ve mock iş kuralları kullanılarak hesaplanır.
      </p>
    </section>
  )
}

function RiskPanel({
  risks,
  onGoToStep,
}: {
  risks: ReturnType<typeof analyzeCampaignRisks>
  onGoToStep: (stepId: CampaignWizardStepId) => void
}) {
  return (
    <section
      aria-labelledby="risks-heading"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h3 id="risks-heading" className="text-sm font-semibold text-slate-900">
        Riskler ve Dikkat Edilecek Noktalar
      </h3>
      {risks.length === 0 ? (
        <p className="mt-2 text-xs text-slate-600">
          Belirgin bir kampanya riski tespit edilmedi.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {risks.map((risk) => (
            <li
              key={risk.id}
              className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                  <AlertTriangle className="h-3 w-3" aria-hidden />
                  {riskSeverityLabels[risk.severity]}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {risk.title}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                {risk.description}
              </p>
              {risk.relatedStep ? (
                <button
                  type="button"
                  onClick={() => onGoToStep(risk.relatedStep!)}
                  className="mt-2 text-[11px] font-semibold text-emerald-700 underline"
                >
                  İlgili bölümü düzenle
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-slate-500">
        Bu değerlendirme mock ve kural tabanlıdır.
      </p>
    </section>
  )
}

function OpportunityPanel({
  opportunities,
  onGoToStep,
}: {
  opportunities: ReturnType<typeof analyzeCampaignOpportunities>
  onGoToStep: (stepId: CampaignWizardStepId) => void
}) {
  return (
    <section
      aria-labelledby="opportunities-heading"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h3
        id="opportunities-heading"
        className="text-sm font-semibold text-slate-900"
      >
        Kampanya Fırsatları
      </h3>
      {opportunities.length === 0 ? (
        <p className="mt-2 text-xs text-slate-600">
          Kampanyayı güçlendirecek ek fırsatlar, alanlar tamamlandıkça burada
          gösterilecektir.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {opportunities.map((item) => (
            <li key={item.id} className="rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden />
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-emerald-900/80">
                {item.description}
              </p>
              {item.relatedStep ? (
                <button
                  type="button"
                  onClick={() => onGoToStep(item.relatedStep!)}
                  className="mt-2 text-[11px] font-semibold text-emerald-800 underline"
                >
                  İlgili bölümü gör
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function AssistantPanel({
  suggestions,
  onGoToStep,
}: {
  suggestions: ReturnType<typeof generateCampaignAssistantSuggestions>
  onGoToStep: (stepId: CampaignWizardStepId) => void
}) {
  return (
    <section
      aria-labelledby="assistant-heading"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h3 id="assistant-heading" className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <Sparkles className="h-4 w-4 text-emerald-700" aria-hidden />
        AgriGO Campaign Assistant
      </h3>
      <p className="mt-1 text-[11px] text-slate-500">
        Bu öneriler gerçek yapay zekâ çıktısı değildir. Mevcut kampanya verileri
        ve mock iş kurallarıyla oluşturulur.
      </p>
      {suggestions.length === 0 ? (
        <p className="mt-3 text-xs text-slate-600">
          Şu an için ek iyileştirme önerisi bulunmuyor.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {suggestions.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {assistantPriorityLabels[item.priority]}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                {item.description}
              </p>
              {item.relatedStep ? (
                <button
                  type="button"
                  onClick={() => onGoToStep(item.relatedStep!)}
                  className="mt-2 text-[11px] font-semibold text-emerald-700 underline"
                >
                  İlgili adıma git
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function PreviewSection({
  title,
  description,
  status,
  editLabel,
  onEdit,
  children,
}: {
  title: string
  description: string
  status: PreviewSectionStatus
  editLabel: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <SectionStatusBadge status={status} />
          <button
            type="button"
            onClick={onEdit}
            aria-label={editLabel}
            className="preview-edit-btn rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 print:hidden"
          >
            Düzenle
          </button>
        </div>
      </div>
      <dl className="mt-3 space-y-1.5">{children}</dl>
    </section>
  )
}

function SectionStatusBadge({ status }: { status: PreviewSectionStatus }) {
  const tone =
    status === 'ready' || status === 'saved-segment'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === 'needs-review'
        ? 'border-amber-200 bg-amber-50 text-amber-900'
        : 'border-rose-200 bg-rose-50 text-rose-800'
  const Icon =
    status === 'ready' || status === 'saved-segment'
      ? CheckCircle2
      : CircleAlert

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {previewSectionStatusLabels[status]}
    </span>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-white/80 px-3 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <dt className="text-slate-500">{label}</dt>
      <dd className="max-w-[65%] text-right font-medium text-slate-800">
        {value && String(value).trim() ? (
          value
        ) : (
          <span className="font-normal text-slate-400">Henüz belirlenmedi</span>
        )}
      </dd>
    </div>
  )
}

function JsonPreviewModal({
  draft,
  onClose,
}: {
  draft: CampaignDraft
  onClose: () => void
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const json = useMemo(
    () => JSON.stringify(sanitizeCampaignDraftForExport(draft), null, 2),
    [draft],
  )
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center print:hidden"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 id={titleId} className="text-sm font-semibold text-slate-900">
            JSON Önizleme
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <ClipboardCopy className="h-3.5 w-3.5" aria-hidden />
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Kapat
            </button>
          </div>
        </div>
        <pre className="overflow-auto px-4 py-3 text-[11px] leading-relaxed text-slate-700">
          {json}
        </pre>
      </div>
    </div>
  )
}

function formatMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return 'Henüz belirlenmedi'
  return formatCurrency(value)
}

function joinOptionLabels(
  values: string[],
  options: { value: string; label: string }[],
): string {
  if (values.length === 0) return ''
  return values
    .map((value) => getTargetingOptionLabel(options, value))
    .join(', ')
}
