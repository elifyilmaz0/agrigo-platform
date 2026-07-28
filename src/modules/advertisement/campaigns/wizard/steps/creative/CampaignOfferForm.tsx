import ProductPriceDisplay from '../../../../components/ProductPriceDisplay.tsx'
import {
  calculateCampaignOfferPrice,
  getCatalogEffectivePrice,
} from '../../calculateCampaignOfferPrice.ts'
import type { CampaignOfferDraft } from '../../campaignDraft.ts'
import {
  campaignOfferTypeOptions,
  type CampaignOfferType,
} from '../../campaignOfferTypes.ts'
import { OFFER_LABEL_MAX } from '../../campaignDraft.ts'
import type { Product } from '../../../../types/advertisement.ts'
import { formatCurrencyTRY } from '../../../../utils/formatters.ts'
import CreativeFieldCounter from './CreativeFieldCounter.tsx'

type CampaignOfferFormProps = {
  offer: CampaignOfferDraft
  product: Product | undefined
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignOfferDraft>) => void
}

export default function CampaignOfferForm({
  offer,
  product,
  errors,
  onChange,
}: CampaignOfferFormProps) {
  const basePrice = getCatalogEffectivePrice(
    product?.listPrice,
    product?.discountedPrice,
  )
  const campaignPrice = calculateCampaignOfferPrice({
    listPrice: product?.listPrice,
    discountedPrice: product?.discountedPrice,
    offer,
  })
  const highCampaignPriceWarning =
    offer.offerType === 'fixed-price' &&
    offer.campaignPrice != null &&
    basePrice != null &&
    offer.campaignPrice > basePrice

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Kampanya Teklifi</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Ürünün normal katalog fiyatından bağımsız olarak bu kampanyaya özel
          teklif tanımlayabilirsiniz.
        </p>
      </div>

      {product ? (
        <div className="mb-4 rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
            Katalogdaki geçerli fiyat
          </p>
          <div className="mt-1">
            <ProductPriceDisplay product={product} compact />
          </div>
        </div>
      ) : (
        <p className="mb-4 text-xs text-slate-500">
          Ürün seçildiğinde katalog fiyatı burada görünür.
        </p>
      )}

      <div
        role="radiogroup"
        aria-labelledby="wiz-offer-type-label"
        className="grid gap-2 sm:grid-cols-2"
      >
        <p id="wiz-offer-type-label" className="sr-only">
          Teklif türü
        </p>
        {campaignOfferTypeOptions.map((option) => {
          const selected = offer.offerType === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                onChange({ offerType: option.value as CampaignOfferType })
              }
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                selected
                  ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="text-xs font-semibold text-slate-900">
                {option.label}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {option.description}
              </p>
            </button>
          )
        })}
      </div>

      {offer.offerType === 'percentage' ? (
        <div className="mt-4">
          <label
            htmlFor="wiz-offer-percentageValue"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            İndirim Oranı <span className="text-red-500">*</span>
          </label>
          <div className="relative max-w-[200px]">
            <input
              id="wiz-offer-percentageValue"
              type="number"
              min={1}
              max={100}
              value={offer.percentageValue ?? ''}
              aria-invalid={Boolean(errors['offer-percentageValue'])}
              aria-describedby={
                errors['offer-percentageValue']
                  ? 'wiz-offer-percentageValue-error'
                  : undefined
              }
              onChange={(e) =>
                onChange({
                  percentageValue:
                    e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className={`h-9 w-full rounded-md border px-3 pr-8 text-sm outline-none focus:ring-2 ${
                errors['offer-percentageValue']
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
              %
            </span>
          </div>
          {errors['offer-percentageValue'] ? (
            <p
              id="wiz-offer-percentageValue-error"
              className="mt-1 text-[11px] text-red-600"
            >
              {errors['offer-percentageValue']}
            </p>
          ) : null}
          {basePrice != null && campaignPrice != null ? (
            <p className="mt-2 text-xs text-slate-600">
              Normal fiyat: {formatCurrencyTRY(basePrice)} · İndirim sonrası:{' '}
              <span className="font-semibold text-emerald-800">
                {formatCurrencyTRY(campaignPrice)}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {offer.offerType === 'fixed-price' ? (
        <div className="mt-4">
          <label
            htmlFor="wiz-offer-campaignPrice"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Kampanya Fiyatı <span className="text-red-500">*</span>
          </label>
          <div className="relative max-w-[220px]">
            <input
              id="wiz-offer-campaignPrice"
              type="number"
              min={0}
              step="0.01"
              value={offer.campaignPrice ?? ''}
              aria-invalid={Boolean(errors['offer-campaignPrice'])}
              onChange={(e) =>
                onChange({
                  campaignPrice:
                    e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className={`h-9 w-full rounded-md border px-3 pr-8 text-sm outline-none focus:ring-2 ${
                errors['offer-campaignPrice']
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
              ₺
            </span>
          </div>
          {errors['offer-campaignPrice'] ? (
            <p className="mt-1 text-[11px] text-red-600">
              {errors['offer-campaignPrice']}
            </p>
          ) : null}
          {highCampaignPriceWarning ? (
            <p className="mt-1 text-[11px] text-amber-700">
              Kampanya fiyatı normal satış fiyatından yüksek.
            </p>
          ) : null}
        </div>
      ) : null}

      {offer.offerType === 'fixed-discount' ? (
        <div className="mt-4">
          <label
            htmlFor="wiz-offer-discountAmount"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            İndirim Tutarı <span className="text-red-500">*</span>
          </label>
          <div className="relative max-w-[220px]">
            <input
              id="wiz-offer-discountAmount"
              type="number"
              min={0}
              step="0.01"
              value={offer.discountAmount ?? ''}
              aria-invalid={Boolean(errors['offer-discountAmount'])}
              onChange={(e) =>
                onChange({
                  discountAmount:
                    e.target.value === '' ? null : Number(e.target.value),
                })
              }
              className={`h-9 w-full rounded-md border px-3 pr-8 text-sm outline-none focus:ring-2 ${
                errors['offer-discountAmount']
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
              }`}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
              ₺
            </span>
          </div>
          {errors['offer-discountAmount'] ? (
            <p className="mt-1 text-[11px] text-red-600">
              {errors['offer-discountAmount']}
            </p>
          ) : null}
          {basePrice != null && campaignPrice != null ? (
            <p className="mt-2 text-xs text-slate-600">
              Hesaplanan kampanya fiyatı:{' '}
              <span className="font-semibold text-emerald-800">
                {formatCurrencyTRY(campaignPrice)}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {offer.offerType !== 'none' ? (
        <div className="mt-4">
          <div className="mb-1.5 flex items-end justify-between gap-2">
            <label
              htmlFor="wiz-offer-offerLabel"
              className="block text-xs font-medium text-slate-700"
            >
              Teklif Etiketi
            </label>
            <CreativeFieldCounter
              current={offer.offerLabel.length}
              max={OFFER_LABEL_MAX}
            />
          </div>
          <input
            id="wiz-offer-offerLabel"
            maxLength={OFFER_LABEL_MAX}
            value={offer.offerLabel}
            aria-invalid={Boolean(errors['offer-offerLabel'])}
            onChange={(e) => onChange({ offerLabel: e.target.value })}
            className={`h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 ${
              errors['offer-offerLabel']
                ? 'border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
            }`}
            placeholder="Yaz fırsatı"
          />
          {errors['offer-offerLabel'] ? (
            <p className="mt-1 text-[11px] text-red-600">
              {errors['offer-offerLabel']}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
