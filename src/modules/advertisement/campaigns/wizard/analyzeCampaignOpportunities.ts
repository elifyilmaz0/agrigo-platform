import { getProductById } from '../../data/products.ts'
import { calculateActiveCampaignDays } from './calculateActiveCampaignDays.ts'
import type { CampaignDraft } from './campaignDraft.ts'
import type { CampaignOpportunity } from './campaignReadinessTypes.ts'
import {
  getTargetingOptionLabel,
  targetingCropOptions,
  targetingLivestockOptions,
  targetingProductionTypeOptions,
} from './targetingConfigs.ts'

export function analyzeCampaignOpportunities(
  draft: CampaignDraft,
): CampaignOpportunity[] {
  const opportunities: CampaignOpportunity[] = []
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const activeDays = calculateActiveCampaignDays(
    draft.schedule,
    draft.campaignType,
  )

  if (product && hasProductTargetingAlignment(draft, product)) {
    opportunities.push({
      id: 'product-targeting-fit',
      title: 'Ürün ve Hedefleme Uyumu',
      description:
        'Seçilen ürün ile hedefleme kriterleri arasında güçlü uyum bulunuyor.',
      relatedStep: 'targeting-rules',
    })
  }

  if (draft.creative.offer.offerType !== 'none') {
    opportunities.push({
      id: 'has-offer',
      title: 'Kampanya Teklifi Var',
      description:
        'Kampanyaya özel teklif kullanıcı ilgisini artırabilir.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.audience.estimatedSize != null &&
    draft.audience.estimatedSize > 10000
  ) {
    opportunities.push({
      id: 'wide-audience',
      title: 'Geniş Hedef Kitle',
      description:
        'Kampanya geniş bir anonim hedef kitleye ulaşma potansiyeline sahip.',
      relatedStep: 'audience',
    })
  }

  if (
    draft.campaignType === 'native' &&
    draft.creative.native.relevanceExplanation.trim().length > 0
  ) {
    opportunities.push({
      id: 'native-relevance',
      title: 'Native İhtiyaç Anı Uyumu',
      description:
        'Native kreatif, ürünün hangi ihtiyaç anında önerileceğini açıklıyor.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.campaignType === 'bulk' &&
    draft.creative.bulk.callToAction != null
  ) {
    opportunities.push({
      id: 'bulk-cta',
      title: 'Bulk Açık CTA',
      description:
        'Toplu mesaj kullanıcıya net bir sonraki adım sunuyor.',
      relatedStep: 'creative',
    })
  }

  if (activeDays != null && activeDays >= 7 && activeDays <= 30) {
    opportunities.push({
      id: 'balanced-duration',
      title: 'Uygun Kampanya Süresi',
      description:
        'Kampanya süresi erişim ve kontrol açısından dengeli görünüyor.',
      relatedStep: 'schedule',
    })
  }

  return opportunities
}

function hasProductTargetingAlignment(
  draft: CampaignDraft,
  product: {
    name: string
    category: string
    relevantProducts?: string
    productionType?: string
    livestockArea?: string
  },
): boolean {
  const haystack = normalize(
    [
      product.name,
      product.category,
      product.relevantProducts ?? '',
      product.productionType ?? '',
      product.livestockArea ?? '',
    ].join(' '),
  )

  const cropLabels = draft.targetingRules.crops.map((value) =>
    getTargetingOptionLabel(targetingCropOptions, value),
  )
  const livestockLabels = draft.targetingRules.livestockTypes.map((value) =>
    getTargetingOptionLabel(targetingLivestockOptions, value),
  )
  const productionLabels = draft.targetingRules.productionTypes.map((value) =>
    getTargetingOptionLabel(targetingProductionTypeOptions, value),
  )

  const needles = [...cropLabels, ...livestockLabels, ...productionLabels]
    .map(normalize)
    .filter(Boolean)

  if (needles.length === 0) return false
  return needles.some((needle) => haystack.includes(needle))
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}
