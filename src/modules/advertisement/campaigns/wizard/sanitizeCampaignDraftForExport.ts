import { getProductById } from '../../data/products.ts'
import { calculateCampaignBudgetEstimates } from './calculateCampaignBudgetEstimates.ts'
import type { CampaignDraft } from './campaignDraft.ts'
import { formatSelectedDeliveryDays } from './campaignDeliveryDays.ts'
import { getCampaignObjectiveLabel } from './campaignObjectives.ts'
import { getCampaignOfferTypeLabel } from './campaignOfferTypes.ts'
import { getCampaignTypeLabel } from './campaignTypes.ts'
import { getCreativeCallToActionLabel } from './creativeCallToActions.ts'
import { getTimezoneLabel } from './timezoneOptions.ts'
import { getAudienceSegmentById } from './wizardAudienceSegments.ts'

/**
 * Sanitized business snapshot for JSON preview / export placeholder.
 * Excludes UI state, dirty flags, and validation errors.
 */
export function sanitizeCampaignDraftForExport(draft: CampaignDraft): object {
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const segment = draft.audience.segmentId
    ? getAudienceSegmentById(draft.audience.segmentId, draft.companyId)
    : undefined
  const estimates = calculateCampaignBudgetEstimates({
    budget: draft.budget,
    schedule: draft.schedule,
    audienceEstimatedSize: draft.audience.estimatedSize,
    campaignType: draft.campaignType,
  })

  return {
    campaign: {
      id: draft.id ?? null,
      name: draft.name,
      objective: draft.objective,
      objectiveLabel: getCampaignObjectiveLabel(draft.objective),
      campaignType: draft.campaignType,
      campaignTypeLabel: getCampaignTypeLabel(draft.campaignType),
      description: draft.description,
      status: draft.status,
    },
    product: product
      ? {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          listPrice: product.listPrice,
          discountedPrice: product.discountedPrice ?? null,
          salesStatus: product.salesStatus,
          stockStatus: product.stockStatus,
        }
      : null,
    creative: {
      native:
        draft.campaignType === 'native'
          ? {
              recommendationTitle: draft.creative.native.recommendationTitle,
              recommendationText: draft.creative.native.recommendationText,
              relevanceExplanation: draft.creative.native.relevanceExplanation,
              callToAction: draft.creative.native.callToAction,
              callToActionLabel: getCreativeCallToActionLabel(
                draft.creative.native.callToAction,
              ),
              destinationUrl: draft.creative.native.destinationUrl,
              disclosureText: draft.creative.native.disclosureText,
            }
          : null,
      bulk:
        draft.campaignType === 'bulk'
          ? {
              messageTitle: draft.creative.bulk.messageTitle,
              messageBody: draft.creative.bulk.messageBody,
              callToAction: draft.creative.bulk.callToAction,
              callToActionLabel: getCreativeCallToActionLabel(
                draft.creative.bulk.callToAction,
              ),
              destinationUrl: draft.creative.bulk.destinationUrl,
              senderName: draft.creative.bulk.senderName,
              footerText: draft.creative.bulk.footerText,
            }
          : null,
      offer: {
        offerType: draft.creative.offer.offerType,
        offerTypeLabel: getCampaignOfferTypeLabel(draft.creative.offer.offerType),
        percentageValue: draft.creative.offer.percentageValue,
        campaignPrice: draft.creative.offer.campaignPrice,
        discountAmount: draft.creative.offer.discountAmount,
        offerLabel: draft.creative.offer.offerLabel,
      },
    },
    audience: {
      mode: draft.audience.mode,
      segmentId: draft.audience.segmentId,
      segmentName:
        segment?.name ?? draft.audience.segmentName ?? null,
      estimatedSize: draft.audience.estimatedSize,
    },
    targetingRules: {
      productionTypes: draft.targetingRules.productionTypes,
      crops: draft.targetingRules.crops,
      livestockTypes: draft.targetingRules.livestockTypes,
      provinces: draft.targetingRules.provinces,
      allTurkey: draft.targetingRules.allTurkey,
      farmScales: draft.targetingRules.farmScales,
      irrigationMethods: draft.targetingRules.irrigationMethods,
      insuranceStatuses: draft.targetingRules.insuranceStatuses,
      digitalPaymentUsage: draft.targetingRules.digitalPaymentUsage,
      creditNeed: draft.targetingRules.creditNeed,
      supportStatuses: draft.targetingRules.supportStatuses,
      consentRequirements: draft.targetingRules.consentRequirements,
    },
    schedule: {
      startMode: draft.schedule.startMode,
      startDate: draft.schedule.startDate,
      startTime: draft.schedule.startTime,
      endMode: draft.schedule.endMode,
      endDate: draft.schedule.endDate,
      endTime: draft.schedule.endTime,
      timezone: draft.schedule.timezone,
      timezoneLabel: getTimezoneLabel(draft.schedule.timezone),
      deliveryWindow: draft.schedule.deliveryWindow,
      deliveryDays: draft.schedule.deliveryDays,
      deliveryDaysSummary: formatSelectedDeliveryDays(draft.schedule.deliveryDays),
      bulkSendMode: draft.schedule.bulkSendMode,
    },
    budget: {
      model: draft.budget.model,
      totalBudget: draft.budget.totalBudget,
      dailyBudget: draft.budget.dailyBudget,
      currency: draft.budget.currency,
      bidStrategy: draft.budget.bidStrategy,
      manualBid: draft.budget.manualBid,
      spendLimit: draft.budget.spendLimit,
      estimates: {
        estimatedDailySpend: estimates.estimatedDailySpend,
        estimatedTotalSpend: estimates.estimatedTotalSpend,
        estimatedReach: estimates.estimatedReach,
        estimatedImpressions: estimates.estimatedImpressions,
        activeDays: estimates.activeDays,
      },
    },
  }
}
