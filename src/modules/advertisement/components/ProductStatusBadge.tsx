import type { ProductStatusTone } from '../data/productSalesStatus.ts'

const toneClasses: Record<ProductStatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

export default function ProductStatusBadge({
  label,
  tone,
}: {
  label: string
  tone: ProductStatusTone
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  )
}
