import type { Farmer } from '../types/farmer.ts'
import { calculateProfileCompleteness } from './calculateProfileCompleteness.ts'
import { getActiveRisks } from './getActiveRisks.ts'
import { getCriticalMissingFields } from './getCriticalMissingFields.ts'

export type FarmerOverallStatusLevel = 'good' | 'follow_up' | 'priority'

export interface FarmerOverallStatus {
  level: FarmerOverallStatusLevel
  label: string
  description: string
}

const PRIORITY_STATUS: FarmerOverallStatus = {
  level: 'priority',
  label: 'Öncelikli',
  description:
    'Profilde öncelikli olarak ele alınması gereken risk veya veri eksikleri bulunuyor.',
}

const FOLLOW_UP_STATUS: FarmerOverallStatus = {
  level: 'follow_up',
  label: 'Takip Edilmeli',
  description:
    'Profilde doğrulanması veya tamamlanması gereken bilgiler bulunuyor.',
}

const GOOD_STATUS: FarmerOverallStatus = {
  level: 'good',
  label: 'İyi Durumda',
  description:
    'Mevcut profil verilerinde öncelikli bir risk veya kritik eksik bulunmuyor.',
}

export function getFarmerOverallStatus(farmer: Farmer): FarmerOverallStatus {
  const risks = getActiveRisks(farmer)
  const missingFields = getCriticalMissingFields(farmer)
  const completenessResults = calculateProfileCompleteness(farmer)

  const highRiskCount = risks.filter((risk) => risk.level === 'high').length
  const mediumRiskCount = risks.filter((risk) => risk.level === 'medium').length
  const criticalMissingCount = missingFields.filter(
    (field) => field.priority === 'critical',
  ).length
  const insufficientCompletenessCount = completenessResults.filter(
    (result) => result.status === 'insufficient',
  ).length
  const partialCompletenessCount = completenessResults.filter(
    (result) => result.status === 'partial',
  ).length

  if (
    highRiskCount >= 1 ||
    criticalMissingCount >= 3 ||
    insufficientCompletenessCount >= 2
  ) {
    return PRIORITY_STATUS
  }

  if (
    mediumRiskCount >= 1 ||
    criticalMissingCount >= 1 ||
    insufficientCompletenessCount >= 1 ||
    partialCompletenessCount >= 1
  ) {
    return FOLLOW_UP_STATUS
  }

  return GOOD_STATUS
}
