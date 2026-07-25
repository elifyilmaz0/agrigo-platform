import type { Farmer } from '../types/farmer.ts'
import {
  requiresIrrigationSystem,
  requiresSoilType,
} from './productionFieldRelevance.ts'

export type CompletenessStatus = 'sufficient' | 'partial' | 'insufficient'

export type CompletenessPurposeKey =
  | 'agricultural_support'
  | 'commercial_matching'
  | 'financial_segmentation'

export interface CompletenessResult {
  key: CompletenessPurposeKey
  label: string
  completed: number
  total: number
  percentage: number
  status: CompletenessStatus
}

const PLACEHOLDER_VALUES = new Set(['Belirtilmedi', 'Bilinmiyor', '—', '-'])

export const COMPLETENESS_STATUS_THRESHOLDS = {
  sufficient: 80,
  partial: 50,
} as const

export const COMPLETENESS_STATUS_LABELS: Record<CompletenessStatus, string> = {
  sufficient: 'Yeterli',
  partial: 'Kısmi',
  insufficient: 'Yetersiz',
}

export function isMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }

  if (typeof value === 'boolean') {
    return true
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (trimmed === '') {
      return false
    }

    if (PLACEHOLDER_VALUES.has(trimmed)) {
      return false
    }

    return true
  }

  if (Array.isArray(value)) {
    return value.length > 0
  }

  return true
}

function isDistrictOrVillageComplete(farmer: Farmer): boolean {
  return (
    isMeaningfulValue(farmer.district) || isMeaningfulValue(farmer.village)
  )
}

function countCompleted(checks: boolean[]): Pick<CompletenessResult, 'completed' | 'total'> {
  return {
    completed: checks.filter(Boolean).length,
    total: checks.length,
  }
}

function resolveStatus(percentage: number): CompletenessStatus {
  if (percentage >= COMPLETENESS_STATUS_THRESHOLDS.sufficient) {
    return 'sufficient'
  }

  if (percentage >= COMPLETENESS_STATUS_THRESHOLDS.partial) {
    return 'partial'
  }

  return 'insufficient'
}

function buildResult(
  key: CompletenessPurposeKey,
  label: string,
  checks: boolean[],
): CompletenessResult {
  const { completed, total } = countCompleted(checks)
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return {
    key,
    label,
    completed,
    total,
    percentage,
    status: resolveStatus(percentage),
  }
}

export function calculateProfileCompleteness(farmer: Farmer): CompletenessResult[] {
  const agriculturalSupportChecks = [
    isMeaningfulValue(farmer.productionType),
    isMeaningfulValue(farmer.production.product),
    isMeaningfulValue(farmer.production.fieldSize),
    isMeaningfulValue(farmer.province),
    isDistrictOrVillageComplete(farmer),
    isMeaningfulValue(farmer.production.salesChannel),
  ]

  if (requiresIrrigationSystem(farmer)) {
    agriculturalSupportChecks.push(
      isMeaningfulValue(farmer.production.irrigationSystem),
    )
  }

  if (requiresSoilType(farmer)) {
    agriculturalSupportChecks.push(isMeaningfulValue(farmer.production.soilType))
  }

  const agriculturalSupport = buildResult(
    'agricultural_support',
    'Tarımsal Destek',
    agriculturalSupportChecks,
  )

  const commercialMatching = buildResult('commercial_matching', 'Ticari Eşleştirme', [
    isMeaningfulValue(farmer.productionType),
    isMeaningfulValue(farmer.production.product),
    isMeaningfulValue(farmer.production.salesChannel),
    isMeaningfulValue(farmer.finance.incomeRange),
    isMeaningfulValue(farmer.finance.inputBudget),
    isMeaningfulValue(farmer.preferredChannel),
    isMeaningfulValue(farmer.province),
    isDistrictOrVillageComplete(farmer),
  ])

  const financialSegmentation = buildResult(
    'financial_segmentation',
    'Finansal Segmentasyon',
    [
      isMeaningfulValue(farmer.finance.incomeRange),
      isMeaningfulValue(farmer.finance.inputBudget),
      isMeaningfulValue(farmer.finance.creditNeed),
      isMeaningfulValue(farmer.finance.creditAmount),
      isMeaningfulValue(farmer.finance.supportStatus),
      isMeaningfulValue(farmer.insurance.status),
      isMeaningfulValue(farmer.insurance.type),
      isMeaningfulValue(farmer.insurance.renewalInterest),
    ],
  )

  return [agriculturalSupport, commercialMatching, financialSegmentation]
}
