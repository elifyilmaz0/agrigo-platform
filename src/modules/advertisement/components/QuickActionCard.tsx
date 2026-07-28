import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

type QuickActionCardProps = {
  title: string
  description: string
  to: string
  icon: LucideIcon
}

export default function QuickActionCard({
  title,
  description,
  to,
  icon: Icon,
}: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  )
}
