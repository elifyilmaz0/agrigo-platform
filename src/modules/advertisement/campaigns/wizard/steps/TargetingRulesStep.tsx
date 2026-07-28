import { getProductById, getProductShortDescription } from '../../../data/products.ts'
import { formatNumber } from '../../../utils/formatters.ts'
import {
  buildTargetingSummary,
  countMeaningfulTargetingGroups,
  summarizeRuleCounts,
} from '../buildTargetingSummary.ts'
import { calculateEstimatedAudience } from '../calculateEstimatedAudience.ts'
import {
  createEmptyTargetingRules,
  syncAudienceFromRules,
  type CampaignDraft,
  type TargetingRulesDraft,
} from '../campaignDraft.ts'
import {
  targetingCreditNeedOptions,
  targetingCropOptions,
  targetingDigitalPaymentOptions,
  targetingFarmScaleOptions,
  targetingInsuranceOptions,
  targetingIrrigationOptions,
  targetingLivestockOptions,
  targetingProductionTypeOptions,
  targetingProvinceOptions,
  targetingSupportStatusOptions,
  type TargetingFarmScale,
  type TargetingOption,
  type TargetingProductionType,
} from '../targetingConfigs.ts'
import PrivacyNotice from './PrivacyNotice.tsx'

type TargetingRulesStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
}

export default function TargetingRulesStep({
  draft,
  errors,
  onChange,
}: TargetingRulesStepProps) {
  const rules = draft.targetingRules
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const estimatedSize = calculateEstimatedAudience(rules)
  const summary = buildTargetingSummary(rules)
  const groupCount = countMeaningfulTargetingGroups(rules)
  const showLivestock =
    rules.productionTypes.includes('livestock') ||
    rules.productionTypes.includes('mixed')
  const livestockWarning =
    rules.livestockTypes.length > 0 &&
    !rules.productionTypes.includes('livestock') &&
    !rules.productionTypes.includes('mixed')

  function commitRules(nextRules: TargetingRulesDraft) {
    const withConsent =
      draft.campaignType === 'bulk'
        ? {
            ...nextRules,
            consentRequirements: {
              ...nextRules.consentRequirements,
              marketingConsentRequired: true,
            },
          }
        : nextRules

    onChange({
      targetingRules: withConsent,
      audience: syncAudienceFromRules(withConsent, {
        ...draft.audience,
        mode: 'rule-based',
      }),
    })
  }

  function patchRules(patch: Partial<TargetingRulesDraft>) {
    commitRules({ ...rules, ...patch })
  }

  function toggleValue<T extends string>(
    key: keyof TargetingRulesDraft,
    value: T,
    current: T[],
  ) {
    const exists = current.includes(value)
    const next = exists
      ? current.filter((item) => item !== value)
      : [...current, value]
    patchRules({ [key]: next } as Partial<TargetingRulesDraft>)
  }

  function handleProvinceToggle(value: string) {
    if (value === 'all-turkey') {
      patchRules({
        allTurkey: !rules.allTurkey,
        provinces: [],
      })
      return
    }
    const exists = rules.provinces.includes(value)
    patchRules({
      allTurkey: false,
      provinces: exists
        ? rules.provinces.filter((item) => item !== value)
        : [...rules.provinces, value],
    })
  }

  function clearRules() {
    const cleared = createEmptyTargetingRules(draft.campaignType)
    commitRules(cleared)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-100 bg-slate-50 px-3.5 py-3 text-[11px] leading-relaxed text-slate-600">
        Aynı gruptaki seçenekler “veya”, farklı gruplar ise “ve” mantığıyla
        değerlendirilir.
      </div>

      {product ? (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-4 py-3">
          <p className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
            Seçili ürün sinyalleri
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {product.name}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            {getProductShortDescription(product)}
          </p>
          <ul className="mt-2 space-y-0.5 text-[11px] text-slate-600">
            {product.productionType ? (
              <li>• Üretim: {product.productionType}</li>
            ) : null}
            {product.relevantProducts ? (
              <li>• İlgili ürünler: {product.relevantProducts.replace(/\n/g, ', ')}</li>
            ) : null}
            {product.recommendedSeason ? (
              <li>• Önerilen sezon: {product.recommendedSeason}</li>
            ) : null}
          </ul>
          <p className="mt-2 text-[11px] text-slate-500">
            Bu bilgiler yalnızca öneridir. Kurallar otomatik eklenmez.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {errors['targeting-rules'] ? (
            <p
              id="wiz-targeting-rules-error"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700"
              role="alert"
            >
              {errors['targeting-rules']}
            </p>
          ) : null}

          <section
            id="wiz-targeting-rules"
            tabIndex={-1}
            className="rounded-lg border border-slate-200 bg-white p-5 outline-none"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Üretim Profili
            </h2>
            <div className="mt-4 space-y-4">
              <ChipGroup
                legend="Üretim Tipi"
                options={targetingProductionTypeOptions}
                values={rules.productionTypes}
                onToggle={(value) =>
                  toggleValue(
                    'productionTypes',
                    value as TargetingProductionType,
                    rules.productionTypes,
                  )
                }
              />
              <ChipGroup
                legend="İlgili Ürünler"
                options={targetingCropOptions}
                values={rules.crops}
                onToggle={(value) => toggleValue('crops', value, rules.crops)}
              />
              {showLivestock || rules.livestockTypes.length > 0 ? (
                <ChipGroup
                  legend="Hayvancılık Türü"
                  options={targetingLivestockOptions}
                  values={rules.livestockTypes}
                  onToggle={(value) =>
                    toggleValue('livestockTypes', value, rules.livestockTypes)
                  }
                />
              ) : null}
              {livestockWarning ? (
                <p className="text-[11px] text-amber-700">
                  Hayvancılık türü seçildi ancak üretim tipinde Hayvancılık veya
                  Karma yok.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Konum</h2>
            <div className="mt-4">
              <ChipGroup
                legend="İller"
                options={targetingProvinceOptions}
                values={
                  rules.allTurkey
                    ? ['all-turkey']
                    : rules.provinces
                }
                onToggle={handleProvinceToggle}
              />
              <p className="mt-2 text-[11px] text-slate-500">
                “Tüm Türkiye” seçildiğinde tekil iller temizlenir.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              İşletme Özellikleri
            </h2>
            <div className="mt-4 space-y-4">
              <ChipGroup
                legend="İşletme Ölçeği"
                options={targetingFarmScaleOptions}
                values={rules.farmScales}
                onToggle={(value) =>
                  toggleValue(
                    'farmScales',
                    value as TargetingFarmScale,
                    rules.farmScales,
                  )
                }
              />
              <ChipGroup
                legend="Sulama Yöntemi"
                options={targetingIrrigationOptions}
                values={rules.irrigationMethods}
                onToggle={(value) =>
                  toggleValue(
                    'irrigationMethods',
                    value,
                    rules.irrigationMethods,
                  )
                }
              />
              <ChipGroup
                legend="Sigorta Durumu"
                options={targetingInsuranceOptions}
                values={rules.insuranceStatuses}
                onToggle={(value) =>
                  toggleValue(
                    'insuranceStatuses',
                    value,
                    rules.insuranceStatuses,
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Finansal ve Dijital Sinyaller
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Finansal sinyaller yalnızca izin verilen, anonim ve toplulaştırılmış
              hedefleme süreçlerinde kullanılmalıdır.
            </p>
            <div className="mt-4 space-y-4">
              <ChipGroup
                legend="Dijital Ödeme Kullanımı"
                options={targetingDigitalPaymentOptions}
                values={rules.digitalPaymentUsage}
                onToggle={(value) =>
                  toggleValue(
                    'digitalPaymentUsage',
                    value,
                    rules.digitalPaymentUsage,
                  )
                }
              />
              <ChipGroup
                legend="Kredi İhtiyacı"
                options={targetingCreditNeedOptions}
                values={rules.creditNeed}
                onToggle={(value) =>
                  toggleValue('creditNeed', value, rules.creditNeed)
                }
              />
              <ChipGroup
                legend="Destek Durumu"
                options={targetingSupportStatusOptions}
                values={rules.supportStatuses}
                onToggle={(value) =>
                  toggleValue('supportStatuses', value, rules.supportStatuses)
                }
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              İzin Gereksinimleri
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 rounded-md border border-slate-200 px-3 py-3">
                <input
                  type="checkbox"
                  checked={rules.consentRequirements.dataProcessingRequired}
                  disabled
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-xs font-medium text-slate-800">
                    Veri İşleme Onayı Gerekli
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    Bu sprintte zorunlu açık tutulur (mock).
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-md border border-slate-200 px-3 py-3">
                <input
                  type="checkbox"
                  checked={
                    draft.campaignType === 'bulk'
                      ? true
                      : rules.consentRequirements.marketingConsentRequired
                  }
                  disabled={draft.campaignType === 'bulk'}
                  onChange={(e) =>
                    patchRules({
                      consentRequirements: {
                        ...rules.consentRequirements,
                        marketingConsentRequired: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-xs font-medium text-slate-800">
                    Pazarlama İzni Gerekli
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    {draft.campaignType === 'bulk'
                      ? 'Toplu mesaj kampanyaları yalnızca pazarlama izni bulunan çiftçilere gönderilmelidir.'
                      : 'Native öneriler için gerekli izin modeli yönetici kararı ve hukuk değerlendirmesiyle kesinleştirilecektir.'}
                  </span>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-4 lg:w-[360px]">
          <div
            className="rounded-lg border border-slate-200 bg-white p-4"
            aria-label="Tahmini hedef kitle paneli"
          >
            <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Tahmini Hedef Kitle
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {groupCount > 0
                ? `${formatNumber(estimatedSize)} çiftçi`
                : 'Henüz hesaplanmadı'}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Bu değer mock ve toplulaştırılmış bir tahmindir. Gerçek Farmer360
              verisi bağlandığında yeniden hesaplanacaktır.
            </p>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-800">
                Seçilen Kural Grupları
              </p>
              {groupCount === 0 ? (
                <p className="mt-1 text-[11px] text-slate-500">Henüz yok</p>
              ) : (
                <ul className="mt-1 space-y-1 text-[11px] text-slate-600">
                  {summarizeRuleCounts(rules).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-800">Kural Özeti</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                {summary}
              </p>
            </div>

            <button
              type="button"
              onClick={clearRules}
              className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Kuralları Temizle
            </button>
          </div>

          <PrivacyNotice />
        </aside>
      </div>
    </div>
  )
}

function ChipGroup({
  legend,
  options,
  values,
  onToggle,
}: {
  legend: string
  options: TargetingOption[]
  values: string[]
  onToggle: (value: string) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-slate-700">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(option.value)}
              className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                selected
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {selected ? '✓ ' : ''}
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
