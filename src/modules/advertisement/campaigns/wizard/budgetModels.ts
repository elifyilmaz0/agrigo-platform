export type BudgetModelValue = 'total' | 'daily'

export type BudgetModelOption = {
  value: BudgetModelValue
  label: string
  description: string
}

export const budgetModelOptions: BudgetModelOption[] = [
  {
    value: 'total',
    label: 'Toplam Bütçe',
    description:
      'Kampanya süresi boyunca harcanabilecek toplam tutarı belirler.',
  },
  {
    value: 'daily',
    label: 'Günlük Bütçe',
    description:
      'Kampanyanın her aktif gün için harcayabileceği yaklaşık maksimum tutarı belirler.',
  },
]

export function getBudgetModelLabel(
  value: BudgetModelValue | null | undefined,
): string {
  if (!value) return ''
  return budgetModelOptions.find((option) => option.value === value)?.label ?? ''
}

export const MIN_TOTAL_BUDGET = 500
export const MIN_DAILY_BUDGET = 100
