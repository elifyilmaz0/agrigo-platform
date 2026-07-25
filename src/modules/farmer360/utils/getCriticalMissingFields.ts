import type { Farmer } from '../types/farmer.ts'
import { isMeaningfulValue } from './calculateProfileCompleteness.ts'
import {
  requiresIrrigationSystem,
  requiresSoilType,
} from './productionFieldRelevance.ts'

export interface CriticalMissingField {
  key: string
  label: string
  category: 'profile' | 'production' | 'finance' | 'insurance'
  priority: 'critical' | 'important'
}

type FieldDefinition = {
  key: string
  label: string
  category: CriticalMissingField['category']
  priority: CriticalMissingField['priority']
  isComplete: (farmer: Farmer) => boolean
  appliesTo?: (farmer: Farmer) => boolean
}

function isDistrictOrVillageComplete(farmer: Farmer): boolean {
  return (
    isMeaningfulValue(farmer.district) || isMeaningfulValue(farmer.village)
  )
}

function isCreditNeedNegative(creditNeed: string): boolean {
  const normalized = creditNeed.trim().toLocaleLowerCase('tr-TR')

  return normalized === 'hayır' || normalized === 'yok' || normalized === 'ihtiyaç yok'
}

function isCreditAmountComplete(farmer: Farmer): boolean {
  if (isCreditNeedNegative(farmer.finance.creditNeed)) {
    return true
  }

  const need = farmer.finance.creditNeed.trim().toLocaleLowerCase('tr-TR')
  // Need itself is unclear — do not also demand an amount.
  if (need === 'belirsiz' || !isMeaningfulValue(farmer.finance.creditNeed)) {
    return true
  }

  return isMeaningfulValue(farmer.finance.creditAmount)
}

const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'phone',
    label: 'Telefon',
    category: 'profile',
    priority: 'critical',
    isComplete: (farmer) => isMeaningfulValue(farmer.phone),
  },
  {
    key: 'productionType',
    label: 'Üretim tipi',
    category: 'production',
    priority: 'critical',
    isComplete: (farmer) => isMeaningfulValue(farmer.productionType),
  },
  {
    key: 'production.product',
    label: 'Ürün',
    category: 'production',
    priority: 'critical',
    isComplete: (farmer) => isMeaningfulValue(farmer.production.product),
  },
  {
    key: 'production.fieldSize',
    label: 'Alan büyüklüğü',
    category: 'production',
    priority: 'critical',
    isComplete: (farmer) => isMeaningfulValue(farmer.production.fieldSize),
  },
  {
    key: 'production.irrigationSystem',
    label: 'Sulama sistemi',
    category: 'production',
    priority: 'critical',
    appliesTo: requiresIrrigationSystem,
    isComplete: (farmer) => isMeaningfulValue(farmer.production.irrigationSystem),
  },
  {
    key: 'finance.creditNeed',
    label: 'Kredi ihtiyacı',
    category: 'finance',
    priority: 'critical',
    isComplete: (farmer) => {
      const need = farmer.finance.creditNeed.trim().toLocaleLowerCase('tr-TR')
      if (need === 'belirsiz') {
        return false
      }
      return isMeaningfulValue(farmer.finance.creditNeed)
    },
  },
  {
    key: 'insurance.status',
    label: 'Sigorta durumu',
    category: 'insurance',
    priority: 'critical',
    isComplete: (farmer) => {
      if (!isMeaningfulValue(farmer.insurance.status)) {
        return false
      }
      const status = farmer.insurance.status.trim().toLocaleLowerCase('tr-TR')
      return status !== 'belirtilmedi' && !status.includes('belirsiz')
    },
  },
  {
    key: 'location',
    label: 'İlçe / Mahalle',
    category: 'profile',
    priority: 'important',
    isComplete: isDistrictOrVillageComplete,
  },
  {
    key: 'production.soilType',
    label: 'Toprak tipi',
    category: 'production',
    priority: 'important',
    appliesTo: requiresSoilType,
    isComplete: (farmer) => isMeaningfulValue(farmer.production.soilType),
  },
  {
    key: 'production.salesChannel',
    label: 'Satış kanalı',
    category: 'production',
    priority: 'important',
    isComplete: (farmer) => isMeaningfulValue(farmer.production.salesChannel),
  },
  {
    key: 'finance.incomeRange',
    label: 'Gelir aralığı',
    category: 'finance',
    priority: 'important',
    isComplete: (farmer) => isMeaningfulValue(farmer.finance.incomeRange),
  },
  {
    key: 'finance.inputBudget',
    label: 'Girdi bütçesi',
    category: 'finance',
    priority: 'important',
    isComplete: (farmer) => isMeaningfulValue(farmer.finance.inputBudget),
  },
  {
    key: 'finance.creditAmount',
    label: 'Kredi miktarı',
    category: 'finance',
    priority: 'important',
    isComplete: isCreditAmountComplete,
  },
  {
    key: 'finance.supportStatus',
    label: 'Destek durumu',
    category: 'finance',
    priority: 'important',
    isComplete: (farmer) => isMeaningfulValue(farmer.finance.supportStatus),
  },
  {
    key: 'insurance.type',
    label: 'Sigorta tipi',
    category: 'insurance',
    priority: 'important',
    appliesTo: (farmer) => {
      const status = farmer.insurance.status.trim().toLocaleLowerCase('tr-TR')
      return status === 'aktif' || status === 'pasif'
    },
    isComplete: (farmer) => isMeaningfulValue(farmer.insurance.type),
  },
  {
    key: 'insurance.renewalInterest',
    label: 'Yenileme ilgisi',
    category: 'insurance',
    priority: 'important',
    appliesTo: (farmer) => {
      const status = farmer.insurance.status.trim().toLocaleLowerCase('tr-TR')
      return (
        status === 'aktif' ||
        status === 'pasif' ||
        !isMeaningfulValue(farmer.insurance.status) ||
        status === 'belirtilmedi'
      )
    },
    isComplete: (farmer) => {
      if (!isMeaningfulValue(farmer.insurance.renewalInterest)) {
        return false
      }
      const interest = farmer.insurance.renewalInterest
        .trim()
        .toLocaleLowerCase('tr-TR')
      return interest !== 'belirtilmedi' && interest !== 'belirsiz'
    },
  },
]

export function getCriticalMissingFields(farmer: Farmer): CriticalMissingField[] {
  return FIELD_DEFINITIONS.filter(
    (field) => (field.appliesTo?.(farmer) ?? true) && !field.isComplete(farmer),
  ).map(({ key, label, category, priority }) => ({
    key,
    label,
    category,
    priority,
  }))
}

export function formatMissingFieldsDescription(
  missingFields: CriticalMissingField[],
): string {
  if (missingFields.length === 0) {
    return 'Profilde öncelikli olarak tamamlanması gereken alan bulunmuyor.'
  }

  const labels = missingFields.slice(0, 3).map((field) => field.label)

  if (missingFields.length <= 3) {
    return `${labels.join(', ')} eksik.`
  }

  const remainingCount = missingFields.length - 3

  return `${labels.join(', ')} ve ${remainingCount} alan daha eksik.`
}

export function getMissingFieldsPriorityHint(
  criticalCount: number,
  totalMissingCount: number,
): string {
  if (totalMissingCount === 0) {
    return 'Profil bilgileri yeterli'
  }

  if (criticalCount > 0) {
    return `${criticalCount} kritik alan`
  }

  return 'Önemli veri eksikleri'
}
