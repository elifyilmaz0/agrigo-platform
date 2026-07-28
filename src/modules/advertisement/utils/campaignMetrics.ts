import type {
  BulkPerformanceRates,
  CampaignStatusSummary,
  NativeDailyMetric,
} from '../types/advertisement.ts'

/** Distribute totals across N days ending at endDate (inclusive). Sums match inputs. */
export function buildNativeDailyMetrics(
  impressions: number,
  clicks: number,
  conversions: number,
  estimatedSpend: number,
  dayCount = 7,
  endDate = '2026-07-27',
): NativeDailyMetric[] {
  const end = new Date(`${endDate}T12:00:00`)
  const weights = Array.from({ length: dayCount }, (_, i) => i + 1)
  const weightSum = weights.reduce((a, b) => a + b, 0)

  let usedImp = 0
  let usedClick = 0
  let usedConv = 0
  let usedSpend = 0

  return weights.map((weight, index) => {
    const isLast = index === dayCount - 1
    const date = new Date(end)
    date.setDate(end.getDate() - (dayCount - 1 - index))

    const dayImpressions = isLast
      ? impressions - usedImp
      : Math.floor((impressions * weight) / weightSum)
    const dayClicks = isLast
      ? clicks - usedClick
      : Math.floor((clicks * weight) / weightSum)
    const dayConversions = isLast
      ? conversions - usedConv
      : Math.floor((conversions * weight) / weightSum)
    const daySpend = isLast
      ? estimatedSpend - usedSpend
      : Math.floor((estimatedSpend * weight) / weightSum)

    usedImp += dayImpressions
    usedClick += dayClicks
    usedConv += dayConversions
    usedSpend += daySpend

    return {
      date: date.toISOString().slice(0, 10),
      impressions: dayImpressions,
      clicks: dayClicks,
      conversions: dayConversions,
      estimatedSpend: daySpend,
    }
  })
}

export function deriveBulkFunnel(rates: BulkPerformanceRates) {
  const eligibleAudience = rates.eligibleAudience
  const delivered = Math.floor(eligibleAudience * rates.deliveryRate)
  const failed = eligibleAudience - delivered
  const read = Math.floor(delivered * rates.readRate)
  const clicked = Math.floor(read * rates.clickRate)

  return {
    eligibleAudience,
    delivered,
    failed,
    read,
    clicked,
    estimatedSpend: rates.estimatedSpend,
    deliveryRatePct:
      eligibleAudience === 0 ? 0 : (delivered / eligibleAudience) * 100,
    readRatePct: delivered === 0 ? 0 : (read / delivered) * 100,
    clickRatePct: read === 0 ? 0 : (clicked / read) * 100,
  }
}

export function computeCampaignStatusSummary(
  campaigns: Array<{ status: string }>,
): CampaignStatusSummary {
  return {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    draft: campaigns.filter((c) => c.status === 'draft').length,
    pendingReview: campaigns.filter((c) => c.status === 'pending_review').length,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
    paused: campaigns.filter((c) => c.status === 'paused').length,
  }
}

export function remainingBudget(budget: number, estimatedSpend: number): number {
  return Math.max(budget - estimatedSpend, 0)
}

export function scheduleDurationLabel(
  startDate: string | null,
  endDate: string | null,
): string {
  if (!startDate || !endDate) return '—'
  const start = new Date(`${startDate}T12:00:00`)
  const end = new Date(`${endDate}T12:00:00`)
  const days =
    Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1
  if (days <= 0) return '—'
  return `${days} gün`
}

export function hasPerformanceData(status: string): boolean {
  return (
    status === 'active' ||
    status === 'paused' ||
    status === 'completed' ||
    status === 'archived'
  )
}

export function clickThroughRate(impressions: number, clicks: number): number {
  if (impressions === 0) return 0
  return (clicks / impressions) * 100
}
