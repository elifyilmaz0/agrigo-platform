export type BidStrategyValue = 'automatic' | 'manual'

export type BidStrategyOption = {
  value: BidStrategyValue
  label: string
  description: string
}

export const bidStrategyOptions: BidStrategyOption[] = [
  {
    value: 'automatic',
    label: 'Otomatik Dağıtım',
    description:
      'Sistem, bütçeyi planlanan süre ve tahmini hedef kitleye göre dengeli biçimde dağıtır.',
  },
  {
    value: 'manual',
    label: 'Manuel Birim Teklif',
    description:
      'Gösterim veya etkileşim başına kullanılabilecek mock maksimum teklif değeridir.',
  },
]

export function getBidStrategyLabel(
  value: BidStrategyValue | null | undefined,
): string {
  if (!value) return ''
  return bidStrategyOptions.find((option) => option.value === value)?.label ?? ''
}
