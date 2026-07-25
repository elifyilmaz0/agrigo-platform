import type { ReactNode } from 'react'

export type DetailFieldKind = 'standard' | 'ai' | 'dynamic'

type DetailFieldCardProps = {
  label: string
  value: string
  missing?: boolean
  kind?: DetailFieldKind
  badge?: ReactNode
  trailing?: ReactNode
}

const kindDotClass: Record<DetailFieldKind, string> = {
  standard: 'bg-emerald-600',
  ai: 'bg-violet-500',
  dynamic: 'bg-sky-500',
}

export default function DetailFieldCard({
  label,
  value,
  missing = false,
  kind = 'standard',
  badge,
  trailing,
}: DetailFieldCardProps) {
  return (
    <div
      className={`min-w-0 rounded-xl border px-4 py-3 ${
        missing
          ? 'border-amber-200 bg-amber-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${kindDotClass[kind]}`}
            aria-hidden="true"
          />
          <p className="text-[11px] font-medium text-gray-500">{label}</p>
        </div>
        {trailing}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p
          className={`min-w-0 break-words text-sm font-semibold ${
            missing ? 'text-amber-800' : 'text-gray-900'
          }`}
        >
          {value}
        </p>
        {badge}
      </div>
    </div>
  )
}
