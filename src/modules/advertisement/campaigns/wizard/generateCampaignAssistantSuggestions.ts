import type { CampaignDraft } from './campaignDraft.ts'
import type { CampaignAssistantSuggestion } from './campaignReadinessTypes.ts'

export function generateCampaignAssistantSuggestions(
  draft: CampaignDraft,
): CampaignAssistantSuggestion[] {
  const suggestions: CampaignAssistantSuggestion[] = []
  const offer = draft.creative.offer
  const audienceSize = draft.audience.estimatedSize

  if (offer.offerType !== 'none' && !offer.offerLabel.trim()) {
    suggestions.push({
      id: 'offer-label',
      priority: 'medium',
      title: 'Teklif etiketi ekleyin',
      description:
        'Kampanya teklifini daha anlaşılır göstermek için kısa bir teklif etiketi ekleyin.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.campaignType === 'native' &&
    draft.creative.native.callToAction === 'visit-website'
  ) {
    suggestions.push({
      id: 'cta-product',
      priority: 'low',
      title: 'CTA önerisi',
      description:
        'Ürün odaklı Native kampanyalarda “Ürünü İncele” CTA’sı daha doğrudan bir deneyim sağlayabilir.',
      relatedStep: 'creative',
    })
  }

  if (audienceSize != null && audienceSize < 1000) {
    suggestions.push({
      id: 'expand-audience',
      priority: 'high',
      title: 'Hedef kitleyi genişletin',
      description:
        'İl veya ürün filtrelerinden bazılarını genişleterek hedef kitleyi büyütebilirsiniz.',
      relatedStep: 'audience',
    })
  }

  if (
    audienceSize != null &&
    audienceSize > 30000 &&
    draft.audience.mode === 'rule-based'
  ) {
    suggestions.push({
      id: 'narrow-audience',
      priority: 'medium',
      title: 'Hedef kitleyi netleştirin',
      description:
        'Ürün uygunluğunu artırmak için ek üretim veya konum kriterleri kullanabilirsiniz.',
      relatedStep: 'targeting-rules',
    })
  }

  const lowBudget =
    (draft.budget.model === 'total' &&
      draft.budget.totalBudget != null &&
      draft.budget.totalBudget < 1000) ||
    (draft.budget.model === 'daily' &&
      draft.budget.dailyBudget != null &&
      draft.budget.dailyBudget < 150)

  if (lowBudget) {
    suggestions.push({
      id: 'budget-review',
      priority: 'medium',
      title: 'Bütçeyi yeniden değerlendirin',
      description:
        'Kampanya süresi ve hedef kitle büyüklüğüne göre bütçeyi yeniden değerlendirin.',
      relatedStep: 'budget',
    })
  }

  if (
    draft.campaignType === 'native' &&
    draft.creative.native.relevanceExplanation.trim().length > 0 &&
    draft.creative.native.relevanceExplanation.trim().length < 60
  ) {
    suggestions.push({
      id: 'relevance-short',
      priority: 'low',
      title: 'İhtiyaç anı açıklamasını genişletin',
      description:
        'Önerinin hangi çiftçi ihtiyacında gösterileceğini daha ayrıntılı açıklayabilirsiniz.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.campaignType === 'bulk' &&
    !draft.creative.bulk.footerText.trim()
  ) {
    suggestions.push({
      id: 'bulk-footer',
      priority: 'low',
      title: 'Alt bilgi ekleyin',
      description:
        'Kampanya koşulları veya geçerlilik tarihi için alt bilgi ekleyebilirsiniz.',
      relatedStep: 'creative',
    })
  }

  if (
    draft.campaignType === 'native' &&
    draft.schedule.endMode === 'no-end-date'
  ) {
    suggestions.push({
      id: 'add-end-date',
      priority: 'low',
      title: 'Bitiş tarihi belirlemeyi düşünün',
      description:
        'Kampanyanın düzenli olarak gözden geçirilmesi için bir bitiş tarihi belirlemeyi düşünebilirsiniz.',
      relatedStep: 'schedule',
    })
  }

  return suggestions
}
