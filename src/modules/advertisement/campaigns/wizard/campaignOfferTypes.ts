export type CampaignOfferType =
  | 'none'
  | 'percentage'
  | 'fixed-price'
  | 'fixed-discount'

export type CampaignOfferTypeOption = {
  value: CampaignOfferType
  label: string
  description: string
}

export const campaignOfferTypeOptions: CampaignOfferTypeOption[] = [
  {
    value: 'none',
    label: 'Teklif Yok',
    description: 'Bu kampanyada özel fiyat veya indirim tanımlanmaz.',
  },
  {
    value: 'percentage',
    label: 'Yüzde İndirim',
    description: 'Katalogdaki geçerli fiyat üzerinden yüzde indirim uygulanır.',
  },
  {
    value: 'fixed-price',
    label: 'Kampanya Fiyatı',
    description: 'Kampanyaya özel sabit bir satış fiyatı tanımlanır.',
  },
  {
    value: 'fixed-discount',
    label: 'Sabit Tutar İndirimi',
    description: 'Katalogdaki geçerli fiyattan sabit tutar düşülür.',
  },
]

export function getCampaignOfferTypeLabel(
  value: CampaignOfferType | null | undefined,
): string {
  if (!value) return ''
  return (
    campaignOfferTypeOptions.find((option) => option.value === value)?.label ??
    ''
  )
}
