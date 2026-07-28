export type CreativeCallToAction =
  | 'view-details'
  | 'view-product'
  | 'view-offer'
  | 'visit-website'
  | 'contact-seller'

export type CreativeCallToActionOption = {
  value: CreativeCallToAction
  label: string
  description: string
  requiresUrl: boolean
}

export const creativeCallToActionOptions: CreativeCallToActionOption[] = [
  {
    value: 'view-details',
    label: 'Detayları Gör',
    description: 'Kullanıcıyı ürün veya kampanya detayına yönlendirir.',
    requiresUrl: true,
  },
  {
    value: 'view-product',
    label: 'Ürünü İncele',
    description: 'Kullanıcıyı ürün sayfasına yönlendirir.',
    requiresUrl: true,
  },
  {
    value: 'view-offer',
    label: 'Teklifi Gör',
    description: 'Kullanıcıyı kampanya teklifine yönlendirir.',
    requiresUrl: true,
  },
  {
    value: 'visit-website',
    label: 'Web Sitesine Git',
    description: 'Kullanıcıyı marka web sitesine yönlendirir.',
    requiresUrl: true,
  },
  {
    value: 'contact-seller',
    label: 'Satıcıyla İletişime Geç',
    description: 'Satıcı iletişim bilgisini öne çıkarır. URL opsiyoneldir.',
    requiresUrl: false,
  },
]

export function getCreativeCallToActionOption(
  value: CreativeCallToAction | null | undefined,
): CreativeCallToActionOption | undefined {
  if (!value) return undefined
  return creativeCallToActionOptions.find((option) => option.value === value)
}

export function getCreativeCallToActionLabel(
  value: CreativeCallToAction | null | undefined,
): string {
  return getCreativeCallToActionOption(value)?.label ?? ''
}

export function ctaRequiresUrl(
  value: CreativeCallToAction | null | undefined,
): boolean {
  return Boolean(getCreativeCallToActionOption(value)?.requiresUrl)
}

const LEGACY_CTA_MAP: Record<string, CreativeCallToAction> = {
  'Detayları Gör': 'view-details',
  'Ürünü İncele': 'view-product',
  'Teklifi Gör': 'view-offer',
  'Web Sitesine Git': 'visit-website',
  'İletişime Geç': 'contact-seller',
  'Satıcıyla İletişime Geç': 'contact-seller',
}

export function mapLegacyCtaText(
  text: string | null | undefined,
): CreativeCallToAction | null {
  if (!text?.trim()) return null
  return LEGACY_CTA_MAP[text.trim()] ?? 'view-product'
}
