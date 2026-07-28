import type { Product } from '../types/advertisement.ts'
import { formatCurrencyTRY } from '../utils/formatters.ts'
import {
  getProductDiscountedPrice,
  getProductListPrice,
} from '../data/products.ts'

export default function ProductPriceDisplay({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  const listPrice = getProductListPrice(product)
  const discountedPrice = getProductDiscountedPrice(product)
  const hasDiscount =
    listPrice != null &&
    discountedPrice != null &&
    discountedPrice < listPrice

  if (listPrice == null && discountedPrice == null) {
    return (
      <span className={compact ? 'text-xs text-slate-400' : 'text-sm text-slate-400'}>
        Fiyat belirtilmedi
      </span>
    )
  }

  if (hasDiscount) {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={`text-slate-400 line-through ${compact ? 'text-[11px]' : 'text-xs'}`}
        >
          {formatCurrencyTRY(listPrice)}
        </span>
        <span
          className={`font-semibold text-emerald-800 ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {formatCurrencyTRY(discountedPrice)}
        </span>
      </span>
    )
  }

  return (
    <span
      className={`font-semibold text-slate-800 ${compact ? 'text-xs' : 'text-sm'}`}
    >
      {formatCurrencyTRY(discountedPrice ?? listPrice)}
    </span>
  )
}
