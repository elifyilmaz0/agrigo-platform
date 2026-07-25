import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-4 py-8 text-center ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-200">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-semibold text-gray-800">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  )
}
