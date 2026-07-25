import type {
  CriticalMissingField,
} from './getCriticalMissingFields.ts'
import { getCriticalMissingFields } from './getCriticalMissingFields.ts'
import type {
  Farmer,
  MissingProfileCategory,
  MissingProfileItem,
  MissingProfileModule,
} from '../types/farmer.ts'

type EnrichmentTemplate = {
  module: MissingProfileModule
  explanation: string
  requiredFor: string
  permissionRequirement: string
  lastAskedStatus: string
  recommendedMethod: string
}

const CATEGORY_BY_PRIORITY: Record<
  CriticalMissingField['priority'],
  MissingProfileCategory
> = {
  critical: 'always_critical',
  important: 'conditional_critical',
}

const MODULE_BY_CATEGORY: Record<
  CriticalMissingField['category'],
  MissingProfileModule
> = {
  profile: 'Profil',
  production: 'Üretim',
  finance: 'Finans',
  insurance: 'Sigorta',
}

const ENRICHMENT_BY_KEY: Record<string, EnrichmentTemplate> = {
  phone: {
    module: 'Profil',
    explanation: 'İletişim ve operasyonel takip için birincil telefon bilgisi gereklidir.',
    requiredFor: 'İletişim yönetimi',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki aramada doğrula',
  },
  productionType: {
    module: 'Üretim',
    explanation: 'Üretim tipi; destek, sigorta ve ticari eşleştirme kararlarını yönlendirir.',
    requiredFor: 'Profil sınıflandırma',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada netleştir',
  },
  'production.product': {
    module: 'Üretim',
    explanation: 'Ana ürün bilgisi olmadan ticari ve üretim önerileri güvenilir üretilmez.',
    requiredFor: 'Ticari eşleştirme',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Kısmen paylaşıldı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'production.fieldSize': {
    module: 'Üretim',
    explanation: 'Ölçek doğrulanmadan kapasite ve girdi ihtiyacı doğru okunamaz.',
    requiredFor: 'Üretim planlama',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Saha ziyaretinde doğrula',
  },
  'production.irrigationSystem': {
    module: 'Üretim',
    explanation: 'Sulama sistemi; verim riski ve ekipman önerileri için kritik bir alandır.',
    requiredFor: 'Üretim risk değerlendirmesi',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'finance.creditNeed': {
    module: 'Finans',
    explanation: 'Kredi ihtiyacı bilinmeden finansman yönlendirmesi yapılamaz.',
    requiredFor: 'Finansal segmentasyon',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'insurance.status': {
    module: 'Sigorta',
    explanation: 'Sigorta durumu; risk ve yenileme takibi için öncelikli bir alandır.',
    requiredFor: 'Risk takibi',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Kısmen paylaşıldı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada netleştir',
  },
  location: {
    module: 'Profil',
    explanation: 'İlçe veya mahalle bilgisi saha planlaması ve yerel eşleştirme için gereklidir.',
    requiredFor: 'Saha planlama',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Profil güncellemesinde tamamla',
  },
  'production.soilType': {
    module: 'Arazi',
    explanation: 'Toprak tipi; girdi ve ürün önerilerinin doğruluğunu etkiler.',
    requiredFor: 'Üretim planlama',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Saha ziyaretinde doğrula',
  },
  'production.salesChannel': {
    module: 'Üretim',
    explanation: 'Satış kanalı; ticari eşleştirme fırsatlarını belirlemek için gereklidir.',
    requiredFor: 'Ticari eşleştirme',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Kısmen paylaşıldı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'finance.incomeRange': {
    module: 'Finans',
    explanation: 'Yalnızca finansal segmentasyon gerektiğinde kritik hale gelir.',
    requiredFor: 'Finansal segmentasyon',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'finance.inputBudget': {
    module: 'Finans',
    explanation: 'Girdi bütçesi; maliyet baskısı ve finansman ihtiyacını netleştirir.',
    requiredFor: 'Finansal segmentasyon',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'finance.creditAmount': {
    module: 'Finans',
    explanation: 'Kredi ihtiyacı varsa tutar bilgisi finansman yönlendirmesi için gerekir.',
    requiredFor: 'Finansman değerlendirme',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Kısmen paylaşıldı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada netleştir',
  },
  'finance.supportStatus': {
    module: 'Finans',
    explanation: 'Destek durumu; uygun program yönlendirmesini etkiler.',
    requiredFor: 'Destek eşleştirme',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'insurance.type': {
    module: 'Sigorta',
    explanation: 'Poliçe tipi bilinmeden uygun yenileme veya teklif üretilemez.',
    requiredFor: 'Sigorta eşleştirme',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
  'insurance.renewalInterest': {
    module: 'Sigorta',
    explanation: 'Yenileme ilgisi; takip önceliğini belirlemek için kullanılır.',
    requiredFor: 'Yenileme planlama',
    permissionRequirement: 'Gerekmez',
    lastAskedStatus: 'Sorulmadı',
    recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
  },
}

function buildEnrichment(
  field: CriticalMissingField,
): EnrichmentTemplate {
  return (
    ENRICHMENT_BY_KEY[field.key] ?? {
      module: MODULE_BY_CATEGORY[field.category],
      explanation: `${field.label} alanı operasyonel karar kalitesini etkileyebilir.`,
      requiredFor: 'Profil tamamlığı',
      permissionRequirement: 'Gerekmez',
      lastAskedStatus: 'Sorulmadı',
      recommendedMethod: 'Önerilen yöntem: Sonraki konuşmada sor',
    }
  )
}

export function getMissingProfileItems(farmer: Farmer): MissingProfileItem[] {
  const derived = getCriticalMissingFields(farmer).map((field) => {
    const enrichment = buildEnrichment(field)

    return {
      id: `${farmer.id}-${field.key}`,
      farmerId: farmer.id,
      category: CATEGORY_BY_PRIORITY[field.priority],
      fieldKey: field.key,
      title: field.label,
      module: enrichment.module,
      explanation: enrichment.explanation,
      requiredFor: enrichment.requiredFor,
      permissionRequirement: enrichment.permissionRequirement,
      lastAskedStatus: enrichment.lastAskedStatus,
      recommendedMethod: enrichment.recommendedMethod,
    } satisfies MissingProfileItem
  })

  const complementary = (farmer.complementaryGaps ?? []).map((item) => ({
    ...item,
    farmerId: farmer.id,
    category: 'complementary' as const,
  }))

  return [...derived, ...complementary]
}

export function countMissingProfileByCategory(items: MissingProfileItem[]) {
  return {
    alwaysCritical: items.filter((item) => item.category === 'always_critical').length,
    conditionalCritical: items.filter(
      (item) => item.category === 'conditional_critical',
    ).length,
    complementary: items.filter((item) => item.category === 'complementary').length,
    total: items.length,
  }
}

export function formatMissingProfileDescription(items: MissingProfileItem[]): string {
  if (items.length === 0) {
    return 'Profilde öncelikli olarak tamamlanması gereken alan bulunmuyor.'
  }

  const labels = items.slice(0, 3).map((item) => item.title)

  if (items.length <= 3) {
    return `${labels.join(', ')} eksik.`
  }

  return `${labels.join(', ')} ve ${items.length - 3} alan daha eksik.`
}

export function formatMissingProfilePriorityHint(
  alwaysCritical: number,
  conditionalCritical: number,
  total: number,
): string {
  if (total === 0) {
    return 'Profil bilgileri yeterli'
  }

  const parts: string[] = []

  if (alwaysCritical > 0) {
    parts.push(`${alwaysCritical} kritik`)
  }

  if (conditionalCritical > 0) {
    parts.push(`+${conditionalCritical} şartlı`)
  }

  if (parts.length > 0) {
    return parts.join(' ')
  }

  return 'Tamamlayıcı veri eksikleri'
}
