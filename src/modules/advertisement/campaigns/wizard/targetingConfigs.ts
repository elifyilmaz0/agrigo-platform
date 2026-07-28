export type TargetingProductionType =
  | 'crop'
  | 'livestock'
  | 'beekeeping'
  | 'mixed'

export type TargetingFarmScale = 'small' | 'medium' | 'large'

export type TargetingOption<T extends string = string> = {
  value: T
  label: string
  description?: string
}

export const targetingProductionTypeOptions: TargetingOption<TargetingProductionType>[] =
  [
    {
      value: 'crop',
      label: 'Bitkisel Üretim',
      description: 'Tarım ürünü yetiştiren işletmeler',
    },
    {
      value: 'livestock',
      label: 'Hayvancılık',
      description: 'Hayvan yetiştiriciliği yapan işletmeler',
    },
    {
      value: 'beekeeping',
      label: 'Arıcılık',
      description: 'Arıcılık faaliyeti yürüten işletmeler',
    },
    {
      value: 'mixed',
      label: 'Karma Üretim',
      description: 'Birden fazla üretim tipi bulunan işletmeler',
    },
  ]

export const targetingCropOptions: TargetingOption[] = [
  { value: 'zeytin', label: 'Zeytin' },
  { value: 'bugday', label: 'Buğday' },
  { value: 'misir', label: 'Mısır' },
  { value: 'aycicegi', label: 'Ayçiçeği' },
  { value: 'domates', label: 'Domates' },
  { value: 'biber', label: 'Biber' },
  { value: 'elma', label: 'Elma' },
  { value: 'uzum', label: 'Üzüm' },
  { value: 'sut-uretimi', label: 'Süt Üretimi' },
  { value: 'besicilik', label: 'Besicilik' },
  { value: 'bal-uretimi', label: 'Bal Üretimi' },
]

export const targetingLivestockOptions: TargetingOption[] = [
  { value: 'buyukbas', label: 'Büyükbaş' },
  { value: 'kucukbas', label: 'Küçükbaş' },
  { value: 'kanatli', label: 'Kanatlı' },
  { value: 'sut-hayvanciligi', label: 'Süt Hayvancılığı' },
  { value: 'besicilik', label: 'Besicilik' },
]

export const targetingProvinceOptions: TargetingOption[] = [
  { value: 'all-turkey', label: 'Tüm Türkiye' },
  { value: 'izmir', label: 'İzmir' },
  { value: 'manisa', label: 'Manisa' },
  { value: 'aydin', label: 'Aydın' },
  { value: 'bursa', label: 'Bursa' },
  { value: 'balikesir', label: 'Balıkesir' },
  { value: 'konya', label: 'Konya' },
  { value: 'adana', label: 'Adana' },
  { value: 'antalya', label: 'Antalya' },
  { value: 'mersin', label: 'Mersin' },
  { value: 'sanliurfa', label: 'Şanlıurfa' },
]

export const targetingFarmScaleOptions: TargetingOption<TargetingFarmScale>[] =
  [
    { value: 'small', label: 'Küçük' },
    { value: 'medium', label: 'Orta' },
    { value: 'large', label: 'Büyük' },
  ]

export const targetingIrrigationOptions: TargetingOption[] = [
  { value: 'drip', label: 'Damla Sulama' },
  { value: 'sprinkler', label: 'Yağmurlama' },
  { value: 'flood', label: 'Salma Sulama' },
  { value: 'dryland', label: 'Kuru Tarım' },
  { value: 'unknown', label: 'Bilinmiyor' },
]

export const targetingInsuranceOptions: TargetingOption[] = [
  { value: 'insured', label: 'Sigortalı' },
  { value: 'uninsured', label: 'Sigortasız' },
  { value: 'expiring', label: 'Süresi Yaklaşan' },
  { value: 'unknown', label: 'Bilinmiyor' },
]

export const targetingDigitalPaymentOptions: TargetingOption[] = [
  { value: 'uses', label: 'Kullanıyor' },
  { value: 'does-not-use', label: 'Kullanmıyor' },
  { value: 'unknown', label: 'Bilinmiyor' },
]

export const targetingCreditNeedOptions: TargetingOption[] = [
  { value: 'yes', label: 'Var' },
  { value: 'no', label: 'Yok' },
  { value: 'unknown', label: 'Bilinmiyor' },
]

export const targetingSupportStatusOptions: TargetingOption[] = [
  { value: 'receiving', label: 'Destek Alıyor' },
  { value: 'not-receiving', label: 'Destek Almıyor' },
  { value: 'applying', label: 'Başvuru Sürecinde' },
  { value: 'unknown', label: 'Bilinmiyor' },
]

export function getTargetingOptionLabel(
  options: TargetingOption[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? value
}
