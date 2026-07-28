import type { CampaignOfferDraft } from './campaignDraft.ts'

export type OfferPriceInput = {
  listPrice: number | null | undefined
  discountedPrice: number | null | undefined
  offer: CampaignOfferDraft
}

/**
 * Catalog base price for campaign offer calculations.
 * Priority: discountedPrice → listPrice → null
 */
export function getCatalogEffectivePrice(
  listPrice: number | null | undefined,
  discountedPrice: number | null | undefined,
): number | null {
  if (discountedPrice != null && !Number.isNaN(discountedPrice)) {
    return discountedPrice
  }
  if (listPrice != null && !Number.isNaN(listPrice)) {
    return listPrice
  }
  return null
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Calculates campaign offer price without mutating Product data.
 * Returns null when offer is none or inputs are insufficient.
 */
export function calculateCampaignOfferPrice({
  listPrice,
  discountedPrice,
  offer,
}: OfferPriceInput): number | null {
  if (offer.offerType === 'none') return null

  const base = getCatalogEffectivePrice(listPrice, discountedPrice)

  if (offer.offerType === 'percentage') {
    if (base == null || offer.percentageValue == null) return null
    const pct = offer.percentageValue
    if (pct < 1 || pct > 100) return null
    return Math.max(0, roundMoney(base * (1 - pct / 100)))
  }

  if (offer.offerType === 'fixed-price') {
    if (offer.campaignPrice == null || Number.isNaN(offer.campaignPrice)) {
      return null
    }
    return Math.max(0, roundMoney(offer.campaignPrice))
  }

  if (offer.offerType === 'fixed-discount') {
    if (base == null || offer.discountAmount == null) return null
    return Math.max(0, roundMoney(base - offer.discountAmount))
  }

  return null
}
