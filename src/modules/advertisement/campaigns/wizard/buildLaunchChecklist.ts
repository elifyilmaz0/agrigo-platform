import type { CampaignDraft } from './campaignDraft.ts'
import {
  previewSectionStatusLabels,
  type LaunchChecklistItem,
  type PreviewSectionStatus,
} from './campaignReadinessTypes.ts'
import type { CampaignWizardStepId } from './campaignWizardSteps.ts'
import {
  validateAudienceStep,
  validateBudgetStep,
  validateCampaignInfo,
  validateCreativeStep,
  validateProductStep,
  validateScheduleStep,
  validateTargetingRulesStep,
} from './campaignWizardValidation.ts'

export function buildLaunchChecklist(
  draft: CampaignDraft,
): LaunchChecklistItem[] {
  const savedSegment = draft.audience.mode === 'saved-segment'

  const targetingStatus: PreviewSectionStatus = savedSegment
    ? 'saved-segment'
    : validateTargetingRulesStep(draft).valid
      ? 'ready'
      : 'incomplete'

  const consentStatus = resolveConsentStatus(draft)

  return [
    item(
      'info',
      'Kampanya Bilgileri',
      validateCampaignInfo(draft).valid ? 'ready' : 'incomplete',
      'campaign-info',
    ),
    item(
      'product',
      'Ürün',
      validateProductStep(draft).valid ? 'ready' : 'incomplete',
      'product',
    ),
    item(
      'creative',
      'Kreatif',
      validateCreativeStep(draft).valid ? 'ready' : 'incomplete',
      'creative',
    ),
    item(
      'audience',
      'Hedef Kitle',
      validateAudienceStep(draft).valid ? 'ready' : 'incomplete',
      'audience',
    ),
    {
      id: 'targeting',
      label: 'Hedef Kuralları',
      status: targetingStatus,
      statusLabel: previewSectionStatusLabels[targetingStatus],
      ready: targetingStatus === 'ready' || targetingStatus === 'saved-segment',
      detail: savedSegment ? 'Hazır segment kullanılıyor' : undefined,
      relatedStep: savedSegment ? 'audience' : 'targeting-rules',
    },
    item(
      'schedule',
      'Zamanlama',
      validateScheduleStep(draft).valid ? 'ready' : 'incomplete',
      'schedule',
    ),
    item(
      'budget',
      'Bütçe',
      validateBudgetStep(draft).valid ? 'ready' : 'incomplete',
      'budget',
    ),
    {
      id: 'consent',
      label: 'Gizlilik ve İzin Varsayımları',
      status: consentStatus.status,
      statusLabel: previewSectionStatusLabels[consentStatus.status],
      ready: consentStatus.ready,
      detail: consentStatus.detail,
      relatedStep: savedSegment ? 'audience' : 'targeting-rules',
    },
  ]
}

function item(
  id: string,
  label: string,
  status: PreviewSectionStatus,
  relatedStep: CampaignWizardStepId,
): LaunchChecklistItem {
  return {
    id,
    label,
    status,
    statusLabel: previewSectionStatusLabels[status],
    ready: status === 'ready' || status === 'saved-segment',
    relatedStep,
  }
}

function resolveConsentStatus(draft: CampaignDraft): {
  status: PreviewSectionStatus
  ready: boolean
  detail?: string
} {
  if (draft.audience.mode === 'saved-segment') {
    return {
      status: 'ready',
      ready: true,
      detail: 'Anonim / toplulaştırılmış hedefleme varsayımı',
    }
  }

  if (draft.audience.mode !== 'rule-based') {
    return { status: 'incomplete', ready: false }
  }

  const consent = draft.targetingRules.consentRequirements
  if (!consent.dataProcessingRequired) {
    return {
      status: 'incomplete',
      ready: false,
      detail: 'Veri işleme varsayımı eksik',
    }
  }

  if (
    draft.campaignType === 'bulk' &&
    !consent.marketingConsentRequired
  ) {
    return {
      status: 'incomplete',
      ready: false,
      detail: 'Pazarlama izni gereksinimi kapalı',
    }
  }

  return {
    status: 'ready',
    ready: true,
    detail:
      draft.campaignType === 'bulk'
        ? 'Pazarlama izni gereksinimi aktif'
        : 'İzin modeli inceleme notu',
  }
}

export function areRequiredLaunchChecksReady(draft: CampaignDraft): boolean {
  return buildLaunchChecklist(draft).every((entry) => entry.ready)
}

export function createSimulationId(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `SIM-${y}${m}${d}-${hh}${mm}${ss}`
}
