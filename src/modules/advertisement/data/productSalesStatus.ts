export type ProductSalesStatusValue =
  | 'on-sale'
  | 'not-on-sale'
  | 'coming-soon'
  | 'out-of-stock'

export type ProductStatusTone = 'success' | 'neutral' | 'warning' | 'danger' | 'info'

export type ProductSalesStatusOption = {
  value: ProductSalesStatusValue
  label: string
  description: string
  tone: ProductStatusTone
}

export const productSalesStatusOptions: ProductSalesStatusOption[] = [
  {
    value: 'on-sale',
    label: 'Satışta',
    description: 'Ürün katalogda satışa açıktır.',
    tone: 'success',
  },
  {
    value: 'not-on-sale',
    label: 'Satışta Değil',
    description: 'Ürün katalogda görünür ancak satışa kapalıdır.',
    tone: 'neutral',
  },
  {
    value: 'coming-soon',
    label: 'Yakında Satışta',
    description: 'Ürün yaklaşan lansman veya ön talep için listelenir.',
    tone: 'info',
  },
  {
    value: 'out-of-stock',
    label: 'Stok Nedeniyle Satışta Değil',
    description: 'Stok nedeniyle satış geçici olarak kapalıdır.',
    tone: 'warning',
  },
]

export function getProductSalesStatusOption(
  value: ProductSalesStatusValue | null | undefined,
): ProductSalesStatusOption | undefined {
  if (!value) return undefined
  return productSalesStatusOptions.find((option) => option.value === value)
}

export function getProductSalesStatusLabel(
  value: ProductSalesStatusValue | null | undefined,
): string {
  return getProductSalesStatusOption(value)?.label ?? '—'
}
