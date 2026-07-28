import type { TargetingRulesDraft } from './campaignDraft.ts'
import { countMeaningfulTargetingGroups } from './buildTargetingSummary.ts'

/** Mock anonymous farmer universe used for deterministic estimates. */
export const MOCK_AUDIENCE_UNIVERSE = 50_000

/**
 * Deterministic mock estimate. Same rules always produce the same size.
 * This is NOT a real Farmer360 calculation.
 */
export function calculateEstimatedAudience(
  rules: TargetingRulesDraft,
): number {
  const groups = countMeaningfulTargetingGroups(rules)
  if (groups === 0) return 0

  let size = MOCK_AUDIENCE_UNIVERSE

  // Stable hashed reductions based on selected values
  size = applyFactor(size, rules.productionTypes, 0.72, 0.04)
  size = applyFactor(size, rules.crops, 0.55, 0.03)
  size = applyFactor(size, rules.livestockTypes, 0.62, 0.035)

  if (rules.allTurkey) {
    size = Math.floor(size * 0.95)
  } else {
    size = applyFactor(size, rules.provinces, 0.48, 0.05)
  }

  size = applyFactor(size, rules.farmScales, 0.7, 0.04)
  size = applyFactor(size, rules.irrigationMethods, 0.78, 0.03)
  size = applyFactor(size, rules.insuranceStatuses, 0.82, 0.025)
  size = applyFactor(size, rules.digitalPaymentUsage, 0.85, 0.02)
  size = applyFactor(size, rules.creditNeed, 0.88, 0.02)
  size = applyFactor(size, rules.supportStatuses, 0.9, 0.015)

  if (rules.consentRequirements.marketingConsentRequired) {
    size = Math.floor(size * 0.78)
  }
  if (rules.consentRequirements.dataProcessingRequired) {
    size = Math.floor(size * 0.96)
  }

  return Math.max(0, Math.min(MOCK_AUDIENCE_UNIVERSE, size))
}

function applyFactor(
  current: number,
  values: string[],
  baseFactor: number,
  perItemBoost: number,
): number {
  if (values.length === 0) return current
  const hash = stableHash(values.join('|'))
  const jitter = ((hash % 7) - 3) * 0.01
  const breadth = Math.min(values.length - 1, 4) * perItemBoost
  const factor = Math.min(0.98, Math.max(0.2, baseFactor + breadth + jitter))
  return Math.floor(current * factor)
}

function stableHash(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}
