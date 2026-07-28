export type AudienceSegmentStatus = 'active' | 'inactive' | 'draft'

export type AudienceRuleSummaryItem = {
  label: string
  value: string
}

export type AudienceSegmentRecord = {
  id: string
  companyId: string
  name: string
  description: string
  estimatedSize: number
  updatedAt: string
  createdAt: string
  campaignUsageCount: number
  status: AudienceSegmentStatus
  rules: AudienceRuleSummaryItem[]
}

export type AudienceKpis = {
  totalSegments: number
  activeSegments: number
  usedInCampaigns: number
  averageSegmentSize: number
}

/**
 * Full hedef kitle payload for one advertiser company.
 * Always filtered by companyId — never mix tenants.
 */
export type CompanyAudienceDataset = {
  id: string
  companyId: string
  segments: AudienceSegmentRecord[]
  kpis: AudienceKpis
  aiInsights: string[]
}

export type AudienceCreatedFilter = 'all' | '7d' | '30d' | '90d'
export type AudienceUsageFilter = 'all' | 'used' | 'unused'
