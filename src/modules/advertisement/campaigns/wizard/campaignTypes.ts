export type WizardCampaignType = 'native' | 'bulk'

export type CampaignTypeOption = {
  value: WizardCampaignType
  label: string
  description: string
  example: string
  advantages: string[]
  selectedInfo: string
}

export const campaignTypeOptions: CampaignTypeOption[] = [
  {
    value: 'native',
    label: 'Native Öneri',
    description:
      'Ürün, çiftçinin AI sohbetindeki ilgili ihtiyaç anında doğal bir öneri olarak gösterilir.',
    example: '“Zeytin yapraklarında hastalık var, ne kullanmalıyım?”',
    advantages: [
      'İhtiyaç anında görünür',
      'Daha yüksek bağlamsal uyum',
      'Reklam hissi daha düşüktür',
    ],
    selectedInfo:
      'Native öneriler, çiftçinin ihtiyacıyla doğrudan ilişkili anlarda gösterilir. Kampanya görünümü daha sonra Kreatif adımında hazırlanacaktır.',
  },
  {
    value: 'bulk',
    label: 'Toplu Mesaj',
    description:
      'Belirlenen hedef kitleye kampanya mesajı toplu şekilde iletilir.',
    example: '“Bu hafta zeytin üreticilerine özel %20 indirim.”',
    advantages: [
      'Geniş hedef kitle erişimi',
      'Zamanlanmış mesaj gönderimi',
      'Kampanya duyuruları için uygundur',
    ],
    selectedInfo:
      'Toplu mesaj kampanyaları, seçilen hedef kitleye planlanan tarih ve saatte gönderilir. Mesaj içeriği Kreatif adımında hazırlanacaktır.',
  },
]

export function getCampaignTypeLabel(
  value: WizardCampaignType | null | undefined,
): string {
  if (!value) return ''
  return (
    campaignTypeOptions.find((option) => option.value === value)?.label ?? ''
  )
}

export function getCampaignTypeOption(
  value: WizardCampaignType | null | undefined,
): CampaignTypeOption | undefined {
  if (!value) return undefined
  return campaignTypeOptions.find((option) => option.value === value)
}

export function mapDomainTypeToWizardType(
  type: 'native_recommendation' | 'bulk_message',
): WizardCampaignType {
  return type === 'native_recommendation' ? 'native' : 'bulk'
}
