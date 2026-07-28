import type { ProductStatusTone } from './productSalesStatus.ts'

export type ProductStockStatusValue =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock'
  | 'unknown'

export type ProductStockStatusOption = {
  value: ProductStockStatusValue
  label: string
  description: string
  tone: ProductStatusTone
}

export const productStockStatusOptions: ProductStockStatusOption[] = [
  {
    value: 'in-stock',
    label: 'Stokta',
    description: 'Ürün stokta mevcuttur.',
    tone: 'success',
  },
  {
    value: 'low-stock',
    label: 'Kritik Stok',
    description: 'Stok seviyesi kritik eşiğe yakındır.',
    tone: 'warning',
  },
  {
    value: 'out-of-stock',
    label: 'Stok Tükendi',
    description: 'Ürün stokta bulunmamaktadır.',
    tone: 'danger',
  },
  {
    value: 'unknown',
    label: 'Stok Bilgisi Yok',
    description: 'Stok durumu henüz tanımlanmamıştır.',
    tone: 'neutral',
  },
]

export function getProductStockStatusOption(
  value: ProductStockStatusValue | null | undefined,
): ProductStockStatusOption | undefined {
  if (!value) return undefined
  return productStockStatusOptions.find((option) => option.value === value)
}

export function getProductStockStatusLabel(
  value: ProductStockStatusValue | null | undefined,
): string {
  return getProductStockStatusOption(value)?.label ?? '—'
}
