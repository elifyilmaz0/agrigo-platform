import { ImageIcon } from 'lucide-react'
import type { Product } from '../../../../types/advertisement.ts'
import { formatCurrencyTRY } from '../../../../utils/formatters.ts'
import {
  calculateCampaignOfferPrice,
  getCatalogEffectivePrice,
} from '../../calculateCampaignOfferPrice.ts'
import type {
  CampaignOfferDraft,
  NativeCreativeDraft,
} from '../../campaignDraft.ts'
import { getCreativeCallToActionLabel } from '../../creativeCallToActions.ts'
import { getProductBrand } from '../../../../data/products.ts'

type NativeCreativePreviewProps = {
  native: NativeCreativeDraft
  offer: CampaignOfferDraft
  product: Product | undefined
}

export default function NativeCreativePreview({
  native,
  offer,
  product,
}: NativeCreativePreviewProps) {
  const basePrice = getCatalogEffectivePrice(
    product?.listPrice,
    product?.discountedPrice,
  )
  const campaignPrice = calculateCampaignOfferPrice({
    listPrice: product?.listPrice,
    discountedPrice: product?.discountedPrice,
    offer,
  })
  const ctaLabel =
    getCreativeCallToActionLabel(native.callToAction) || 'CTA seçin'

  return (
    <div
      className="rounded-lg border border-slate-200 bg-[#f7f8f5] p-3"
      aria-label="Native öneri canlı önizlemesi"
    >
      <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
        AI Sohbet · Mock Önizleme
      </p>

      <div className="mt-3 space-y-2">
        <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-emerald-700 px-3 py-2 text-[11px] text-white">
          Zeytin yapraklarında lekeler var. Ne yapmalıyım?
        </div>
        <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-2 text-[11px] leading-relaxed text-slate-600">
          Belirtilerin kaynağı farklı olabilir. Yaprakları kontrol etmek ve
          uygun tarımsal uygulamayı belirlemek önemlidir.
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3 shadow-sm">
        <span className="inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          {native.disclosureText.trim() || 'Sponsorlu ürün önerisi'}
        </span>

        <div className="mt-3 flex gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-400">
            <ImageIcon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900">
              {product?.name || 'Ürün adı burada görünecek'}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {product ? getProductBrand(product) : 'Marka'}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-900">
          {native.recommendationTitle.trim() ||
            'Öneri başlığınız burada görünecek'}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
          {native.recommendationText.trim() ||
            'Öneri metniniz burada görünecek'}
        </p>

        {offer.offerType !== 'none' && offer.offerLabel.trim() ? (
          <p className="mt-2 inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
            {offer.offerLabel}
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          {basePrice != null ? (
            <span
              className={`text-xs ${campaignPrice != null ? 'text-slate-400 line-through' : 'font-semibold text-slate-800'}`}
            >
              {formatCurrencyTRY(basePrice)}
            </span>
          ) : (
            <span className="text-xs text-slate-400">Fiyat belirtilmedi</span>
          )}
          {campaignPrice != null ? (
            <span className="text-sm font-semibold text-emerald-800">
              {formatCurrencyTRY(campaignPrice)}
            </span>
          ) : null}
        </div>

        {native.callToAction === 'contact-seller' && product?.sellerContact ? (
          <p className="mt-2 text-[11px] text-slate-600">
            İletişim: {product.sellerContact}
          </p>
        ) : null}

        <button
          type="button"
          tabIndex={-1}
          className="mt-3 w-full rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white"
        >
          {ctaLabel}
        </button>

        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
          Bu öneri ticari içeriktir. Kullanım öncesinde ürün talimatlarını ve
          uzman görüşünü dikkate alın.
        </p>
      </div>
    </div>
  )
}
