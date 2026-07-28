import type { TargetingRulesDraft } from './campaignDraft.ts'
import { COMPANY_IDS } from '../../data/tenant.ts'

export type AudienceSegmentCategory =
  | 'production'
  | 'irrigation'
  | 'livestock'
  | 'insurance'
  | 'finance'
  | 'digital'

export type AudienceSegment = {
  id: string
  companyId: string
  name: string
  description: string
  category: AudienceSegmentCategory
  estimatedSize: number
  criteriaCount: number
  updatedAt: string
  ruleSnapshot?: Partial<TargetingRulesDraft>
}

export const audienceSegmentCategoryLabels: Record<
  AudienceSegmentCategory,
  string
> = {
  production: 'Üretim',
  irrigation: 'Sulama',
  livestock: 'Hayvancılık',
  insurance: 'Sigorta',
  finance: 'Finans',
  digital: 'Dijital Davranış',
}

function segment(
  companyId: string,
  partial: Omit<AudienceSegment, 'companyId'>,
): AudienceSegment {
  return { companyId, ...partial }
}

export const wizardAudienceSegments: AudienceSegment[] = [
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-zeytin',
    name: 'Zeytin Üreticileri',
    description: 'Zeytin üretimi yapan kayıtlı çiftçiler.',
    category: 'production',
    estimatedSize: 12400,
    criteriaCount: 3,
    updatedAt: '2026-07-10',
    ruleSnapshot: {
      productionTypes: ['crop'],
      crops: ['zeytin'],
    },
  }),
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-sulama',
    name: 'Damla Sulama Kullanan Üreticiler',
    description: 'Damla sulama sistemi kullanan bitkisel üreticiler.',
    category: 'irrigation',
    estimatedSize: 18200,
    criteriaCount: 2,
    updatedAt: '2026-07-12',
    ruleSnapshot: {
      productionTypes: ['crop'],
      irrigationMethods: ['drip'],
    },
  }),
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-hayvancilik',
    name: 'Hayvancılık İşletmeleri',
    description: 'Büyükbaş ve küçükbaş odaklı hayvancılık işletmeleri.',
    category: 'livestock',
    estimatedSize: 9800,
    criteriaCount: 3,
    updatedAt: '2026-07-08',
    ruleSnapshot: {
      productionTypes: ['livestock'],
      livestockTypes: ['buyukbas', 'kucukbas'],
    },
  }),
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-aricilik',
    name: 'Arıcılık Faaliyeti Yürütenler',
    description: 'Bal üretimi ve arıcılık faaliyeti yürüten işletmeler.',
    category: 'livestock',
    estimatedSize: 4650,
    criteriaCount: 2,
    updatedAt: '2026-07-05',
    ruleSnapshot: {
      productionTypes: ['beekeeping'],
      crops: ['bal-uretimi'],
    },
  }),
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-sigorta',
    name: 'Sigortası Bulunmayan Üreticiler',
    description: 'Tarım sigortası bulunmayan veya süresi dolmuş üreticiler.',
    category: 'insurance',
    estimatedSize: 21300,
    criteriaCount: 1,
    updatedAt: '2026-07-15',
    ruleSnapshot: {
      insuranceStatuses: ['uninsured'],
    },
  }),
  segment(COMPANY_IDS.isleyen, {
    id: 'wiz-seg-dijital',
    name: 'Dijital Ödeme Kullanan Çiftçiler',
    description: 'Dijital ödeme yöntemlerini kullanan kayıtlı çiftçiler.',
    category: 'digital',
    estimatedSize: 16750,
    criteriaCount: 1,
    updatedAt: '2026-07-18',
    ruleSnapshot: {
      digitalPaymentUsage: ['uses'],
    },
  }),
  segment(COMPANY_IDS.bereket, {
    id: 'wiz-seg-bg-npk',
    name: 'NPK İhtiyacı Olan Tarla Üreticileri',
    description: 'Buğday ve mısır için dengeli gübre arayan üreticiler.',
    category: 'production',
    estimatedSize: 8600,
    criteriaCount: 2,
    updatedAt: '2026-07-11',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['bugday', 'misir'] },
  }),
  segment(COMPANY_IDS.bereket, {
    id: 'wiz-seg-bg-sera',
    name: 'Sera Besleme Segmenti',
    description: 'Sera üreticileri için mikro element ihtiyacı olan işletmeler.',
    category: 'production',
    estimatedSize: 4200,
    criteriaCount: 2,
    updatedAt: '2026-07-09',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['domates', 'biber'] },
  }),
  segment(COMPANY_IDS.agronova, {
    id: 'wiz-seg-an-hastalik',
    name: 'Hastalık Riski Yüksek Bahçeler',
    description: 'Mantar ve zararlı risk döneminde olan bahçe üreticileri.',
    category: 'production',
    estimatedSize: 7300,
    criteriaCount: 2,
    updatedAt: '2026-07-13',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['domates', 'uzum'] },
  }),
  segment(COMPANY_IDS.agronova, {
    id: 'wiz-seg-an-pamuk',
    name: 'Pamuk Zararlı Mücadelesi',
    description: 'Pamuk üretiminde zararlı mücadelesi planlayan işletmeler.',
    category: 'production',
    estimatedSize: 5100,
    criteriaCount: 2,
    updatedAt: '2026-07-16',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['pamuk'] },
  }),
  segment(COMPANY_IDS.verimli, {
    id: 'wiz-seg-vt-misir',
    name: 'Hibrit Mısır Planlayanlar',
    description: 'Sezon öncesi hibrit mısır tohumu arayan üreticiler.',
    category: 'production',
    estimatedSize: 6900,
    criteriaCount: 2,
    updatedAt: '2026-07-14',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['misir'] },
  }),
  segment(COMPANY_IDS.verimli, {
    id: 'wiz-seg-vt-domates',
    name: 'Domates Tohumu Segmenti',
    description: 'Sera ve açık alan domates tohumu arayan üreticiler.',
    category: 'production',
    estimatedSize: 5400,
    criteriaCount: 2,
    updatedAt: '2026-07-12',
    ruleSnapshot: { productionTypes: ['crop'], crops: ['domates'] },
  }),
  segment(COMPANY_IDS.anadolu, {
    id: 'wiz-seg-as-damla',
    name: 'Damla Sulama Yenileme Segmenti',
    description: 'Damla sulama sistemi yenileyecek bahçe üreticileri.',
    category: 'irrigation',
    estimatedSize: 7800,
    criteriaCount: 2,
    updatedAt: '2026-07-17',
    ruleSnapshot: {
      productionTypes: ['crop'],
      irrigationMethods: ['drip'],
    },
  }),
  segment(COMPANY_IDS.anadolu, {
    id: 'wiz-seg-as-sensor',
    name: 'Akıllı Sulama İlgilileri',
    description: 'Nem sensörü ve dijital sulama ile ilgilenen üreticiler.',
    category: 'digital',
    estimatedSize: 3900,
    criteriaCount: 2,
    updatedAt: '2026-07-19',
    ruleSnapshot: {
      productionTypes: ['crop'],
      digitalPaymentUsage: ['uses'],
    },
  }),
]

export function getAudienceSegmentsForCompany(
  companyId: string | null | undefined,
): AudienceSegment[] {
  if (!companyId) return []
  return wizardAudienceSegments.filter(
    (segment) => segment.companyId === companyId,
  )
}

export function getAudienceSegmentById(
  segmentId: string,
  companyId?: string | null,
): AudienceSegment | undefined {
  const segment = wizardAudienceSegments.find((item) => item.id === segmentId)
  if (!segment) return undefined
  if (companyId && segment.companyId !== companyId) return undefined
  return segment
}
