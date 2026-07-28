import type { CampaignWizardStepId } from './campaignWizardSteps.ts'

export type CampaignReadinessStatus = 'incomplete' | 'needs-review' | 'ready'

export type ReadinessCheckKind = 'required' | 'advisory'

export type ReadinessCheck = {
  id: string
  kind: ReadinessCheckKind
  label: string
  passed: boolean
  detail?: string
  relatedStep?: CampaignWizardStepId
  weight?: number
}

export type CampaignReadinessResult = {
  score: number
  status: CampaignReadinessStatus
  requiredChecks: ReadinessCheck[]
  advisoryChecks: ReadinessCheck[]
}

export type CampaignRiskSeverity = 'low' | 'medium' | 'high'

export type CampaignRisk = {
  id: string
  severity: CampaignRiskSeverity
  title: string
  description: string
  relatedStep?: CampaignWizardStepId
}

export type CampaignOverallRiskLevel = 'none' | 'low' | 'medium' | 'high'

export type CampaignOpportunity = {
  id: string
  title: string
  description: string
  relatedStep?: CampaignWizardStepId
}

export type CampaignAssistantPriority = 'low' | 'medium' | 'high'

export type CampaignAssistantSuggestion = {
  id: string
  title: string
  description: string
  priority: CampaignAssistantPriority
  relatedStep?: CampaignWizardStepId
}

export type PreviewSectionStatus =
  | 'ready'
  | 'incomplete'
  | 'needs-review'
  | 'saved-segment'

export type LaunchChecklistItem = {
  id: string
  label: string
  status: PreviewSectionStatus
  statusLabel: string
  ready: boolean
  detail?: string
  relatedStep?: CampaignWizardStepId
}

export type LaunchSimulationResult = {
  id: string
  completedAt: string
  status: 'simulated'
  success: boolean
  failedCheckIds: string[]
}

export const readinessStatusLabels: Record<CampaignReadinessStatus, string> = {
  incomplete: 'Eksik Bilgiler Var',
  'needs-review': 'İnceleme Gerekiyor',
  ready: 'Yayına Hazır',
}

export const previewSectionStatusLabels: Record<PreviewSectionStatus, string> =
  {
    ready: 'Hazır',
    incomplete: 'Eksik',
    'needs-review': 'İnceleme Gerekiyor',
    'saved-segment': 'Hazır Segment Kullanılıyor',
  }

export const riskSeverityLabels: Record<CampaignRiskSeverity, string> = {
  low: 'Düşük Risk',
  medium: 'Orta Risk',
  high: 'Yüksek Risk',
}

export const overallRiskLabels: Record<CampaignOverallRiskLevel, string> = {
  none: 'Risk Bulunmadı',
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
}

export const assistantPriorityLabels: Record<
  CampaignAssistantPriority,
  string
> = {
  low: 'Düşük Öncelik',
  medium: 'Orta Öncelik',
  high: 'Yüksek Öncelik',
}

export function deriveOverallRiskLevel(
  risks: CampaignRisk[],
): CampaignOverallRiskLevel {
  if (risks.some((risk) => risk.severity === 'high')) return 'high'
  if (risks.some((risk) => risk.severity === 'medium')) return 'medium'
  if (risks.some((risk) => risk.severity === 'low')) return 'low'
  return 'none'
}
