import type { CampaignStatus, CampaignType } from './advertisement.ts'

export type AnalyticsDateRange = '7d' | '30d' | '90d'

export type AnalyticsKpis = {
  impressions: number
  clicks: number
  /** Percentage, e.g. 6.8 */
  ctr: number
  spend: number
  conversions: number
  /** Return on ad spend, e.g. 3.4 */
  roas: number
}

export type AnalyticsDailyPoint = {
  date: string
  impressions: number
  clicks: number
  spend: number
}

export type AnalyticsCampaignRow = {
  campaignId: string
  campaignName: string
  productId: string
  type: CampaignType
  impressions: number
  clicks: number
  ctr: number
  spend: number
  conversions: number
  status: CampaignStatus
}

export type AnalyticsProductRow = {
  productId: string
  productName: string
  impressions: number
  ctr: number
  conversions: number
  spend: number
}

export type AnalyticsChannelRow = {
  channel: CampaignType
  impressions: number
  ctr: number
  spend: number
  conversions: number
}

/**
 * Full analytics payload for one advertiser company.
 * Always filtered by companyId — never mix tenants.
 */
export type CompanyAnalyticsDataset = {
  id: string
  companyId: string
  kpisByRange: Record<AnalyticsDateRange, AnalyticsKpis>
  dailyTrend: AnalyticsDailyPoint[]
  campaigns: AnalyticsCampaignRow[]
  products: AnalyticsProductRow[]
  channels: AnalyticsChannelRow[]
  aiInsights: string[]
}
