export type CampaignWizardStepId =
  | 'campaign-info'
  | 'product'
  | 'creative'
  | 'audience'
  | 'targeting-rules'
  | 'schedule'
  | 'budget'
  | 'preview'
  | 'launch-simulation'

export type CampaignWizardStepConfig = {
  id: CampaignWizardStepId
  label: string
  shortLabel: string
  description: string
  order: number
}

export const CAMPAIGN_WIZARD_STEPS: CampaignWizardStepConfig[] = [
  {
    id: 'campaign-info',
    label: 'Kampanya Bilgileri',
    shortLabel: 'Bilgi',
    description: 'Ad, amaç ve kampanya türünü tanımlayın.',
    order: 1,
  },
  {
    id: 'product',
    label: 'Ürün',
    shortLabel: 'Ürün',
    description: 'Tanıtılacak kayıtlı ürünü seçin.',
    order: 2,
  },
  {
    id: 'creative',
    label: 'Kreatif',
    shortLabel: 'Kreatif',
    description: 'Mesaj, CTA ve hedef URL’i belirleyin.',
    order: 3,
  },
  {
    id: 'audience',
    label: 'Hedef Kitle',
    shortLabel: 'Kitle',
    description: 'Kayıtlı segmentlerden hedef kitle seçin.',
    order: 4,
  },
  {
    id: 'targeting-rules',
    label: 'Hedef Kuralları',
    shortLabel: 'Kurallar',
    description: 'Üretim tipi, ürün ve bölge kurallarını netleştirin.',
    order: 5,
  },
  {
    id: 'schedule',
    label: 'Zamanlama',
    shortLabel: 'Zaman',
    description: 'Başlangıç, bitiş ve yayın zamanını ayarlayın.',
    order: 6,
  },
  {
    id: 'budget',
    label: 'Bütçe',
    shortLabel: 'Bütçe',
    description: 'Toplam ve günlük bütçeyi belirleyin.',
    order: 7,
  },
  {
    id: 'preview',
    label: 'Önizleme',
    shortLabel: 'Önizleme',
    description: 'Kampanya özetini ve mock önizlemeyi kontrol edin.',
    order: 8,
  },
  {
    id: 'launch-simulation',
    label: 'Başlatma Simülasyonu',
    shortLabel: 'Simülasyon',
    description: 'Yayın öncesi kontrol listesini çalıştırın.',
    order: 9,
  },
]

export const DEFAULT_WIZARD_STEP_ID: CampaignWizardStepId = 'campaign-info'

export function getWizardStepById(
  stepId: string | null | undefined,
): CampaignWizardStepConfig {
  const found = CAMPAIGN_WIZARD_STEPS.find((step) => step.id === stepId)
  return found ?? CAMPAIGN_WIZARD_STEPS[0]!
}

export function parseWizardStepId(
  value: string | null,
): CampaignWizardStepId {
  const found = CAMPAIGN_WIZARD_STEPS.find((step) => step.id === value)
  return found?.id ?? DEFAULT_WIZARD_STEP_ID
}

export function getWizardStepIndex(stepId: CampaignWizardStepId): number {
  return CAMPAIGN_WIZARD_STEPS.findIndex((step) => step.id === stepId)
}

export function getAdjacentWizardStep(
  stepId: CampaignWizardStepId,
  direction: 'prev' | 'next',
): CampaignWizardStepConfig | null {
  const index = getWizardStepIndex(stepId)
  const nextIndex = direction === 'next' ? index + 1 : index - 1
  return CAMPAIGN_WIZARD_STEPS[nextIndex] ?? null
}

export type WizardStepVisualStatus = 'completed' | 'active' | 'upcoming'

/**
 * Central navigation policy for this sprint:
 * Stepper clicks may jump to any step without requiring prior step validation.
 * `validateStep` still gates the footer "İleri" action for campaign-info / product.
 * Future: set to false and enforce sequential unlock based on validation.
 */
export const ALLOW_FREE_STEP_NAVIGATION = true

/**
 * Visual completion only — based on position relative to active step.
 * Future: replace with real per-step validation results.
 */
export function getWizardStepVisualStatus(
  stepId: CampaignWizardStepId,
  activeStepId: CampaignWizardStepId,
): WizardStepVisualStatus {
  const stepIndex = getWizardStepIndex(stepId)
  const activeIndex = getWizardStepIndex(activeStepId)
  if (stepIndex < activeIndex) return 'completed'
  if (stepIndex === activeIndex) return 'active'
  return 'upcoming'
}

export function getWizardProgressPercent(activeStepId: CampaignWizardStepId): number {
  const index = getWizardStepIndex(activeStepId)
  return Math.round(((index + 1) / CAMPAIGN_WIZARD_STEPS.length) * 100)
}
