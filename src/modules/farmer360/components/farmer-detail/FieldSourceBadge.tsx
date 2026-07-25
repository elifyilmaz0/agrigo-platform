import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Sparkles,
} from 'lucide-react'
import type { FieldSource } from '../../types/farmer.ts'

export type FieldSourceBadgeProps = {
  source?: FieldSource
  compact?: boolean
}

const sourceLabels: Record<FieldSource, string> = {
  ai: 'AI',
  manual: 'Manuel',
  field: 'Saha',
  phone: 'Telefon',
  whatsapp: 'WhatsApp',
  form: 'Form',
}

const sourceIcons: Record<FieldSource, LucideIcon> = {
  ai: Sparkles,
  manual: Pencil,
  field: MapPin,
  phone: Phone,
  whatsapp: MessageCircle,
  form: FileText,
}

const sourceStyles: Record<FieldSource, string> = {
  ai: 'border-violet-200 bg-violet-50 text-violet-700',
  manual: 'border-gray-200 bg-gray-50 text-gray-600',
  field: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  phone: 'border-amber-200 bg-amber-50 text-amber-700',
  whatsapp: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  form: 'border-blue-200 bg-blue-50 text-blue-700',
}

export default function FieldSourceBadge({ source, compact = false }: FieldSourceBadgeProps) {
  if (!source) {
    return null
  }

  const Icon = sourceIcons[source]

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 font-medium leading-none ${
        compact ? 'text-[10px]' : 'text-xs'
      } ${sourceStyles[source]}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {sourceLabels[source]}
    </span>
  )
}
