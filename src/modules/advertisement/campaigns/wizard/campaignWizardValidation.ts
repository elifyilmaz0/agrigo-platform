import { getProductById } from '../../data/products.ts'
import { MIN_DAILY_BUDGET, MIN_TOTAL_BUDGET } from './budgetModels.ts'
import { hasMeaningfulTargetingRules } from './buildTargetingSummary.ts'
import { getCatalogEffectivePrice } from './calculateCampaignOfferPrice.ts'
import { countSelectedDeliveryDays } from './campaignDeliveryDays.ts'
import {
  BULK_BODY_MAX,
  BULK_BODY_MIN,
  BULK_FOOTER_MAX,
  BULK_SENDER_MAX,
  BULK_TITLE_MAX,
  CAMPAIGN_DESCRIPTION_MAX,
  CAMPAIGN_NAME_MAX,
  CAMPAIGN_NAME_MIN,
  NATIVE_DISCLOSURE_MAX,
  NATIVE_RELEVANCE_MAX,
  NATIVE_TEXT_MAX,
  NATIVE_TEXT_MIN,
  NATIVE_TITLE_MAX,
  OFFER_LABEL_MAX,
  type CampaignDraft,
} from './campaignDraft.ts'
import { ctaRequiresUrl } from './creativeCallToActions.ts'
import type { CampaignWizardStepId } from './campaignWizardSteps.ts'
import {
  compareHHmm,
  getCurrentLocalDateTime,
  isDateBeforeToday,
  isPastDateTime,
  toDateTime,
} from './scheduleDateHelpers.ts'
import { getAudienceSegmentById } from './wizardAudienceSegments.ts'

export type StepValidationResult = {
  valid: boolean
  errors: Record<string, string>
  firstInvalidField?: string
}

const FIELD_ORDER = [
  'name',
  'objective',
  'campaignType',
  'description',
  'productId',
  'native-recommendationTitle',
  'native-recommendationText',
  'native-relevanceExplanation',
  'native-callToAction',
  'native-destinationUrl',
  'native-disclosureText',
  'bulk-messageTitle',
  'bulk-messageBody',
  'bulk-callToAction',
  'bulk-destinationUrl',
  'bulk-senderName',
  'bulk-footerText',
  'offer-percentageValue',
  'offer-campaignPrice',
  'offer-discountAmount',
  'offer-offerLabel',
  'audience-mode',
  'audience-segmentId',
  'audience-rules',
  'targeting-rules',
  'schedule-startMode',
  'schedule-startDate',
  'schedule-startTime',
  'schedule-endMode',
  'schedule-endDate',
  'schedule-endTime',
  'schedule-timezone',
  'schedule-deliveryWindow',
  'schedule-deliveryWindow-startTime',
  'schedule-deliveryWindow-endTime',
  'schedule-deliveryDays',
  'schedule-bulkSendMode',
  'budget-model',
  'budget-totalBudget',
  'budget-dailyBudget',
  'budget-spendLimit',
  'budget-bidStrategy',
  'budget-manualBid',
] as const

function firstInvalidField(
  errors: Record<string, string>,
): string | undefined {
  return FIELD_ORDER.find((field) => errors[field])
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function validateCampaignInfo(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}
  const trimmedName = draft.name.trim()

  if (!trimmedName) {
    errors.name = 'Kampanya adı zorunludur.'
  } else if (trimmedName.length < CAMPAIGN_NAME_MIN) {
    errors.name = `Kampanya adı en az ${CAMPAIGN_NAME_MIN} karakter olmalıdır.`
  } else if (draft.name.length > CAMPAIGN_NAME_MAX) {
    errors.name = `Kampanya adı en fazla ${CAMPAIGN_NAME_MAX} karakter olabilir.`
  }

  if (!draft.objective) {
    errors.objective = 'Kampanya amacı seçilmelidir.'
  }

  if (!draft.campaignType) {
    errors.campaignType = 'Kampanya türü seçilmelidir.'
  }

  if (draft.description.length > CAMPAIGN_DESCRIPTION_MAX) {
    errors.description = `Açıklama en fazla ${CAMPAIGN_DESCRIPTION_MAX} karakter olabilir.`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateProductStep(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}

  if (
    !draft.productId ||
    !getProductById(draft.productId) ||
    (draft.companyId != null &&
      getProductById(draft.productId)?.companyId !== draft.companyId)
  ) {
    errors.productId =
      'Devam etmek için kampanyada kullanılacak bir ürün seçin.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateCampaignOffer(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}
  const offer = draft.creative.offer
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const basePrice = getCatalogEffectivePrice(
    product?.listPrice,
    product?.discountedPrice,
  )

  if (offer.offerType === 'none') {
    return { valid: true, errors: {} }
  }

  if (offer.offerLabel.length > OFFER_LABEL_MAX) {
    errors['offer-offerLabel'] =
      `Teklif etiketi en fazla ${OFFER_LABEL_MAX} karakter olabilir.`
  }

  if (offer.offerType === 'percentage') {
    if (offer.percentageValue == null) {
      errors['offer-percentageValue'] = 'İndirim oranı zorunludur.'
    } else if (offer.percentageValue < 1 || offer.percentageValue > 100) {
      errors['offer-percentageValue'] =
        'İndirim oranı 1 ile 100 arasında olmalıdır.'
    }
  }

  if (offer.offerType === 'fixed-price') {
    if (offer.campaignPrice == null) {
      errors['offer-campaignPrice'] = 'Kampanya fiyatı zorunludur.'
    } else if (offer.campaignPrice < 0) {
      errors['offer-campaignPrice'] =
        'Kampanya fiyatı 0 veya daha büyük olmalıdır.'
    }
  }

  if (offer.offerType === 'fixed-discount') {
    if (offer.discountAmount == null) {
      errors['offer-discountAmount'] = 'İndirim tutarı zorunludur.'
    } else if (offer.discountAmount < 0) {
      errors['offer-discountAmount'] =
        'İndirim tutarı 0 veya daha büyük olmalıdır.'
    } else if (basePrice != null && offer.discountAmount > basePrice) {
      errors['offer-discountAmount'] =
        'İndirim tutarı katalogdaki geçerli fiyattan büyük olamaz.'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateNativeCreative(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}
  const native = draft.creative.native

  if (!native.recommendationTitle.trim()) {
    errors['native-recommendationTitle'] = 'Öneri başlığı zorunludur.'
  } else if (native.recommendationTitle.length > NATIVE_TITLE_MAX) {
    errors['native-recommendationTitle'] =
      `Öneri başlığı en fazla ${NATIVE_TITLE_MAX} karakter olabilir.`
  }

  const text = native.recommendationText.trim()
  if (!text) {
    errors['native-recommendationText'] = 'Öneri metni zorunludur.'
  } else if (text.length < NATIVE_TEXT_MIN) {
    errors['native-recommendationText'] =
      `Öneri metni en az ${NATIVE_TEXT_MIN} karakter olmalıdır.`
  } else if (native.recommendationText.length > NATIVE_TEXT_MAX) {
    errors['native-recommendationText'] =
      `Öneri metni en fazla ${NATIVE_TEXT_MAX} karakter olabilir.`
  }

  if (!native.relevanceExplanation.trim()) {
    errors['native-relevanceExplanation'] = 'İlgililik açıklaması zorunludur.'
  } else if (native.relevanceExplanation.length > NATIVE_RELEVANCE_MAX) {
    errors['native-relevanceExplanation'] =
      `İlgililik açıklaması en fazla ${NATIVE_RELEVANCE_MAX} karakter olabilir.`
  }

  if (!native.callToAction) {
    errors['native-callToAction'] = 'CTA seçilmelidir.'
  }

  if (!native.disclosureText.trim()) {
    errors['native-disclosureText'] = 'Sponsorlu içerik açıklaması zorunludur.'
  } else if (native.disclosureText.length > NATIVE_DISCLOSURE_MAX) {
    errors['native-disclosureText'] =
      `Açıklama en fazla ${NATIVE_DISCLOSURE_MAX} karakter olabilir.`
  }

  if (ctaRequiresUrl(native.callToAction)) {
    if (!native.destinationUrl.trim()) {
      errors['native-destinationUrl'] = 'Bu CTA için hedef URL zorunludur.'
    } else if (!isValidUrl(native.destinationUrl.trim())) {
      errors['native-destinationUrl'] =
        'Geçerli bir URL girin (http:// veya https://).'
    }
  } else if (
    native.destinationUrl.trim() &&
    !isValidUrl(native.destinationUrl.trim())
  ) {
    errors['native-destinationUrl'] =
      'Geçerli bir URL girin (http:// veya https://).'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateBulkCreative(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}
  const bulk = draft.creative.bulk

  if (!bulk.messageTitle.trim()) {
    errors['bulk-messageTitle'] = 'Mesaj başlığı zorunludur.'
  } else if (bulk.messageTitle.length > BULK_TITLE_MAX) {
    errors['bulk-messageTitle'] =
      `Mesaj başlığı en fazla ${BULK_TITLE_MAX} karakter olabilir.`
  }

  const body = bulk.messageBody.trim()
  if (!body) {
    errors['bulk-messageBody'] = 'Mesaj metni zorunludur.'
  } else if (body.length < BULK_BODY_MIN) {
    errors['bulk-messageBody'] =
      `Mesaj metni en az ${BULK_BODY_MIN} karakter olmalıdır.`
  } else if (bulk.messageBody.length > BULK_BODY_MAX) {
    errors['bulk-messageBody'] =
      `Mesaj metni en fazla ${BULK_BODY_MAX} karakter olabilir.`
  }

  if (!bulk.callToAction) {
    errors['bulk-callToAction'] = 'CTA seçilmelidir.'
  }

  if (!bulk.senderName.trim()) {
    errors['bulk-senderName'] = 'Gönderen adı zorunludur.'
  } else if (bulk.senderName.length > BULK_SENDER_MAX) {
    errors['bulk-senderName'] =
      `Gönderen adı en fazla ${BULK_SENDER_MAX} karakter olabilir.`
  }

  if (bulk.footerText.length > BULK_FOOTER_MAX) {
    errors['bulk-footerText'] =
      `Alt bilgi en fazla ${BULK_FOOTER_MAX} karakter olabilir.`
  }

  if (ctaRequiresUrl(bulk.callToAction)) {
    if (!bulk.destinationUrl.trim()) {
      errors['bulk-destinationUrl'] = 'Bu CTA için hedef URL zorunludur.'
    } else if (!isValidUrl(bulk.destinationUrl.trim())) {
      errors['bulk-destinationUrl'] =
        'Geçerli bir URL girin (http:// veya https://).'
    }
  } else if (
    bulk.destinationUrl.trim() &&
    !isValidUrl(bulk.destinationUrl.trim())
  ) {
    errors['bulk-destinationUrl'] =
      'Geçerli bir URL girin (http:// veya https://).'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateCreativeStep(
  draft: CampaignDraft,
): StepValidationResult {
  if (!draft.campaignType) {
    return {
      valid: false,
      errors: {
        campaignType: 'Kreatif için önce kampanya türü seçilmelidir.',
      },
      firstInvalidField: 'campaignType',
    }
  }

  const contentResult =
    draft.campaignType === 'native'
      ? validateNativeCreative(draft)
      : validateBulkCreative(draft)
  const offerResult = validateCampaignOffer(draft)
  const errors = { ...contentResult.errors, ...offerResult.errors }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateAudienceStep(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}

  if (!draft.audience.mode) {
    errors['audience-mode'] = 'Hedef kitle modu seçilmelidir.'
    return {
      valid: false,
      errors,
      firstInvalidField: firstInvalidField(errors),
    }
  }

  if (draft.audience.mode === 'saved-segment') {
    if (!draft.audience.segmentId) {
      errors['audience-segmentId'] = 'Devam etmek için bir segment seçin.'
    } else {
      const known = getAudienceSegmentById(
        draft.audience.segmentId,
        draft.companyId,
      )
      if (!known && !draft.audience.segmentName.trim()) {
        errors['audience-segmentId'] = 'Geçerli bir segment seçin.'
      }
    }
  }

  if (draft.audience.mode === 'rule-based') {
    if (!hasMeaningfulTargetingRules(draft.targetingRules)) {
      errors['audience-rules'] =
        'Kurallarla hedefleme için en az bir hedefleme kuralı seçin.'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateTargetingRulesStep(
  draft: CampaignDraft,
): StepValidationResult {
  const errors: Record<string, string> = {}

  if (!hasMeaningfulTargetingRules(draft.targetingRules)) {
    errors['targeting-rules'] =
      'Devam etmek için en az bir anlamlı hedefleme kuralı seçin.'
  }

  if (
    draft.targetingRules.allTurkey &&
    draft.targetingRules.provinces.length > 0
  ) {
    errors['targeting-rules'] =
      'Tüm Türkiye ile tekil iller aynı anda seçilemez.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateStep(
  stepId: CampaignWizardStepId,
  draft: CampaignDraft,
): StepValidationResult {
  if (stepId === 'campaign-info') return validateCampaignInfo(draft)
  if (stepId === 'product') return validateProductStep(draft)
  if (stepId === 'creative') return validateCreativeStep(draft)
  if (stepId === 'audience') return validateAudienceStep(draft)
  if (stepId === 'targeting-rules') return validateTargetingRulesStep(draft)
  if (stepId === 'schedule') return validateScheduleStep(draft)
  if (stepId === 'budget') return validateBudgetStep(draft)
  return { valid: true, errors: {} }
}

export function validateScheduleStep(
  draft: CampaignDraft,
  now: Date = getCurrentLocalDateTime(),
): StepValidationResult {
  const errors: Record<string, string> = {}
  const { schedule, campaignType } = draft
  const isBulk = campaignType === 'bulk'

  if (!schedule.timezone.trim()) {
    errors['schedule-timezone'] = 'Saat dilimi seçilmelidir.'
  }

  if (countSelectedDeliveryDays(schedule.deliveryDays) < 1) {
    errors['schedule-deliveryDays'] = 'En az bir aktif gün seçilmelidir.'
  }

  if (isBulk && schedule.endMode === 'no-end-date') {
    errors['schedule-endMode'] =
      'Toplu kampanyalar için bitiş tarihi belirlenmelidir.'
  }

  if (
    isBulk &&
    schedule.bulkSendMode === 'delivery-window' &&
    schedule.endMode !== 'scheduled'
  ) {
    errors['schedule-endMode'] =
      'Teslimat penceresine yay modelinde bitiş tarihi zorunludur.'
  }

  if (schedule.startMode === 'scheduled') {
    if (!schedule.startDate.trim()) {
      errors['schedule-startDate'] = 'Başlangıç tarihi zorunludur.'
    } else if (isDateBeforeToday(schedule.startDate, now)) {
      errors['schedule-startDate'] = 'Başlangıç tarihi geçmişte olamaz.'
    }
    if (!schedule.startTime.trim()) {
      errors['schedule-startTime'] = 'Başlangıç saati zorunludur.'
    } else if (
      schedule.startDate.trim() &&
      isPastDateTime(schedule.startDate, schedule.startTime, now)
    ) {
      errors['schedule-startTime'] = 'Başlangıç zamanı geçmişte olamaz.'
    }
  }

  if (schedule.endMode === 'scheduled') {
    if (!schedule.endDate.trim()) {
      errors['schedule-endDate'] = 'Bitiş tarihi zorunludur.'
    }
    if (!schedule.endTime.trim()) {
      errors['schedule-endTime'] = 'Bitiş saati zorunludur.'
    }

    if (
      schedule.endDate.trim() &&
      schedule.endTime.trim() &&
      !errors['schedule-endDate'] &&
      !errors['schedule-endTime']
    ) {
      const start =
        schedule.startMode === 'now'
          ? now
          : toDateTime(schedule.startDate, schedule.startTime || '00:00')
      const end = toDateTime(schedule.endDate, schedule.endTime)

      if (start && end) {
        if (end.getTime() <= start.getTime()) {
          errors['schedule-endDate'] =
            'Bitiş zamanı başlangıçtan sonra olmalıdır.'
        }
      } else if (!end) {
        errors['schedule-endDate'] = 'Geçerli bir bitiş zamanı girin.'
      }
    }
  }

  if (schedule.deliveryWindow.mode === 'custom') {
    if (!schedule.deliveryWindow.startTime.trim()) {
      errors['schedule-deliveryWindow-startTime'] =
        'Teslimat başlangıç saati zorunludur.'
    }
    if (!schedule.deliveryWindow.endTime.trim()) {
      errors['schedule-deliveryWindow-endTime'] =
        'Teslimat bitiş saati zorunludur.'
    }
    if (
      schedule.deliveryWindow.startTime.trim() &&
      schedule.deliveryWindow.endTime.trim()
    ) {
      const cmp = compareHHmm(
        schedule.deliveryWindow.startTime,
        schedule.deliveryWindow.endTime,
      )
      if (cmp === 0) {
        errors['schedule-deliveryWindow-endTime'] =
          'Teslimat başlangıç ve bitiş saati aynı olamaz.'
      } else if (cmp > 0) {
        errors['schedule-deliveryWindow-endTime'] =
          'Teslimat penceresi aynı gün içinde başlamalı ve bitmelidir.'
      }
    }
  }

  if (isBulk && !schedule.bulkSendMode) {
    errors['schedule-bulkSendMode'] = 'Gönderim modeli seçilmelidir.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export function validateBudgetStep(draft: CampaignDraft): StepValidationResult {
  const errors: Record<string, string> = {}
  const { budget } = draft

  if (!budget.model) {
    errors['budget-model'] = 'Bütçe modeli seçilmelidir.'
  }

  if (budget.currency !== 'TRY') {
    errors['budget-model'] = 'Para birimi TRY olmalıdır.'
  }

  if (!budget.bidStrategy) {
    errors['budget-bidStrategy'] = 'Harcama stratejisi seçilmelidir.'
  }

  if (budget.model === 'total') {
    if (budget.totalBudget == null) {
      errors['budget-totalBudget'] = 'Toplam kampanya bütçesi zorunludur.'
    } else if (budget.totalBudget <= 0) {
      errors['budget-totalBudget'] = 'Toplam bütçe 0’dan büyük olmalıdır.'
    } else if (budget.totalBudget < MIN_TOTAL_BUDGET) {
      errors['budget-totalBudget'] =
        `Toplam kampanya bütçesi en az ${MIN_TOTAL_BUDGET.toLocaleString('tr-TR')} ₺ olmalıdır.`
    }
  }

  if (budget.model === 'daily') {
    if (budget.dailyBudget == null) {
      errors['budget-dailyBudget'] = 'Günlük bütçe zorunludur.'
    } else if (budget.dailyBudget <= 0) {
      errors['budget-dailyBudget'] = 'Günlük bütçe 0’dan büyük olmalıdır.'
    } else if (budget.dailyBudget < MIN_DAILY_BUDGET) {
      errors['budget-dailyBudget'] =
        `Günlük bütçe en az ${MIN_DAILY_BUDGET.toLocaleString('tr-TR')} ₺ olmalıdır.`
    }
  }

  if (budget.spendLimit != null) {
    if (Number.isNaN(budget.spendLimit) || budget.spendLimit <= 0) {
      errors['budget-spendLimit'] =
        'Ek harcama limiti 0’dan büyük olmalıdır.'
    }
  }

  if (budget.bidStrategy === 'manual') {
    if (budget.manualBid == null) {
      errors['budget-manualBid'] = 'Maksimum birim teklif zorunludur.'
    } else if (budget.manualBid <= 0) {
      errors['budget-manualBid'] =
        'Maksimum birim teklif 0’dan büyük olmalıdır.'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidField: firstInvalidField(errors),
  }
}

export type LaunchCheckItem = {
  id: string
  label: string
  ready: boolean
  detail?: string
}

/** Prefer buildLaunchChecklist for richer status labels */
export function getLaunchChecklist(draft: CampaignDraft): LaunchCheckItem[] {
  const targetingReady =
    draft.audience.mode === 'saved-segment'
      ? true
      : draft.audience.mode === 'rule-based'
        ? validateTargetingRulesStep(draft).valid
        : false

  const consentReady =
    draft.audience.mode === 'saved-segment'
      ? true
      : draft.audience.mode === 'rule-based'
        ? draft.targetingRules.consentRequirements.dataProcessingRequired &&
          (draft.campaignType !== 'bulk' ||
            draft.targetingRules.consentRequirements.marketingConsentRequired)
        : false

  return [
    {
      id: 'info',
      label: 'Kampanya bilgileri',
      ready: validateCampaignInfo(draft).valid,
    },
    {
      id: 'product',
      label: 'Ürün seçimi',
      ready: validateProductStep(draft).valid,
    },
    {
      id: 'creative',
      label: 'Kreatif',
      ready: validateCreativeStep(draft).valid,
    },
    {
      id: 'audience',
      label: 'Hedef kitle',
      ready: validateAudienceStep(draft).valid,
    },
    {
      id: 'targeting',
      label: 'Hedef kuralları',
      ready: targetingReady,
      detail:
        draft.audience.mode === 'saved-segment'
          ? 'Hazır segment kullanılıyor'
          : undefined,
    },
    {
      id: 'schedule',
      label: 'Zamanlama',
      ready: validateScheduleStep(draft).valid,
    },
    {
      id: 'budget',
      label: 'Bütçe',
      ready: validateBudgetStep(draft).valid,
    },
    {
      id: 'consent',
      label: 'Gizlilik ve izin varsayımları',
      ready: consentReady,
    },
  ]
}

export function focusWizardField(fieldId: string | undefined) {
  if (!fieldId) return
  window.requestAnimationFrame(() => {
    const element = document.getElementById(`wiz-${fieldId}`)
    if (element instanceof HTMLElement) {
      element.focus()
    }
  })
}
