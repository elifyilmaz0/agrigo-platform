import type { TargetingRulesDraft } from './campaignDraft.ts'
import {
  getTargetingOptionLabel,
  targetingCropOptions,
  targetingFarmScaleOptions,
  targetingIrrigationOptions,
  targetingInsuranceOptions,
  targetingLivestockOptions,
  targetingProductionTypeOptions,
  targetingProvinceOptions,
  targetingCreditNeedOptions,
  targetingDigitalPaymentOptions,
  targetingSupportStatusOptions,
} from './targetingConfigs.ts'

function joinLabels(labels: string[], conjunction: 'veya' | 've'): string {
  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} ${conjunction} ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} ${conjunction} ${labels[labels.length - 1]}`
}

function mapLabels(
  values: string[],
  options: { value: string; label: string }[],
): string[] {
  return values.map((value) => getTargetingOptionLabel(options, value))
}

export function countMeaningfulTargetingGroups(
  rules: TargetingRulesDraft,
): number {
  let count = 0
  if (rules.productionTypes.length > 0) count += 1
  if (rules.crops.length > 0) count += 1
  if (rules.livestockTypes.length > 0) count += 1
  if (rules.allTurkey || rules.provinces.length > 0) count += 1
  if (rules.farmScales.length > 0) count += 1
  if (rules.irrigationMethods.length > 0) count += 1
  if (rules.insuranceStatuses.length > 0) count += 1
  if (rules.digitalPaymentUsage.length > 0) count += 1
  if (rules.creditNeed.length > 0) count += 1
  if (rules.supportStatuses.length > 0) count += 1
  return count
}

export function hasMeaningfulTargetingRules(
  rules: TargetingRulesDraft,
): boolean {
  return countMeaningfulTargetingGroups(rules) > 0
}

export function buildTargetingSummary(rules: TargetingRulesDraft): string {
  if (!hasMeaningfulTargetingRules(rules)) {
    return 'Henüz hedefleme kuralı seçilmedi.'
  }

  const parts: string[] = []

  if (rules.productionTypes.length > 0) {
    const labels = mapLabels(rules.productionTypes, targetingProductionTypeOptions)
    parts.push(`${joinLabels(labels, 'veya')} yapan`)
  }

  if (rules.crops.length > 0) {
    const labels = mapLabels(rules.crops, targetingCropOptions)
    parts.push(`${joinLabels(labels, 'veya')} üreten`)
  }

  if (rules.livestockTypes.length > 0) {
    const labels = mapLabels(rules.livestockTypes, targetingLivestockOptions)
    parts.push(`${joinLabels(labels, 'veya')} odaklı`)
  }

  if (rules.allTurkey) {
    parts.push('Türkiye genelinde bulunan')
  } else if (rules.provinces.length > 0) {
    const labels = mapLabels(rules.provinces, targetingProvinceOptions)
    parts.push(`${joinLabels(labels, 'veya')} bölgelerinde bulunan`)
  }

  if (rules.farmScales.length > 0) {
    const labels = mapLabels(rules.farmScales, targetingFarmScaleOptions)
    parts.push(`${joinLabels(labels, 'veya')} ölçekli`)
  }

  if (rules.irrigationMethods.length > 0) {
    const labels = mapLabels(rules.irrigationMethods, targetingIrrigationOptions)
    parts.push(`${joinLabels(labels, 'veya')} kullanan`)
  }

  if (rules.insuranceStatuses.length > 0) {
    const labels = mapLabels(rules.insuranceStatuses, targetingInsuranceOptions)
    parts.push(`sigorta durumu ${joinLabels(labels, 'veya')} olan`)
  }

  if (rules.digitalPaymentUsage.length > 0) {
    const labels = mapLabels(
      rules.digitalPaymentUsage,
      targetingDigitalPaymentOptions,
    )
    parts.push(`dijital ödeme kullanımı ${joinLabels(labels, 'veya')} olan`)
  }

  if (rules.creditNeed.length > 0) {
    const labels = mapLabels(rules.creditNeed, targetingCreditNeedOptions)
    parts.push(`kredi ihtiyacı ${joinLabels(labels, 'veya')} olan`)
  }

  if (rules.supportStatuses.length > 0) {
    const labels = mapLabels(rules.supportStatuses, targetingSupportStatusOptions)
    parts.push(`destek durumu ${joinLabels(labels, 'veya')} olan`)
  }

  const body = parts.join(', ')
  return `${body} çiftçiler.`
}

export function buildRuleBasedSegmentName(rules: TargetingRulesDraft): string {
  if (!hasMeaningfulTargetingRules(rules)) return 'Özel Hedef Kitle'

  const cropLabels = mapLabels(rules.crops, targetingCropOptions)
  const provinceLabels = rules.allTurkey
    ? ['Tüm Türkiye']
    : mapLabels(rules.provinces, targetingProvinceOptions)

  if (cropLabels.length > 0 && provinceLabels.length > 0) {
    return `${cropLabels[0]} · ${provinceLabels.slice(0, 2).join(' + ')}`
  }
  if (cropLabels.length > 0) return `${cropLabels[0]} · Özel Kitle`
  if (provinceLabels.length > 0) {
    return `${provinceLabels.slice(0, 2).join(' + ')} · Özel Kitle`
  }
  return 'Özel Hedef Kitle'
}

export function summarizeRuleCounts(rules: TargetingRulesDraft): string[] {
  const items: string[] = []
  if (rules.productionTypes.length > 0) {
    items.push(`${rules.productionTypes.length} üretim tipi`)
  }
  if (rules.crops.length > 0) {
    items.push(`${rules.crops.length} ilgili ürün`)
  }
  if (rules.livestockTypes.length > 0) {
    items.push(`${rules.livestockTypes.length} hayvancılık türü`)
  }
  if (rules.allTurkey) {
    items.push('Tüm Türkiye')
  } else if (rules.provinces.length > 0) {
    items.push(`${rules.provinces.length} il`)
  }
  if (rules.farmScales.length > 0) {
    const labels = mapLabels(rules.farmScales, targetingFarmScaleOptions)
    items.push(`${joinLabels(labels, 've')} ölçekli işletmeler`)
  }
  if (rules.irrigationMethods.length > 0) {
    items.push(`${rules.irrigationMethods.length} sulama yöntemi`)
  }
  if (rules.insuranceStatuses.length > 0) {
    items.push(`${rules.insuranceStatuses.length} sigorta durumu`)
  }
  if (rules.digitalPaymentUsage.length > 0) {
    items.push(`${rules.digitalPaymentUsage.length} dijital sinyal`)
  }
  return items
}
