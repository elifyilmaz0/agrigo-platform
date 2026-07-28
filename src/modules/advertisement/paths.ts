export const ADVERTISEMENT_BASE = '/advertisement'

export const adPaths = {
  dashboard: `${ADVERTISEMENT_BASE}/dashboard`,
  products: `${ADVERTISEMENT_BASE}/products`,
  productNew: `${ADVERTISEMENT_BASE}/products/new`,
  product: (productId: string) =>
    `${ADVERTISEMENT_BASE}/products/${productId}`,
  productEdit: (productId: string) =>
    `${ADVERTISEMENT_BASE}/products/${productId}/edit`,
  campaigns: `${ADVERTISEMENT_BASE}/campaigns`,
  campaignNew: `${ADVERTISEMENT_BASE}/campaigns/new`,
  campaign: (campaignId: string) =>
    `${ADVERTISEMENT_BASE}/campaigns/${campaignId}`,
  campaignEdit: (campaignId: string) =>
    `${ADVERTISEMENT_BASE}/campaigns/${campaignId}/edit`,
  audience: `${ADVERTISEMENT_BASE}/audience`,
  analytics: `${ADVERTISEMENT_BASE}/analytics`,
  companyProfile: `${ADVERTISEMENT_BASE}/company-profile`,
} as const

export const FARMER360_BASE = '/farmer360'
