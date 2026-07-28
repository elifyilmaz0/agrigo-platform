import { getProductById } from '../../data/products.ts'
import { calculateActiveCampaignDays } from './calculateActiveCampaignDays.ts'
import type { CampaignDraft } from './campaignDraft.ts'
import type { CampaignRisk } from './campaignReadinessTypes.ts'
import {
  validateCreativeStep,
} from './campaignWizardValidation.ts'

export function analyzeCampaignRisks(draft: CampaignDraft): CampaignRisk[] {
  const risks: CampaignRisk[] = []
  const product = draft.productId ? getProductById(draft.productId) : undefined
  const audienceSize = draft.audience.estimatedSize
  const activeDays = calculateActiveCampaignDays(
    draft.schedule,
    draft.campaignType,
  )
  const creativeValidation = validateCreativeStep(draft)

  if (audienceSize != null && audienceSize < 1000) {
    risks.push({
      id: 'narrow-audience',
      severity: 'medium',
      title: 'Dar Hedef Kitle',
      description: `Hedef kitle ${audienceSize.toLocaleString('tr-TR')} çiftçi olarak hesaplandı. Kampanya erişimi sınırlı kalabilir.`,
      relatedStep: 'audience',
    })
  }

  const lowTotal =
    draft.budget.model === 'total' &&
    draft.budget.totalBudget != null &&
    draft.budget.totalBudget < 1000
  const lowDaily =
    draft.budget.model === 'daily' &&
    draft.budget.dailyBudget != null &&
    draft.budget.dailyBudget < 150

  if (lowTotal || lowDaily) {
    risks.push({
      id: 'low-budget',
      severity: 'medium',
      title: 'Çok Düşük Bütçe',
      description:
        'Seçilen bütçe, planlanan hedef kitle ve süreye göre sınırlı erişim üretebilir.',
      relatedStep: 'budget',
    })
  }

  if (activeDays != null && activeDays < 3) {
    risks.push({
      id: 'short-duration',
      severity: activeDays < 2 ? 'medium' : 'low',
      title: 'Kısa Kampanya Süresi',
      description:
        'Aktif gün sayısı az olduğu için kampanyanın görünürlük penceresi dar kalabilir.',
      relatedStep: 'schedule',
    })
  }

  if (draft.creative.offer.offerType === 'none') {
    risks.push({
      id: 'no-offer',
      severity: 'low',
      title: 'Kampanya Teklifi Yok',
      description:
        'Kampanyaya özel bir teklif tanımlanmadı. Bu bir hata değildir; ancak ilgiyi artırabilecek bir fırsat kaçırılmış olabilir.',
      relatedStep: 'creative',
    })
  }

  if (product?.stockStatus === 'out-of-stock') {
    risks.push({
      id: 'out-of-stock',
      severity: 'medium',
      title: 'Stokta Olmayan Ürün',
      description:
        'Seçilen ürün stokta görünmüyor. Kampanya talebi karşılama açısından dikkat gerektirebilir.',
      relatedStep: 'product',
    })
  }

  if (
    product &&
    (product.salesStatus === 'not-on-sale' ||
      product.salesStatus === 'out-of-stock')
  ) {
    risks.push({
      id: 'not-on-sale',
      severity: 'medium',
      title: 'Ürün Kampanya Sırasında Satışta Değil',
      description:
        'Ürünün satış durumu kampanya döneminde kullanıcıya sunumu zorlaştırabilir.',
      relatedStep: 'product',
    })
  }

  const ctaUrlMissing =
    Boolean(creativeValidation.errors['native-destinationUrl']) ||
    Boolean(creativeValidation.errors['bulk-destinationUrl'])

  if (ctaUrlMissing) {
    risks.push({
      id: 'cta-url-missing',
      severity: 'high',
      title: 'CTA URL Eksikliği',
      description:
        'Seçilen CTA için hedef URL zorunlu görünüyor ancak tamamlanmamış.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.campaignType === 'bulk' &&
    draft.audience.mode === 'rule-based' &&
    !draft.targetingRules.consentRequirements.marketingConsentRequired
  ) {
    risks.push({
      id: 'bulk-marketing-consent',
      severity: 'high',
      title: 'Bulk Pazarlama İzni',
      description:
        'Toplu mesaj kampanyalarında pazarlama izni gereksinimi kapalı görünüyor. Bu durum gönderim uygunluğunu zayıflatabilir.',
      relatedStep: 'targeting-rules',
    })
  }

  if (
    draft.campaignType === 'native' &&
    draft.schedule.endMode === 'no-end-date'
  ) {
    risks.push({
      id: 'native-no-end',
      severity: 'low',
      title: 'Bitiş Tarihi Olmayan Native Kampanya',
      description:
        'Manuel durdurma unutulursa kampanya beklenenden uzun süre aktif kalabilir.',
      relatedStep: 'schedule',
    })
  }

  return risks
}
