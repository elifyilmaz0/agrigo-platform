import type { ProductionTypeFilterValue } from '../../types/farmer.ts'

const options: ProductionTypeFilterValue[] = [
  'Tümü',
  'Bitkisel',
  'Hayvansal',
  'Arıcılık',
  'Karma',
]

type ProductionTypeFilterProps = {
  value: ProductionTypeFilterValue
  onChange: (value: ProductionTypeFilterValue) => void
}

export default function ProductionTypeFilter({
  value,
  onChange,
}: ProductionTypeFilterProps) {
  return (
    <div>
      <label
        htmlFor="production-type-filter"
        className="mb-1.5 block text-[11px] font-semibold tracking-wide text-gray-500"
      >
        ÜRETİM TİPİ
      </label>
      <select
        id="production-type-filter"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as ProductionTypeFilterValue)
        }
        className="f360-focus w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-600"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
