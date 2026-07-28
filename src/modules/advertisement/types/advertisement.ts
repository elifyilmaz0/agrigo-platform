export type CampaignStatus =
  | 'active'
  | 'draft'
  | 'pending_review'
  | 'scheduled'
  | 'paused'
  | 'completed'
  | 'archived'

export type CampaignType = 'native_recommendation' | 'bulk_message'

export type ProductCategory =
  | 'Sulama'
  | 'Gübre'
  | 'Tohum'
  | 'Arıcılık'
  | 'Ekipman'
  | 'Bitki Koruma'
  | 'Hayvancılık'
  | 'Diğer'

export type ProductionTypeOption = 'Bitkisel' | 'Hayvansal' | 'Arıcılık' | 'Karma'

export type CropOption =
  | 'Zeytin'
  | 'Üzüm'
  | 'Buğday'
  | 'Domates'
  | 'Mısır'
  | 'Ayçiçeği'

export type LivestockOption = 'Büyükbaş' | 'Küçükbaş' | 'Kanatlı' | 'Arıcılık'

export type ProductUsageStatus = 'used' | 'unused' | 'active_campaign'

export type ProductSalesStatus =
  | 'on-sale'
  | 'not-on-sale'
  | 'coming-soon'
  | 'out-of-stock'

export type ProductStockStatus =
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock'
  | 'unknown'

export type ProductCampaignStats = {
  totalCampaigns: number
  activeCampaigns: number
  totalAdSpend: number
  lastUsedAt: string | null
  last30Days: {
    impressions: number
    clicks: number
    conversions: number
  }
}

/**
 * Product is an independent catalog/commerce entity.
 * Campaign linkage is optional and represented only via campaignStats.
 */
export type Product = {
  id: string
  /** Owning advertiser tenant — required for multi-tenant isolation */
  companyId: string
  name: string
  brand: string
  category: ProductCategory
  shortDescription: string
  description?: string
  listPrice: number | null
  discountedPrice?: number | null
  currency: 'TRY'
  salesStatus: ProductSalesStatus
  stockStatus: ProductStockStatus
  salesUrl?: string
  sellerContact?: string
  imageUrl?: string
  productionType?: string
  relevantProducts?: string
  livestockArea?: string
  targetFarmerProfile?: string
  usagePurpose?: string
  recommendedSeason?: string
  usageNotes?: string
  campaignStats: ProductCampaignStats
  createdAt: string
  updatedAt?: string
}

export type ProductPerformanceRow = {
  productId: string
  companyId: string
  campaignType: CampaignType
  primaryPerformance: string
  engagement: string
  estimatedAdSpend: number
  nativeMetrics?: {
    impressions: number
    clicks: number
    conversions: number
  }
  bulkMetrics?: {
    targeted: number
    delivered: number
    read: number
    clicked: number
  }
}

export type SegmentOwner = 'brand' | 'agrigo'

export type SavedSegment = {
  id: string
  companyId: string
  name: string
  owner: SegmentOwner
  criteriaSummary: string[]
}

export type CampaignTargetRules = {
  naturalLanguageSummary: string
  extraRules: string[]
}

export type NativeCreative = {
  kind: 'native'
  headline: string
  recommendationText: string
  benefitText: string
  ctaText: string
  imageLabel?: string
}

export type BulkCreative = {
  kind: 'bulk'
  messageTitle: string
  messageBody: string
  ctaText: string
  imageLabel?: string
}

export type CampaignCreative = NativeCreative | BulkCreative

export type CampaignSchedule = {
  startDate: string | null
  endDate: string | null
}

export type NativeDailyMetric = {
  date: string
  impressions: number
  clicks: number
  conversions: number
  estimatedSpend: number
}

export type BulkPerformanceRates = {
  eligibleAudience: number
  deliveryRate: number
  readRate: number
  clickRate: number
  estimatedSpend: number
}

export type BulkSimulationStatus = 'not_run' | 'completed' | 'failed'

export type NativePreviewScenario = {
  id: string
  label: string
  farmerQuestion: string
  aiResponse: string
  showRecommendation: boolean
  resultLabel: 'Öneri gösterildi' | 'Öneri gösterilmedi'
  resultReason: string
  creativeFit: string
}

export type Campaign = {
  id: string
  /** Owning advertiser tenant — required for multi-tenant isolation */
  companyId: string
  name: string
  productId: string
  type: CampaignType
  status: CampaignStatus
  budget: number
  createdAt: string
  updatedAt: string
  description: string
  impressions?: number
  clicks?: number
  conversions?: number
  estimatedSpend: number
  schedule: CampaignSchedule
  segments: SavedSegment[]
  targetRules: CampaignTargetRules
  estimatedSegmentSize: number
  consentEligibleAudience: number
  creative: CampaignCreative
  nativeDailyMetrics?: NativeDailyMetric[]
  bulkPerformance?: BulkPerformanceRates
  bulkSimulationStatus?: BulkSimulationStatus
  nativePreviewScenarios?: NativePreviewScenario[]
}

export type CampaignDetailTab =
  | 'overview'
  | 'creative'
  | 'targeting'
  | 'performance'
  | 'preview'

export type DashboardAlert = {
  id: string
  title: string
  description: string
  severity: 'warning' | 'info' | 'critical'
}

export type PerformanceSummary = {
  nativeRecommendation: {
    impressions: number
    clicks: number
    conversions: number
  }
  bulkMessage: {
    targetedAudience: number
    delivered: number
    read: number
    clicked: number
  }
  estimatedSpend: number
}

export type CampaignStatusSummary = {
  total: number
  active: number
  draft: number
  pendingReview: number
  scheduled: number
  paused: number
}

export type ProductSummary = {
  total: number
  usedInCampaigns: number
  withActiveCampaigns: number
  unused: number
}

export type CompanyInfo = {
  name: string
  userName: string
  userRole: string
}
