import type { Farmer } from '../types/farmer.ts'
import { isMeaningfulValue } from './calculateProfileCompleteness.ts'
import {
  requiresIrrigationSystem,
  requiresSoilType,
} from './productionFieldRelevance.ts'

export type RiskLevel = 'high' | 'medium' | 'low'

export type RiskCategory = 'production' | 'finance' | 'insurance' | 'data_quality'

export interface FarmerRisk {
  id: string
  title: string
  description: string
  level: RiskLevel
  category: RiskCategory
  reason: string
}

type RiskRule = {
  id: string
  level: RiskLevel
  category: RiskCategory
  title: string
  description: string
  reason: string
  matches: (farmer: Farmer) => boolean
}

const LEVEL_ORDER: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

function isInsuranceAtRisk(status: string): boolean {
  if (!isMeaningfulValue(status)) {
    return true
  }

  const normalized = normalizeText(status)

  if (normalized === 'aktif') {
    return false
  }

  return (
    normalized === 'yok' ||
    normalized === 'hayır' ||
    normalized === 'belirtilmedi' ||
    normalized === 'bilinmiyor' ||
    normalized === 'pasif'
  )
}

function hasCreditNeed(creditNeed: string): boolean {
  if (!isMeaningfulValue(creditNeed)) {
    return false
  }

  const normalized = normalizeText(creditNeed)

  return normalized === 'var' || normalized === 'evet' || normalized === 'ihtiyaç var'
}

const RISK_RULES: RiskRule[] = [
  {
    id: 'missing-field-size',
    level: 'high',
    category: 'production',
    title: 'Üretim ölçeği bilinmiyor',
    description:
      'Alan büyüklüğü eksik olduğu için üretim kapasitesi sağlıklı değerlendirilemiyor.',
    reason: 'production.fieldSize anlamlı değil',
    matches: (farmer) => !isMeaningfulValue(farmer.production.fieldSize),
  },
  {
    id: 'missing-insurance',
    level: 'high',
    category: 'insurance',
    title: 'Sigorta koruması bulunmuyor',
    description:
      'Üretim faaliyetleri olası kayıplara karşı sigorta koruması dışında olabilir.',
    reason: 'insurance.status olumsuz veya belirsiz',
    matches: (farmer) => isInsuranceAtRisk(farmer.insurance.status),
  },
  {
    id: 'missing-irrigation',
    level: 'medium',
    category: 'data_quality',
    title: 'Sulama bilgisi eksik',
    description:
      'Üretim planlaması için sulama sistemi bilgisinin doğrulanması gerekiyor.',
    reason: 'production.irrigationSystem anlamlı değil',
    matches: (farmer) =>
      requiresIrrigationSystem(farmer) &&
      !isMeaningfulValue(farmer.production.irrigationSystem),
  },
  {
    id: 'missing-soil',
    level: 'medium',
    category: 'data_quality',
    title: 'Toprak verisi yetersiz',
    description:
      'Ürün ve girdi önerilerinin doğruluğu için toprak bilgisinin tamamlanması gerekiyor.',
    reason: 'production.soilType anlamlı değil',
    matches: (farmer) =>
      requiresSoilType(farmer) && !isMeaningfulValue(farmer.production.soilType),
  },
  {
    id: 'credit-need',
    level: 'medium',
    category: 'finance',
    title: 'Finansman ihtiyacı bulunuyor',
    description:
      'Çiftçinin kredi ihtiyacı finansal planlama ve uygun ürün eşleştirmesi gerektiriyor.',
    reason: 'finance.creditNeed olumlu',
    matches: (farmer) => hasCreditNeed(farmer.finance.creditNeed),
  },
  {
    id: 'financial-visibility',
    level: 'medium',
    category: 'finance',
    title: 'Finansal görünürlük düşük',
    description:
      'Gelir ve girdi bütçesi bilgilerindeki eksikler finansal segmentasyonu sınırlandırıyor.',
    reason: 'finance.incomeRange veya finance.inputBudget anlamlı değil',
    matches: (farmer) =>
      !isMeaningfulValue(farmer.finance.incomeRange) ||
      !isMeaningfulValue(farmer.finance.inputBudget),
  },
  {
    id: 'missing-sales-channel',
    level: 'low',
    category: 'production',
    title: 'Satış kanalı belirsiz',
    description:
      'Ticari eşleştirme için mevcut satış kanalının doğrulanması gerekiyor.',
    reason: 'production.salesChannel anlamlı değil',
    matches: (farmer) => !isMeaningfulValue(farmer.production.salesChannel),
  },
]

export function getActiveRisks(farmer: Farmer): FarmerRisk[] {
  const risks = RISK_RULES.filter((rule) => rule.matches(farmer)).map(
    ({ id, title, description, level, category, reason }) => ({
      id,
      title,
      description,
      level,
      category,
      reason,
    }),
  )

  return risks.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level])
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  high: 'Yüksek Risk',
  medium: 'Orta Risk',
  low: 'Düşük Risk',
}
