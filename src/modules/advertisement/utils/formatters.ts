import type { CampaignStatus, CampaignType } from '../types/advertisement.ts'

export const campaignStatusLabels: Record<CampaignStatus, string> = {
  active: 'Aktif',
  draft: 'Taslak',
  pending_review: 'İnceleme Bekliyor',
  scheduled: 'Planlandı',
  paused: 'Duraklatıldı',
  completed: 'Tamamlandı',
  archived: 'Arşivlendi',
}

export const campaignTypeLabels: Record<CampaignType, string> = {
  native_recommendation: 'Doğal AI Önerisi',
  bulk_message: 'Toplu Mesaj',
}

export const campaignStatusBadgeStyles: Record<CampaignStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-slate-50 text-slate-600 border-slate-200',
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  scheduled: 'bg-sky-50 text-sky-700 border-sky-200',
  paused: 'bg-orange-50 text-orange-700 border-orange-200',
  completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  archived: 'bg-gray-50 text-gray-500 border-gray-200',
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return 'Fiyat belirtilmedi'
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} ₺`
}

/** Alias kept for commerce-facing call sites */
export function formatCurrencyTRY(value: number | null | undefined): string {
  return formatCurrency(value)
}

export function formatNumber(value: number): string {
  return value.toLocaleString('tr-TR')
}

export function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function parseStatusQueryParam(
  value: string | null,
): CampaignStatus | null {
  if (!value) return null
  const valid: CampaignStatus[] = [
    'active',
    'draft',
    'pending_review',
    'scheduled',
    'paused',
    'completed',
    'archived',
  ]
  return valid.includes(value as CampaignStatus)
    ? (value as CampaignStatus)
    : null
}
