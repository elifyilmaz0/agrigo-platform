export type CampaignObjectiveValue =
  | 'awareness'
  | 'engagement'
  | 'website-traffic'
  | 'promotion'
  | 'conversion'
  | 'remarketing'

export type CampaignObjectiveOption = {
  value: CampaignObjectiveValue
  label: string
  description: string
}

export const campaignObjectiveOptions: CampaignObjectiveOption[] = [
  {
    value: 'awareness',
    label: 'Ürün Bilinirliği',
    description: 'Ürününüzü ilgili çiftçilere tanıtmak için kullanılır.',
  },
  {
    value: 'engagement',
    label: 'Etkileşim',
    description: 'Mesaj, öneri veya içeriğe tıklama ve etkileşimi artırmak için kullanılır.',
  },
  {
    value: 'website-traffic',
    label: 'Web Sitesi Trafiği',
    description: 'Ürün veya marka sayfanıza ziyaret yönlendirmek için kullanılır.',
  },
  {
    value: 'promotion',
    label: 'Kampanya Duyurusu',
    description: 'İndirim, sezon fırsatı veya dönemsel duyuruları yaymak için kullanılır.',
  },
  {
    value: 'conversion',
    label: 'Satışa Yönlendirme',
    description: 'Satın alma, teklif alma veya doğrudan dönüşüm amaçlı kullanılır.',
  },
  {
    value: 'remarketing',
    label: 'Yeniden Etkileşim',
    description: 'Daha önce ilgi gösteren kitlelere yeniden ulaşmak için kullanılır.',
  },
]

export function getCampaignObjectiveLabel(
  value: CampaignObjectiveValue | null | undefined,
): string {
  if (!value) return ''
  return (
    campaignObjectiveOptions.find((option) => option.value === value)?.label ??
    ''
  )
}

export function getCampaignObjectiveDescription(
  value: CampaignObjectiveValue | null | undefined,
): string {
  if (!value) return ''
  return (
    campaignObjectiveOptions.find((option) => option.value === value)
      ?.description ?? ''
  )
}
