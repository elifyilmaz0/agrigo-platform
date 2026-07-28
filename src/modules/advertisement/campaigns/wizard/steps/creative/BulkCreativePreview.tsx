import { ImageIcon } from 'lucide-react'
import { getProductBrand } from '../../../../data/products.ts'
import type { Product } from '../../../../types/advertisement.ts'
import { formatCurrencyTRY } from '../../../../utils/formatters.ts'
import {
  calculateCampaignOfferPrice,
  getCatalogEffectivePrice,
} from '../../calculateCampaignOfferPrice.ts'
import type {
  BulkCreativeDraft,
  CampaignOfferDraft,
} from '../../campaignDraft.ts'
import { getCreativeCallToActionLabel } from '../../creativeCallToActions.ts'

type BulkCreativePreviewProps = {
  bulk: BulkCreativeDraft
  offer: CampaignOfferDraft
  product: Product | undefined
}

export default function BulkCreativePreview({
  bulk,
  offer,
  product,
}: BulkCreativePreviewProps) {
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
    getCreativeCallToActionLabel(bulk.callToAction) || 'CTA seçin'

  return (
    <div
      className="mx-auto w-full max-w-[340px] rounded-[1.5rem] border border-slate-300 bg-slate-900 p-2 shadow-md"
      aria-label="Toplu mesaj canlı önizlemesi"
    >
      <div className="rounded-[1.15rem] bg-[#ece5dd] p-3">
        <div className="mb-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>Kampanya mesajı</span>
          <span>14:32</span>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate-900">
                {bulk.senderName.trim() || 'Gönderen adı'}
              </p>
              <span className="mt-1 inline-flex rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                Sponsorlu kampanya
              </span>
            </div>
          </div>

          <p className="mt-3 text-sm font-semibold text-slate-900">
            {bulk.messageTitle.trim() || 'Mesaj başlığınız burada görünecek'}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            {bulk.messageBody.trim() || 'Mesaj metniniz burada görünecek'}
          </p>

          <div className="mt-3 flex gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white text-slate-400">
              <ImageIcon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-900">
                {product?.name || 'Ürün adı burada görünecek'}
              </p>
              <p className="text-[10px] text-slate-500">
                {product ? getProductBrand(product) : 'Marka'}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                {basePrice != null ? (
                  <span
                    className={`text-[11px] ${campaignPrice != null ? 'text-slate-400 line-through' : 'font-medium text-slate-800'}`}
                  >
                    {formatCurrencyTRY(basePrice)}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Fiyat belirtilmedi
                  </span>
                )}
                {campaignPrice != null ? (
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {formatCurrencyTRY(campaignPrice)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {offer.offerType !== 'none' && offer.offerLabel.trim() ? (
            <p className="mt-2 text-[10px] font-semibold text-emerald-800">
              {offer.offerLabel}
            </p>
          ) : null}

          {bulk.callToAction === 'contact-seller' && product?.sellerContact ? (
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

          {bulk.footerText.trim() ? (
            <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
              {bulk.footerText}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
