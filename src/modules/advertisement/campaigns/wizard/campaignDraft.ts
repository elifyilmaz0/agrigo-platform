import type { Campaign } from '../../types/advertisement.ts'
import { getProductById } from '../../data/products.ts'
import {
  buildRuleBasedSegmentName,
  hasMeaningfulTargetingRules,
} from './buildTargetingSummary.ts'
import { calculateEstimatedAudience } from './calculateEstimatedAudience.ts'
import type { CampaignObjectiveValue } from './campaignObjectives.ts'
import type { CampaignOfferType } from './campaignOfferTypes.ts'
import {
  mapDomainTypeToWizardType,
  type WizardCampaignType,
} from './campaignTypes.ts'
import {
  mapLegacyCtaText,
  type CreativeCallToAction,
} from './creativeCallToActions.ts'
import type { BidStrategyValue } from './bidStrategies.ts'
import type { BudgetModelValue } from './budgetModels.ts'
import {
  createAllDeliveryDays,
  type DeliveryDays,
} from './campaignDeliveryDays.ts'
import type {
  TargetingFarmScale,
  TargetingProductionType,
} from './targetingConfigs.ts'
import { getAudienceSegmentById } from './wizardAudienceSegments.ts'

export type ScheduleStartMode = 'now' | 'scheduled'
export type ScheduleEndMode = 'no-end-date' | 'scheduled'
export type DeliveryWindowMode = 'all-day' | 'custom'
export type BulkSendMode = 'single-send' | 'delivery-window'

export type ScheduleDraft = {
  startMode: ScheduleStartMode
  startDate: string
  startTime: string
  endMode: ScheduleEndMode
  endDate: string
  endTime: string
  timezone: string
  deliveryWindow: {
    mode: DeliveryWindowMode
    startTime: string
    endTime: string
  }
  deliveryDays: DeliveryDays
  bulkSendMode: BulkSendMode
}

export type BudgetDraft = {
  model: BudgetModelValue | null
  totalBudget: number | null
  dailyBudget: number | null
  currency: 'TRY'
  bidStrategy: BidStrategyValue
  manualBid: number | null
  spendLimit: number | null
  estimatedDailySpend: number | null
  estimatedReach: number | null
  estimatedImpressions: number | null
}

export type AudienceMode = 'saved-segment' | 'rule-based' | null

export type AudienceDraft = {
  mode: AudienceMode
  segmentId: string | null
  segmentName: string
  estimatedSize: number | null
  lastCalculatedAt: string | null
}

export type TargetingRulesDraft = {
  productionTypes: TargetingProductionType[]
  crops: string[]
  livestockTypes: string[]
  provinces: string[]
  allTurkey: boolean
  farmScales: TargetingFarmScale[]
  irrigationMethods: string[]
  insuranceStatuses: string[]
  digitalPaymentUsage: string[]
  creditNeed: string[]
  supportStatuses: string[]
  consentRequirements: {
    dataProcessingRequired: boolean
    marketingConsentRequired: boolean
  }
}

export type NativeCreativeDraft = {
  recommendationTitle: string
  recommendationText: string
  relevanceExplanation: string
  callToAction: CreativeCallToAction | null
  destinationUrl: string
  disclosureText: string
}

export type BulkCreativeDraft = {
  messageTitle: string
  messageBody: string
  callToAction: CreativeCallToAction | null
  destinationUrl: string
  senderName: string
  footerText: string
}

export type CampaignOfferDraft = {
  offerType: CampaignOfferType
  percentageValue: number | null
  campaignPrice: number | null
  discountAmount: number | null
  offerLabel: string
}

export type CampaignCreativeDraft = {
  native: NativeCreativeDraft
  bulk: BulkCreativeDraft
  offer: CampaignOfferDraft
}

export type CampaignDraft = {
  id?: string
  /** Tenant scope for this draft — must match selected company */
  companyId: string | null
  name: string
  objective: CampaignObjectiveValue | null
  description: string
  productId: string | null
  campaignType: WizardCampaignType | null
  creative: CampaignCreativeDraft
  audience: AudienceDraft
  targetingRules: TargetingRulesDraft
  schedule: ScheduleDraft
  budget: BudgetDraft
  status: 'draft'
}

export function createEmptyScheduleDraft(
  campaignType: WizardCampaignType | null = null,
): ScheduleDraft {
  return {
    startMode: 'scheduled',
    startDate: '',
    startTime: '09:00',
    endMode: campaignType === 'bulk' ? 'scheduled' : 'no-end-date',
    endDate: '',
    endTime: '20:00',
    timezone: 'Europe/Istanbul',
    deliveryWindow: {
      mode: 'all-day',
      startTime: '09:00',
      endTime: '20:00',
    },
    deliveryDays: createAllDeliveryDays(true),
    bulkSendMode: 'single-send',
  }
}

export function createEmptyBudgetDraft(): BudgetDraft {
  return {
    model: null,
    totalBudget: null,
    dailyBudget: null,
    currency: 'TRY',
    bidStrategy: 'automatic',
    manualBid: null,
    spendLimit: null,
    estimatedDailySpend: null,
    estimatedReach: null,
    estimatedImpressions: null,
  }
}

export const CAMPAIGN_NAME_MAX = 80
export const CAMPAIGN_NAME_MIN = 3
export const CAMPAIGN_DESCRIPTION_MAX = 300

export const NATIVE_TITLE_MAX = 70
export const NATIVE_TEXT_MAX = 240
export const NATIVE_TEXT_MIN = 20
export const NATIVE_RELEVANCE_MAX = 180
export const NATIVE_DISCLOSURE_MAX = 60
export const DEFAULT_NATIVE_DISCLOSURE = 'Sponsorlu ürün önerisi'

export const BULK_TITLE_MAX = 60
export const BULK_BODY_MAX = 500
export const BULK_BODY_MIN = 20
export const BULK_SENDER_MAX = 40
export const BULK_FOOTER_MAX = 120
export const OFFER_LABEL_MAX = 50

function resolveProductId(
  productId: string | null | undefined,
  companyId: string | null | undefined,
): string | null {
  if (!productId) return null
  const product = getProductById(productId)
  if (!product) return null
  if (companyId && product.companyId !== companyId) return null
  return productId
}

export function createEmptyAudienceDraft(): AudienceDraft {
  return {
    mode: null,
    segmentId: null,
    segmentName: '',
    estimatedSize: null,
    lastCalculatedAt: null,
  }
}

export function createEmptyTargetingRules(
  campaignType: WizardCampaignType | null = null,
): TargetingRulesDraft {
  return {
    productionTypes: [],
    crops: [],
    livestockTypes: [],
    provinces: [],
    allTurkey: false,
    farmScales: [],
    irrigationMethods: [],
    insuranceStatuses: [],
    digitalPaymentUsage: [],
    creditNeed: [],
    supportStatuses: [],
    consentRequirements: {
      dataProcessingRequired: true,
      marketingConsentRequired: campaignType === 'bulk',
    },
  }
}

export function syncAudienceFromRules(
  targetingRules: TargetingRulesDraft,
  current: AudienceDraft,
): AudienceDraft {
  if (current.mode !== 'rule-based') return current
  const estimatedSize = calculateEstimatedAudience(targetingRules)
  return {
    ...current,
    segmentId: null,
    segmentName: buildRuleBasedSegmentName(targetingRules),
    estimatedSize: hasMeaningfulTargetingRules(targetingRules)
      ? estimatedSize
      : null,
    lastCalculatedAt: hasMeaningfulTargetingRules(targetingRules)
      ? new Date().toISOString()
      : null,
  }
}

export function createEmptyNativeCreative(): NativeCreativeDraft {
  return {
    recommendationTitle: '',
    recommendationText: '',
    relevanceExplanation: '',
    callToAction: null,
    destinationUrl: '',
    disclosureText: DEFAULT_NATIVE_DISCLOSURE,
  }
}

export function createEmptyBulkCreative(
  senderName = '',
): BulkCreativeDraft {
  return {
    messageTitle: '',
    messageBody: '',
    callToAction: null,
    destinationUrl: '',
    senderName,
    footerText: '',
  }
}

export function createEmptyCampaignOffer(): CampaignOfferDraft {
  return {
    offerType: 'none',
    percentageValue: null,
    campaignPrice: null,
    discountAmount: null,
    offerLabel: '',
  }
}

export function createEmptyCreativeDraft(
  senderName = '',
): CampaignCreativeDraft {
  return {
    native: createEmptyNativeCreative(),
    bulk: createEmptyBulkCreative(senderName),
    offer: createEmptyCampaignOffer(),
  }
}

export function createEmptyCampaignDraft(
  preselectedProductId?: string | null,
  companyId: string | null = null,
): CampaignDraft {
  const productId = resolveProductId(preselectedProductId, companyId)
  const product = productId ? getProductById(productId) : undefined

  return {
    companyId,
    name: '',
    objective: null,
    description: '',
    productId,
    campaignType: null,
    creative: createEmptyCreativeDraft(product?.brand ?? ''),
    audience: createEmptyAudienceDraft(),
    targetingRules: createEmptyTargetingRules(null),
    schedule: createEmptyScheduleDraft(null),
    budget: createEmptyBudgetDraft(),
    status: 'draft',
  }
}

export function mapCampaignToDraft(campaign: Campaign): CampaignDraft {
  const product = getProductById(campaign.productId)
  const creative = campaign.creative
  const empty = createEmptyCreativeDraft(product?.brand ?? '')
  const wizardType = mapDomainTypeToWizardType(campaign.type)

  if (creative.kind === 'native') {
    empty.native = {
      recommendationTitle: creative.headline ?? '',
      recommendationText: creative.recommendationText ?? '',
      relevanceExplanation: creative.benefitText ?? '',
      callToAction: mapLegacyCtaText(creative.ctaText),
      destinationUrl: '',
      disclosureText: DEFAULT_NATIVE_DISCLOSURE,
    }
  }

  if (creative.kind === 'bulk') {
    empty.bulk = {
      messageTitle: creative.messageTitle ?? '',
      messageBody: creative.messageBody ?? '',
      callToAction: mapLegacyCtaText(creative.ctaText),
      destinationUrl: '',
      senderName: product?.brand ?? '',
      footerText: '',
    }
  }

  const legacySegment = campaign.segments[0]
  const knownSegment = legacySegment
    ? getAudienceSegmentById(legacySegment.id, campaign.companyId)
    : undefined
  const hasLegacySegment = Boolean(legacySegment)
  const hasLegacyRules = Boolean(
    campaign.targetRules?.naturalLanguageSummary?.trim(),
  )

  let audience: AudienceDraft = createEmptyAudienceDraft()
  if (hasLegacySegment) {
    audience = {
      mode: 'saved-segment',
      segmentId: legacySegment.id,
      segmentName: knownSegment?.name ?? legacySegment.name,
      estimatedSize:
        knownSegment?.estimatedSize ?? campaign.estimatedSegmentSize ?? null,
      lastCalculatedAt: knownSegment?.updatedAt ?? null,
    }
  } else if (hasLegacyRules) {
    audience = {
      mode: 'rule-based',
      segmentId: null,
      segmentName: 'Özel Hedef Kitle',
      estimatedSize: campaign.estimatedSegmentSize ?? null,
      lastCalculatedAt: null,
    }
  }

  return {
    id: campaign.id,
    companyId: campaign.companyId,
    name: campaign.name,
    objective: 'awareness',
    description: campaign.description ?? '',
    productId: resolveProductId(campaign.productId, campaign.companyId),
    campaignType: wizardType,
    creative: empty,
    audience,
    targetingRules: createEmptyTargetingRules(wizardType),
    schedule: {
      startMode: campaign.schedule.startDate ? 'scheduled' : 'now',
      startDate: campaign.schedule.startDate ?? '',
      startTime: '09:00',
      endMode: campaign.schedule.endDate
        ? 'scheduled'
        : wizardType === 'bulk'
          ? 'scheduled'
          : 'no-end-date',
      endDate: campaign.schedule.endDate ?? '',
      endTime: '20:00',
      timezone: 'Europe/Istanbul',
      deliveryWindow: {
        mode: 'all-day',
        startTime: '09:00',
        endTime: '20:00',
      },
      deliveryDays: createAllDeliveryDays(true),
      bulkSendMode:
        wizardType === 'bulk' ? 'single-send' : 'single-send',
    },
    budget: {
      model: campaign.budget != null ? 'total' : null,
      totalBudget: campaign.budget ?? null,
      dailyBudget: null,
      currency: 'TRY',
      bidStrategy: 'automatic',
      manualBid: null,
      spendLimit: null,
      estimatedDailySpend: null,
      estimatedReach: null,
      estimatedImpressions: null,
    },
    status: 'draft',
  }
}
