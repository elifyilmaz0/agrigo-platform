type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'ai'

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
  className?: string
}

const toneClass: Record<StatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  neutral: 'border-gray-200 bg-gray-50 text-gray-600',
  ai: 'border-violet-200 bg-violet-50 text-violet-700',
}

const labelToneMap: Record<string, StatusTone> = {
  Onaylandı: 'success',
  Doğrulandı: 'success',
  Tamamlandı: 'success',
  Güncel: 'success',
  Aktif: 'success',
  Düzeltildi: 'info',
  İncelemede: 'warning',
  Bekliyor: 'warning',
  Taslak: 'warning',
  Reddedildi: 'danger',
  Eskimiş: 'neutral',
  Pasif: 'neutral',
  'AI İncelemesi': 'ai',
  'Manuel Görev': 'info',
}

function resolveStatusTone(label: string): StatusTone {
  return labelToneMap[label] ?? 'neutral'
}

export default function StatusBadge({
  label,
  tone,
  className = '',
}: StatusBadgeProps) {
  const resolvedTone = tone ?? resolveStatusTone(label)

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none ${toneClass[resolvedTone]} ${className}`}
    >
      {label}
    </span>
  )
}
