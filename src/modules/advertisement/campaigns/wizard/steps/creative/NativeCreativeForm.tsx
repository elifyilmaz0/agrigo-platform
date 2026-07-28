import type { Product } from '../../../../types/advertisement.ts'
import {
  DEFAULT_NATIVE_DISCLOSURE,
  NATIVE_DISCLOSURE_MAX,
  NATIVE_RELEVANCE_MAX,
  NATIVE_TEXT_MAX,
  NATIVE_TITLE_MAX,
  type NativeCreativeDraft,
} from '../../campaignDraft.ts'
import {
  creativeCallToActionOptions,
  ctaRequiresUrl,
  type CreativeCallToAction,
} from '../../creativeCallToActions.ts'
import CreativeFieldCounter from './CreativeFieldCounter.tsx'

type NativeCreativeFormProps = {
  value: NativeCreativeDraft
  product: Product | undefined
  errors: Record<string, string>
  onChange: (patch: Partial<NativeCreativeDraft>) => void
}

export default function NativeCreativeForm({
  value,
  product,
  errors,
  onChange,
}: NativeCreativeFormProps) {
  const urlRequired = ctaRequiresUrl(value.callToAction)

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Native Öneri İçeriği
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            AI sohbetindeki sponsorlu öneri kartında gösterilecek içerik.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-native-recommendationTitle"
                className="block text-xs font-medium text-slate-700"
              >
                Öneri Başlığı <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.recommendationTitle.length}
                max={NATIVE_TITLE_MAX}
              />
            </div>
            <input
              id="wiz-native-recommendationTitle"
              maxLength={NATIVE_TITLE_MAX}
              value={value.recommendationTitle}
              aria-invalid={Boolean(errors['native-recommendationTitle'])}
              aria-describedby={
                errors['native-recommendationTitle']
                  ? 'wiz-native-recommendationTitle-error'
                  : undefined
              }
              onChange={(e) =>
                onChange({ recommendationTitle: e.target.value })
              }
              className={inputClass(Boolean(errors['native-recommendationTitle']))}
              placeholder="Zeytin yaprak hastalıklarına karşı etkili koruma"
            />
            {errors['native-recommendationTitle'] ? (
              <p
                id="wiz-native-recommendationTitle-error"
                className="mt-1 text-[11px] text-red-600"
              >
                {errors['native-recommendationTitle']}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-native-recommendationText"
                className="block text-xs font-medium text-slate-700"
              >
                Öneri Metni <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.recommendationText.length}
                max={NATIVE_TEXT_MAX}
              />
            </div>
            <textarea
              id="wiz-native-recommendationText"
              rows={4}
              maxLength={NATIVE_TEXT_MAX}
              value={value.recommendationText}
              aria-invalid={Boolean(errors['native-recommendationText'])}
              aria-describedby="wiz-native-recommendationText-help wiz-native-recommendationText-error"
              onChange={(e) =>
                onChange({ recommendationText: e.target.value })
              }
              className={textareaClass(
                Boolean(errors['native-recommendationText']),
              )}
              placeholder="Bitki sağlığını korumaya yardımcı olan bu ürün, zeytin üretiminde görülen yaygın yaprak hastalıklarına karşı kullanılabilir."
            />
            <p
              id="wiz-native-recommendationText-help"
              className="mt-1 text-[11px] text-slate-500"
            >
              Metin doğrudan satış baskısı kurmamalı; çiftçinin ihtiyacıyla
              ilgili ve açıklayıcı olmalıdır.
            </p>
            {errors['native-recommendationText'] ? (
              <p
                id="wiz-native-recommendationText-error"
                className="mt-1 text-[11px] text-red-600"
              >
                {errors['native-recommendationText']}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-native-relevanceExplanation"
                className="block text-xs font-medium text-slate-700"
              >
                İlgililik Açıklaması <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.relevanceExplanation.length}
                max={NATIVE_RELEVANCE_MAX}
              />
            </div>
            <textarea
              id="wiz-native-relevanceExplanation"
              rows={3}
              maxLength={NATIVE_RELEVANCE_MAX}
              value={value.relevanceExplanation}
              aria-invalid={Boolean(errors['native-relevanceExplanation'])}
              aria-describedby="wiz-native-relevanceExplanation-help"
              onChange={(e) =>
                onChange({ relevanceExplanation: e.target.value })
              }
              className={textareaClass(
                Boolean(errors['native-relevanceExplanation']),
              )}
              placeholder="Bu öneri, zeytin üretimi yapan ve yaprak hastalığı riski yaşayan çiftçiler için uygundur."
            />
            <p
              id="wiz-native-relevanceExplanation-help"
              className="mt-1 text-[11px] text-slate-500"
            >
              AgriGO iç ekibinin önerinin neden uygun olduğunu anlamasına
              yardımcı olur. Reklamverene görünür; çiftçiye doğrudan
              gösterilmeyebilir.
            </p>
            {errors['native-relevanceExplanation'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['native-relevanceExplanation']}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="wiz-native-callToAction"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                CTA <span className="text-red-500">*</span>
              </label>
              <select
                id="wiz-native-callToAction"
                value={value.callToAction ?? ''}
                aria-invalid={Boolean(errors['native-callToAction'])}
                onChange={(e) =>
                  onChange({
                    callToAction: (e.target.value ||
                      null) as CreativeCallToAction | null,
                  })
                }
                className={inputClass(Boolean(errors['native-callToAction']))}
              >
                <option value="">CTA seçin</option>
                {creativeCallToActionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors['native-callToAction'] ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors['native-callToAction']}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="wiz-native-destinationUrl"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Hedef URL {urlRequired ? <span className="text-red-500">*</span> : null}
              </label>
              <input
                id="wiz-native-destinationUrl"
                type="url"
                value={value.destinationUrl}
                aria-invalid={Boolean(errors['native-destinationUrl'])}
                onChange={(e) => onChange({ destinationUrl: e.target.value })}
                className={inputClass(Boolean(errors['native-destinationUrl']))}
                placeholder="https://marka.com/urun/urun-adi"
              />
              {product?.salesUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange({ destinationUrl: product.salesUrl ?? '' })
                  }
                  className="mt-1.5 text-[11px] font-medium text-emerald-700 hover:underline"
                >
                  Seçili ürünün satış bağlantısını kullan
                </button>
              ) : null}
              {errors['native-destinationUrl'] ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors['native-destinationUrl']}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-native-disclosureText"
                className="block text-xs font-medium text-slate-700"
              >
                Sponsorlu İçerik Açıklaması{' '}
                <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.disclosureText.length}
                max={NATIVE_DISCLOSURE_MAX}
              />
            </div>
            <input
              id="wiz-native-disclosureText"
              maxLength={NATIVE_DISCLOSURE_MAX}
              value={value.disclosureText || DEFAULT_NATIVE_DISCLOSURE}
              aria-invalid={Boolean(errors['native-disclosureText'])}
              aria-describedby="wiz-native-disclosureText-help"
              onChange={(e) => onChange({ disclosureText: e.target.value })}
              className={inputClass(Boolean(errors['native-disclosureText']))}
            />
            <p
              id="wiz-native-disclosureText-help"
              className="mt-1 text-[11px] text-slate-500"
            >
              Kullanıcı, önerinin ticari içerik olduğunu açıkça görebilmelidir.
            </p>
            {errors['native-disclosureText'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['native-disclosureText']}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
        <h3 className="text-xs font-semibold text-emerald-900">
          Native öneri yazım ilkeleri
        </h3>
        <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-emerald-900/80">
          <li>• Çiftçinin sorusuyla doğrudan ilişkili olmalı</li>
          <li>• Kesin tedavi veya garanti iddiası içermemeli</li>
          <li>• Korku veya baskı dili kullanmamalı</li>
          <li>• Ürünü tarafsız ve açıklayıcı biçimde sunmalı</li>
          <li>• Ticari içerik olduğu açıkça belirtilmeli</li>
        </ul>
      </aside>
    </div>
  )
}

function inputClass(hasError: boolean): string {
  return `h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}

function textareaClass(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}
