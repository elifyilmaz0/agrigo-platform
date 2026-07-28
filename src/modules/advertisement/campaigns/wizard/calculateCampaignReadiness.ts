import { getProductById } from '../../data/products.ts'
import { calculateActiveCampaignDays } from './calculateActiveCampaignDays.ts'
import type { CampaignDraft } from './campaignDraft.ts'
import {
  type CampaignReadinessResult,
  type ReadinessCheck,
} from './campaignReadinessTypes.ts'
import {
  validateAudienceStep,
  validateBudgetStep,
  validateCampaignInfo,
  validateCreativeStep,
  validateProductStep,
  validateScheduleStep,
  validateTargetingRulesStep,
} from './campaignWizardValidation.ts'

const WEIGHTS = {
  info: 10,
  product: 10,
  creative: 20,
  audience: 15,
  targeting: 10,
  schedule: 15,
  budget: 15,
  consent: 5,
} as const

export function calculateCampaignReadiness(
  draft: CampaignDraft,
): CampaignReadinessResult {
  const infoOk = validateCampaignInfo(draft).valid
  const productOk = validateProductStep(draft).valid
  const creativeOk = validateCreativeStep(draft).valid
  const audienceOk = validateAudienceStep(draft).valid
  const scheduleOk = validateScheduleStep(draft).valid
  const budgetOk = validateBudgetStep(draft).valid

  const savedSegment = draft.audience.mode === 'saved-segment'
  const targetingOk = savedSegment
    ? audienceOk
    : draft.audience.mode === 'rule-based'
      ? validateTargetingRulesStep(draft).valid
      : false

  const consentOk = evaluateConsentAssumptions(draft)

  const requiredChecks: ReadinessCheck[] = [
    {
      id: 'info',
      kind: 'required',
      label: 'Kampanya bilgileri tamamlandı',
      passed: infoOk,
      relatedStep: 'campaign-info',
      weight: WEIGHTS.info,
    },
    {
      id: 'product',
      kind: 'required',
      label: 'Ürün seçildi',
      passed: productOk,
      relatedStep: 'product',
      weight: WEIGHTS.product,
    },
    {
      id: 'creative',
      kind: 'required',
      label: 'Kreatif doğrulandı',
      passed: creativeOk,
      relatedStep: 'creative',
      weight: WEIGHTS.creative,
    },
    {
      id: 'audience',
      kind: 'required',
      label: 'Hedef kitle tanımlandı',
      passed: audienceOk,
      relatedStep: 'audience',
      weight: WEIGHTS.audience,
    },
    {
      id: 'targeting',
      kind: 'required',
      label: savedSegment
        ? 'Hedef kuralları (hazır segment)'
        : 'Hedef kuralları doğrulandı',
      passed: targetingOk,
      detail: savedSegment ? 'Hazır segment kullanılıyor' : undefined,
      relatedStep: savedSegment ? 'audience' : 'targeting-rules',
      weight: WEIGHTS.targeting,
    },
    {
      id: 'schedule',
      kind: 'required',
      label: 'Zamanlama geçerli',
      passed: scheduleOk,
      relatedStep: 'schedule',
      weight: WEIGHTS.schedule,
    },
    {
      id: 'budget',
      kind: 'required',
      label: 'Bütçe geçerli',
      passed: budgetOk,
      relatedStep: 'budget',
      weight: WEIGHTS.budget,
    },
    {
      id: 'consent',
      kind: 'required',
      label: 'Consent varsayımları kontrol edildi',
      passed: consentOk.passed,
      detail: consentOk.detail,
      relatedStep: savedSegment ? 'audience' : 'targeting-rules',
      weight: WEIGHTS.consent,
    },
  ]

  let score = 0
  for (const check of requiredChecks) {
    if (check.passed && check.weight) score += check.weight
  }

  const advisoryChecks = buildAdvisoryChecks(draft)
  let advisoryPenalty = 0
  for (const check of advisoryChecks) {
    if (!check.passed) advisoryPenalty += check.weight ?? 0
  }

  score = Math.max(0, Math.min(100, score - advisoryPenalty))

  const allRequiredPassed = requiredChecks.every((check) => check.passed)
  const hasBlockingAdvisory = advisoryChecks.some(
    (check) => !check.passed && (check.weight ?? 0) >= 3,
  )

  let status: CampaignReadinessResult['status']
  if (!allRequiredPassed) {
    status = 'incomplete'
  } else if (score < 85 || hasBlockingAdvisory) {
    status = 'needs-review'
  } else {
    status = 'ready'
  }

  return {
    score,
    status,
    requiredChecks,
    advisoryChecks,
  }
}

function evaluateConsentAssumptions(draft: CampaignDraft): {
  passed: boolean
  detail?: string
} {
  if (draft.audience.mode === 'saved-segment') {
    return {
      passed: true,
      detail: 'Hazır segment gizlilik varsayımları uygulanır',
    }
  }

  if (draft.audience.mode !== 'rule-based') {
    return { passed: false, detail: 'Hedef kitle modu seçilmedi' }
  }

  const consent = draft.targetingRules.consentRequirements
  if (!consent.dataProcessingRequired) {
    return {
      passed: false,
      detail: 'Veri işleme varsayımı aktif olmalıdır',
    }
  }

  if (
    draft.campaignType === 'bulk' &&
    !consent.marketingConsentRequired
  ) {
    return {
      passed: false,
      detail: 'Toplu kampanyada pazarlama izni gereksinimi zorunludur',
    }
  }

  return {
    passed: true,
    detail:
      draft.campaignType === 'bulk'
        ? 'Pazarlama izni gereksinimi aktif'
        : 'İzin modeli inceleme notu uygulandı',
  }
}

function buildAdvisoryChecks(draft: CampaignDraft): ReadinessCheck[] {
  const checks: ReadinessCheck[] = []
  const activeDays = calculateActiveCampaignDays(
    draft.schedule,
    draft.campaignType,
  )
  const product = draft.productId ? getProductById(draft.productId) : undefined

  const lowBudget =
    (draft.budget.model === 'total' &&
      draft.budget.totalBudget != null &&
      draft.budget.totalBudget < 1000) ||
    (draft.budget.model === 'daily' &&
      draft.budget.dailyBudget != null &&
      draft.budget.dailyBudget < 150)

  const nearMinBudget =
    (draft.budget.model === 'total' &&
      draft.budget.totalBudget != null &&
      draft.budget.totalBudget >= 500 &&
      draft.budget.totalBudget < 750) ||
    (draft.budget.model === 'daily' &&
      draft.budget.dailyBudget != null &&
      draft.budget.dailyBudget >= 100 &&
      draft.budget.dailyBudget < 120)

  checks.push({
    id: 'adv-budget-low',
    kind: 'advisory',
    label: 'Bütçe seviyesi uygun',
    passed: !lowBudget && !nearMinBudget,
    detail: lowBudget
      ? 'Bütçe hedef kitle ve süreye göre düşük görünebilir'
      : nearMinBudget
        ? 'Bütçe minimum seviyeye yakın'
        : undefined,
    relatedStep: 'budget',
    weight: lowBudget ? 4 : nearMinBudget ? 2 : 0,
  })

  const audienceSize = draft.audience.estimatedSize
  checks.push({
    id: 'adv-audience-narrow',
    kind: 'advisory',
    label: 'Hedef kitle genişliği',
    passed: audienceSize == null || audienceSize >= 1000,
    detail:
      audienceSize != null && audienceSize < 1000
        ? 'Hedef kitle oldukça dar'
        : undefined,
    relatedStep: 'audience',
    weight: audienceSize != null && audienceSize < 1000 ? 4 : 0,
  })

  checks.push({
    id: 'adv-offer',
    kind: 'advisory',
    label: 'Kampanya teklifi',
    passed: draft.creative.offer.offerType !== 'none',
    detail:
      draft.creative.offer.offerType === 'none'
        ? 'Kampanya teklifi tanımlanmadı'
        : undefined,
    relatedStep: 'creative',
    weight: draft.creative.offer.offerType === 'none' ? 2 : 0,
  })

  checks.push({
    id: 'adv-duration',
    kind: 'advisory',
    label: 'Kampanya süresi',
    passed: activeDays == null || activeDays >= 3,
    detail:
      activeDays != null && activeDays < 3
        ? 'Kampanya süresi kısa görünüyor'
        : undefined,
    relatedStep: 'schedule',
    weight: activeDays != null && activeDays < 3 ? 3 : 0,
  })

  const destinationUrl =
    draft.campaignType === 'native'
      ? draft.creative.native.destinationUrl.trim()
      : draft.campaignType === 'bulk'
        ? draft.creative.bulk.destinationUrl.trim()
        : ''
  const salesUrl = product?.salesUrl?.trim() ?? ''
  const urlMismatch =
    Boolean(destinationUrl) &&
    Boolean(salesUrl) &&
    destinationUrl !== salesUrl

  checks.push({
    id: 'adv-cta-url',
    kind: 'advisory',
    label: 'CTA hedef URL uyumu',
    passed: !urlMismatch,
    detail: urlMismatch
      ? 'CTA hedef URL’si ürün satış URL’sinden farklı'
      : undefined,
    relatedStep: 'creative',
    weight: urlMismatch ? 2 : 0,
  })

  return checks
}
