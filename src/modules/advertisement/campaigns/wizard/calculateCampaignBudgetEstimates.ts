import type { BudgetDraft, ScheduleDraft } from './campaignDraft.ts'
import type { WizardCampaignType } from './campaignTypes.ts'
import { calculateActiveCampaignDays } from './calculateActiveCampaignDays.ts'

export type BudgetEstimateInput = {
  budget: BudgetDraft
  schedule: ScheduleDraft
  audienceEstimatedSize: number | null
  campaignType: WizardCampaignType | null
}

export type BudgetEstimates = {
  estimatedDailySpend: number | null
  estimatedTotalSpend: number | null
  estimatedReach: number | null
  estimatedImpressions: number | null
  activeDays: number | null
}

/**
 * Deterministic mock media estimates. Not a real performance guarantee.
 */
export function calculateCampaignBudgetEstimates({
  budget,
  schedule,
  audienceEstimatedSize,
  campaignType,
}: BudgetEstimateInput): BudgetEstimates {
  const activeDays = calculateActiveCampaignDays(schedule, campaignType)

  let estimatedDailySpend: number | null = null
  let estimatedTotalSpend: number | null = null

  if (budget.model === 'daily' && budget.dailyBudget != null) {
    estimatedDailySpend = budget.dailyBudget
    estimatedTotalSpend =
      activeDays != null ? roundMoney(budget.dailyBudget * activeDays) : null
  } else if (budget.model === 'total' && budget.totalBudget != null) {
    estimatedTotalSpend = budget.totalBudget
    estimatedDailySpend =
      activeDays != null && activeDays > 0
        ? roundMoney(budget.totalBudget / activeDays)
        : budget.totalBudget
  }

  if (
    budget.spendLimit != null &&
    estimatedTotalSpend != null &&
    budget.spendLimit < estimatedTotalSpend
  ) {
    estimatedTotalSpend = budget.spendLimit
    if (activeDays != null && activeDays > 0) {
      estimatedDailySpend = roundMoney(estimatedTotalSpend / activeDays)
    }
  }

  const spendForReach = estimatedTotalSpend ?? estimatedDailySpend
  if (spendForReach == null || spendForReach <= 0) {
    return {
      estimatedDailySpend,
      estimatedTotalSpend,
      estimatedReach: null,
      estimatedImpressions: null,
      activeDays,
    }
  }

  const audienceCap =
    audienceEstimatedSize != null && audienceEstimatedSize > 0
      ? audienceEstimatedSize
      : null

  const typeFactor = campaignType === 'bulk' ? 1.15 : 0.72
  const bidFactor = budget.bidStrategy === 'manual' ? 0.92 : 1
  const seed = stableHash(
    [
      String(spendForReach),
      String(activeDays ?? 0),
      String(audienceCap ?? 0),
      campaignType ?? 'none',
      budget.model ?? 'none',
    ].join('|'),
  )

  const reachRatio = Math.min(
    0.92,
    Math.max(0.08, (0.18 + (seed % 40) / 100) * typeFactor * bidFactor),
  )

  let estimatedReach =
    audienceCap != null
      ? Math.floor(audienceCap * reachRatio)
      : Math.floor(spendForReach * (campaignType === 'bulk' ? 2.4 : 1.6))

  if (audienceCap != null) {
    estimatedReach = Math.min(estimatedReach, audienceCap)
  }
  estimatedReach = Math.max(0, estimatedReach)

  const impressionMultiplier =
    campaignType === 'bulk'
      ? 1.05 + (seed % 10) / 100
      : 1.35 + (seed % 25) / 100

  const estimatedImpressions = Math.max(
    estimatedReach,
    Math.floor(estimatedReach * impressionMultiplier),
  )

  return {
    estimatedDailySpend,
    estimatedTotalSpend,
    estimatedReach,
    estimatedImpressions,
    activeDays,
  }
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function stableHash(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}
