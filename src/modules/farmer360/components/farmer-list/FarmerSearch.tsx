import { Search } from 'lucide-react'

type FarmerSearchProps = {
  value: string
  onChange: (value: string) => void
}

export default function FarmerSearch({ value, onChange }: FarmerSearchProps) {
  return (
    <div>
      <label htmlFor="farmer-search" className="sr-only">
        Çiftçi ara
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="farmer-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Çiftçi ara..."
          className="f360-focus w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-600"
        />
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
        Ad soyad, çiftçi kodu, telefon, il, ilçe veya köy/mahalleye göre arar
      </p>
    </div>
  )
}
