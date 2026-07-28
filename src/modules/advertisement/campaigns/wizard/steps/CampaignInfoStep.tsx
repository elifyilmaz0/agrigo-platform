import { Check } from 'lucide-react'
import {
  CAMPAIGN_DESCRIPTION_MAX,
  CAMPAIGN_NAME_MAX,
  type CampaignDraft,
} from '../campaignDraft.ts'
import {
  campaignObjectiveOptions,
  getCampaignObjectiveDescription,
  type CampaignObjectiveValue,
} from '../campaignObjectives.ts'
import {
  campaignTypeOptions,
  getCampaignTypeOption,
  type WizardCampaignType,
} from '../campaignTypes.ts'

type CampaignInfoStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
}

export default function CampaignInfoStep({
  draft,
  errors,
  onChange,
}: CampaignInfoStepProps) {
  const selectedType = getCampaignTypeOption(draft.campaignType)
  const selectedObjectiveDescription = getCampaignObjectiveDescription(
    draft.objective,
  )

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">Temel Bilgiler</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Kampanyanın dahili kimliğini, amacını ve kısa açıklamasını tanımlayın.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="mb-1.5 flex items-end justify-between gap-3">
              <label
                htmlFor="wiz-name"
                className="block text-xs font-medium text-slate-700"
              >
                Kampanya Adı <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {draft.name.length}/{CAMPAIGN_NAME_MAX}
              </span>
            </div>
            <input
              id="wiz-name"
              value={draft.name}
              maxLength={CAMPAIGN_NAME_MAX}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? 'wiz-name-error wiz-name-help' : 'wiz-name-help'
              }
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Örn. Zeytin Üreticilerine Yaz Fırsatı"
              className={`h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            />
            <p id="wiz-name-help" className="mt-1 text-[11px] text-slate-500">
              Kampanya listelerinde ve raporlarda kullanılacak dahili kampanya
              adıdır.
            </p>
            {errors.name ? (
              <p id="wiz-name-error" className="mt-1 text-[11px] text-red-600">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="wiz-objective"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Kampanya Amacı <span className="text-red-500">*</span>
            </label>
            <select
              id="wiz-objective"
              value={draft.objective ?? ''}
              aria-invalid={Boolean(errors.objective)}
              aria-describedby={
                errors.objective
                  ? 'wiz-objective-error wiz-objective-help'
                  : 'wiz-objective-help'
              }
              onChange={(e) =>
                onChange({
                  objective: e.target.value
                    ? (e.target.value as CampaignObjectiveValue)
                    : null,
                })
              }
              className={`h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 sm:max-w-md ${
                errors.objective
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            >
              <option value="">Amaç seçin</option>
              {campaignObjectiveOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p id="wiz-objective-help" className="mt-1 text-[11px] text-slate-500">
              {selectedObjectiveDescription ||
                'Seçilen amaca göre kampanya stratejisi şekillenir.'}
            </p>
            {errors.objective ? (
              <p
                id="wiz-objective-error"
                className="mt-1 text-[11px] text-red-600"
              >
                {errors.objective}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <div className="mb-1.5 flex items-end justify-between gap-3">
              <label
                htmlFor="wiz-description"
                className="block text-xs font-medium text-slate-700"
              >
                Kampanya Açıklaması
              </label>
              <span className="text-[11px] text-slate-400">
                {draft.description.length}/{CAMPAIGN_DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              id="wiz-description"
              rows={4}
              maxLength={CAMPAIGN_DESCRIPTION_MAX}
              value={draft.description}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? 'wiz-description-error wiz-description-help'
                  : 'wiz-description-help'
              }
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Bu kampanyanın amacı, hedef kitlesi ve beklenen sonucu hakkında kısa bir açıklama yazın."
              className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            />
            <p
              id="wiz-description-help"
              className="mt-1 text-[11px] text-slate-500"
            >
              Bu açıklama yalnızca reklamveren ve AgriGO iç ekipleri tarafından
              görülür.
            </p>
            {errors.description ? (
              <p
                id="wiz-description-error"
                className="mt-1 text-[11px] text-red-600"
              >
                {errors.description}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-900">Yayın Modeli</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Kampanyanın çiftçiye nasıl ulaşacağını seçin. Native ve Toplu Mesaj
            aynı anda seçilemez.
          </p>
        </div>

        <div
          id="wiz-campaignType"
          role="radiogroup"
          aria-labelledby="wiz-campaign-type-label"
          aria-describedby={
            errors.campaignType
              ? 'wiz-campaignType-error wiz-campaign-type-info'
              : 'wiz-campaign-type-info'
          }
          tabIndex={-1}
          className="outline-none"
        >
          <p
            id="wiz-campaign-type-label"
            className="mb-2 text-xs font-medium text-slate-700"
          >
            Kampanya Türü <span className="text-red-500">*</span>
          </p>

          <div className="grid gap-3 lg:grid-cols-2">
            {campaignTypeOptions.map((option) => (
              <CampaignTypeOptionCard
                key={option.value}
                option={option}
                selected={draft.campaignType === option.value}
                onSelect={() =>
                  onChange({ campaignType: option.value as WizardCampaignType })
                }
              />
            ))}
          </div>
        </div>

        {errors.campaignType ? (
          <p id="wiz-campaignType-error" className="mt-2 text-[11px] text-red-600">
            {errors.campaignType}
          </p>
        ) : null}

        <div
          id="wiz-campaign-type-info"
          className="mt-4 rounded-md border border-slate-100 bg-slate-50 px-3.5 py-3"
        >
          <p className="text-xs leading-relaxed text-slate-600">
            {selectedType
              ? selectedType.selectedInfo
              : 'Kampanya türü seçildiğinde burada yayın modeli hakkında kısa bir bilgilendirme görünür.'}
          </p>
        </div>
      </section>
    </div>
  )
}

function CampaignTypeOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof campaignTypeOptions)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          onSelect()
        }
      }}
      className={`rounded-lg border p-4 text-left transition-colors ${
        selected
          ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-200'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{option.label}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            {option.description}
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

      <div className="mt-3 rounded-md bg-white/70 px-2.5 py-2">
        <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
          Örnek kullanım
        </p>
        <p className="mt-1 text-[11px] text-slate-700">{option.example}</p>
      </div>

      <ul className="mt-3 space-y-1">
        {option.advantages.map((item) => (
          <li
            key={item}
            className="flex items-start gap-1.5 text-[11px] text-slate-600"
          >
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
    </button>
  )
}
