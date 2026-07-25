import type { ReactNode } from 'react'

export type ProfileDetailTone = 'standard' | 'dynamic' | 'ai'

type ProfileDetailFieldCardProps = {
  label: string
  value: string
  missing?: boolean
  tone?: ProfileDetailTone
  badge?: ReactNode
}

const toneDotClass: Record<ProfileDetailTone, string> = {
  standard: 'bg-emerald-500',
  dynamic: 'bg-sky-500',
  ai: 'bg-violet-500',
}

export default function ProfileDetailFieldCard({
  label,
  value,
  missing = false,
  tone = 'standard',
  badge,
}: ProfileDetailFieldCardProps) {
  return (
    <div
      className={`min-w-0 rounded-xl border px-4 py-3.5 ${
        missing ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            missing ? 'bg-amber-500' : toneDotClass[tone]
          }`}
          aria-hidden="true"
        />
        <p className="text-[11px] font-medium text-gray-500">{label}</p>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p
          className={`min-w-0 break-words text-sm font-semibold leading-snug ${
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
