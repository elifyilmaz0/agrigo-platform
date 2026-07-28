import type {
  DashboardAlert,
  PerformanceSummary,
  ProductPerformanceRow,
} from '../types/advertisement.ts'
import { initialAdvertiserProfile } from './advertiserProfile.ts'
import { COMPANY_IDS } from './tenant.ts'
import { campaigns } from './campaigns.ts'
import { products } from './products.ts'
import type { CompanyInfo, CampaignStatusSummary, ProductSummary } from '../types/advertisement.ts'

export const companyInfo: CompanyInfo = {
  name: initialAdvertiserProfile.company.name,
  userName: 'Elif Kaya',
  userRole: 'Reklamveren Kullanıcısı',
}

export const campaignStatusSummary: CampaignStatusSummary = {
  total: campaigns.length,
  active: campaigns.filter((c) => c.status === 'active').length,
  draft: campaigns.filter((c) => c.status === 'draft').length,
  pendingReview: campaigns.filter((c) => c.status === 'pending_review').length,
  scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
  paused: campaigns.filter((c) => c.status === 'paused').length,
}

/** Prefer live summary from CampaignStore when rendering interactive screens. */

export const productSummary: ProductSummary = {
  total: products.length,
  usedInCampaigns: products.filter((p) => p.campaignStats.totalCampaigns > 0)
    .length,
  withActiveCampaigns: products.filter(
    (p) => p.campaignStats.activeCampaigns > 0,
  ).length,
  unused: products.filter((p) => p.campaignStats.totalCampaigns === 0).length,
}

const performanceByCompany: Record<string, PerformanceSummary> = {
  [COMPANY_IDS.isleyen]: {
    nativeRecommendation: {
      impressions: 18420,
      clicks: 1284,
      conversions: 212,
    },
    bulkMessage: {
      targetedAudience: 4660,
      delivered: 3905,
      read: 1245,
      clicked: 186,
    },
    estimatedSpend: 42650,
  },
  [COMPANY_IDS.bereket]: {
    nativeRecommendation: {
      impressions: 6200,
      clicks: 410,
      conversions: 62,
    },
    bulkMessage: {
      targetedAudience: 2100,
      delivered: 1780,
      read: 640,
      clicked: 92,
    },
    estimatedSpend: 13900,
  },
  [COMPANY_IDS.agronova]: {
    nativeRecommendation: {
      impressions: 5100,
      clicks: 340,
      conversions: 48,
    },
    bulkMessage: {
      targetedAudience: 1850,
      delivered: 1520,
      read: 510,
      clicked: 78,
    },
    estimatedSpend: 13100,
  },
  [COMPANY_IDS.verimli]: {
    nativeRecommendation: {
      impressions: 4300,
      clicks: 290,
      conversions: 41,
    },
    bulkMessage: {
      targetedAudience: 1600,
      delivered: 1340,
      read: 470,
      clicked: 66,
    },
    estimatedSpend: 10600,
  },
  [COMPANY_IDS.anadolu]: {
    nativeRecommendation: {
      impressions: 5600,
      clicks: 380,
      conversions: 55,
    },
    bulkMessage: {
      targetedAudience: 1980,
      delivered: 1660,
      read: 580,
      clicked: 84,
    },
    estimatedSpend: 12900,
  },
}

/** @deprecated Prefer getPerformanceSummaryForCompany */
export const performanceSummary =
  performanceByCompany[COMPANY_IDS.isleyen]

export function getPerformanceSummaryForCompany(
  companyId: string | null | undefined,
): PerformanceSummary {
  if (!companyId) {
    return {
      nativeRecommendation: { impressions: 0, clicks: 0, conversions: 0 },
      bulkMessage: {
        targetedAudience: 0,
        delivered: 0,
        read: 0,
        clicked: 0,
      },
      estimatedSpend: 0,
    }
  }
  return (
    performanceByCompany[companyId] ?? {
      nativeRecommendation: { impressions: 0, clicks: 0, conversions: 0 },
      bulkMessage: {
        targetedAudience: 0,
        delivered: 0,
        read: 0,
        clicked: 0,
      },
      estimatedSpend: 0,
    }
  )
}

const alertsByCompany: Record<string, DashboardAlert[]> = {
  [COMPANY_IDS.isleyen]: [
    {
      id: 'alert-it-1',
      title: 'İnceleme Bekleyen Kampanyalar',
      description: '2 kampanya yayın öncesi incelemede.',
      severity: 'warning',
    },
    {
      id: 'alert-it-2',
      title: 'Kampanyada Kullanılmayan Ürün',
      description:
        'Biyolojik Yaprak Bitkisi Mücadelesi henüz bir reklam kampanyasına bağlanmadı.',
      severity: 'info',
    },
    {
      id: 'alert-it-3',
      title: 'En Başarılı Kampanya',
      description: 'DripFlow Bahar Sulama Sezonu — son 30 günde en yüksek etkileşim.',
      severity: 'info',
    },
  ],
  [COMPANY_IDS.bereket]: [
    {
      id: 'alert-bg-1',
      title: 'Planlanan Kampanya',
      description: 'Sera Mikro Element Bahar Duyurusu başlangıç tarihine yaklaşıyor.',
      severity: 'info',
    },
    {
      id: 'alert-bg-2',
      title: 'NPK Performansı',
      description: 'Bereket NPK İlkbahar Kampanyası hedef CTR bandının üzerinde.',
      severity: 'info',
    },
  ],
  [COMPANY_IDS.agronova]: [
    {
      id: 'alert-an-1',
      title: 'Taslak Kampanya',
      description: 'Herbisit Select Buğday Sezonu tamamlanmayı bekliyor.',
      severity: 'warning',
    },
    {
      id: 'alert-an-2',
      title: 'Fatura Durumu',
      description: 'Son fatura ödemesi beklemede — faturalama kartını kontrol edin.',
      severity: 'critical',
    },
  ],
  [COMPANY_IDS.verimli]: [
    {
      id: 'alert-vt-1',
      title: 'İnceleme Talebi',
      description: 'Ayçiçeği Tohumu Kurak Bölge Planı incelemede.',
      severity: 'warning',
    },
    {
      id: 'alert-vt-2',
      title: 'Erken Sipariş Fırsatı',
      description: 'Hibrit Mısır Erken Sipariş kampanyası yüksek dönüşüm gösteriyor.',
      severity: 'info',
    },
  ],
  [COMPANY_IDS.anadolu]: [
    {
      id: 'alert-as-1',
      title: 'Planlanan Kampanya',
      description: 'Nem Sensörü Dijital Sulama Planı Ağustos’ta başlayacak.',
      severity: 'info',
    },
    {
      id: 'alert-as-2',
      title: 'Damla Sulama Performansı',
      description: 'Akıllı Damla Başlığı Sezon Açılışı aktif ve bütçe içinde.',
      severity: 'info',
    },
  ],
}

/** @deprecated Prefer getDashboardAlertsForCompany */
export const dashboardAlerts = alertsByCompany[COMPANY_IDS.isleyen]

export function getDashboardAlertsForCompany(
  companyId: string | null | undefined,
): DashboardAlert[] {
  if (!companyId) return []
  return alertsByCompany[companyId] ?? []
}

const recentCampaignIdsByCompany: Record<string, string[]> = {
  [COMPANY_IDS.isleyen]: ['camp-8', 'camp-9', 'camp-2', 'camp-11', 'camp-1'],
  [COMPANY_IDS.bereket]: ['camp-bg-1', 'camp-bg-2', 'camp-bg-3'],
  [COMPANY_IDS.agronova]: ['camp-an-1', 'camp-an-2', 'camp-an-3'],
  [COMPANY_IDS.verimli]: ['camp-vt-1', 'camp-vt-2', 'camp-vt-3'],
  [COMPANY_IDS.anadolu]: ['camp-as-1', 'camp-as-2', 'camp-as-3'],
}

/** @deprecated Prefer getRecentCampaignIdsForCompany */
export const recentCampaignIds = recentCampaignIdsByCompany[
  COMPANY_IDS.isleyen
] as readonly string[]

export function getRecentCampaignIdsForCompany(
  companyId: string | null | undefined,
): string[] {
  if (!companyId) return []
  return recentCampaignIdsByCompany[companyId] ?? []
}

export const productPerformanceRows: ProductPerformanceRow[] = [
  {
    productId: 'prod-1',
    companyId: COMPANY_IDS.isleyen,
    campaignType: 'native_recommendation',
    primaryPerformance: '6.240 gösterim',
    engagement: '412 tıklama',
    estimatedAdSpend: 12800,
    nativeMetrics: {
      impressions: 6240,
      clicks: 412,
      conversions: 68,
    },
  },
  {
    productId: 'prod-2',
    companyId: COMPANY_IDS.isleyen,
    campaignType: 'bulk_message',
    primaryPerformance: '3.260 hedeflenen uygun kitle',
    engagement: '1.245 okundu · 186 tıklandı',
    estimatedAdSpend: 9600,
    bulkMetrics: {
      targeted: 3260,
      delivered: 2738,
      read: 1245,
      clicked: 186,
    },
  },
  {
    productId: 'prod-5',
    companyId: COMPANY_IDS.isleyen,
    campaignType: 'native_recommendation',
    primaryPerformance: '2.200 gösterim',
    engagement: '176 tıklama',
    estimatedAdSpend: 8550,
    nativeMetrics: {
      impressions: 2200,
      clicks: 176,
      conversions: 31,
    },
  },
  {
    productId: 'prod-bg-1',
    companyId: COMPANY_IDS.bereket,
    campaignType: 'native_recommendation',
    primaryPerformance: '3.100 gösterim',
    engagement: '210 tıklama',
    estimatedAdSpend: 7200,
    nativeMetrics: {
      impressions: 3100,
      clicks: 210,
      conversions: 34,
    },
  },
  {
    productId: 'prod-bg-2',
    companyId: COMPANY_IDS.bereket,
    campaignType: 'bulk_message',
    primaryPerformance: '1.800 hedeflenen uygun kitle',
    engagement: '640 okundu · 92 tıklandı',
    estimatedAdSpend: 3800,
    bulkMetrics: {
      targeted: 1800,
      delivered: 1510,
      read: 640,
      clicked: 92,
    },
  },
  {
    productId: 'prod-bg-3',
    companyId: COMPANY_IDS.bereket,
    campaignType: 'native_recommendation',
    primaryPerformance: '1.400 gösterim',
    engagement: '95 tıklama',
    estimatedAdSpend: 2900,
    nativeMetrics: {
      impressions: 1400,
      clicks: 95,
      conversions: 12,
    },
  },
  {
    productId: 'prod-an-1',
    companyId: COMPANY_IDS.agronova,
    campaignType: 'native_recommendation',
    primaryPerformance: '2.400 gösterim',
    engagement: '165 tıklama',
    estimatedAdSpend: 5400,
    nativeMetrics: {
      impressions: 2400,
      clicks: 165,
      conversions: 22,
    },
  },
  {
    productId: 'prod-an-2',
    companyId: COMPANY_IDS.agronova,
    campaignType: 'bulk_message',
    primaryPerformance: '1.750 hedeflenen uygun kitle',
    engagement: '510 okundu · 78 tıklandı',
    estimatedAdSpend: 4100,
    bulkMetrics: {
      targeted: 1750,
      delivered: 1460,
      read: 510,
      clicked: 78,
    },
  },
  {
    productId: 'prod-an-3',
    companyId: COMPANY_IDS.agronova,
    campaignType: 'native_recommendation',
    primaryPerformance: '1.550 gösterim',
    engagement: '102 tıklama',
    estimatedAdSpend: 3600,
    nativeMetrics: {
      impressions: 1550,
      clicks: 102,
      conversions: 14,
    },
  },
  {
    productId: 'prod-vt-1',
    companyId: COMPANY_IDS.verimli,
    campaignType: 'native_recommendation',
    primaryPerformance: '2.600 gösterim',
    engagement: '178 tıklama',
    estimatedAdSpend: 4800,
    nativeMetrics: {
      impressions: 2600,
      clicks: 178,
      conversions: 29,
    },
  },
  {
    productId: 'prod-vt-2',
    companyId: COMPANY_IDS.verimli,
    campaignType: 'bulk_message',
    primaryPerformance: '1.500 hedeflenen uygun kitle',
    engagement: '470 okundu · 66 tıklandı',
    estimatedAdSpend: 3100,
    bulkMetrics: {
      targeted: 1500,
      delivered: 1260,
      read: 470,
      clicked: 66,
    },
  },
  {
    productId: 'prod-vt-3',
    companyId: COMPANY_IDS.verimli,
    campaignType: 'native_recommendation',
    primaryPerformance: '1.320 gösterim',
    engagement: '88 tıklama',
    estimatedAdSpend: 2700,
    nativeMetrics: {
      impressions: 1320,
      clicks: 88,
      conversions: 11,
    },
  },
  {
    productId: 'prod-as-1',
    companyId: COMPANY_IDS.anadolu,
    campaignType: 'native_recommendation',
    primaryPerformance: '2.850 gösterim',
    engagement: '196 tıklama',
    estimatedAdSpend: 5200,
    nativeMetrics: {
      impressions: 2850,
      clicks: 196,
      conversions: 31,
    },
  },
  {
    productId: 'prod-as-2',
    companyId: COMPANY_IDS.anadolu,
    campaignType: 'bulk_message',
    primaryPerformance: '1.680 hedeflenen uygun kitle',
    engagement: '580 okundu · 84 tıklandı',
    estimatedAdSpend: 3400,
    bulkMetrics: {
      targeted: 1680,
      delivered: 1410,
      read: 580,
      clicked: 84,
    },
  },
  {
    productId: 'prod-as-3',
    companyId: COMPANY_IDS.anadolu,
    campaignType: 'native_recommendation',
    primaryPerformance: '1.490 gösterim',
    engagement: '121 tıklama',
    estimatedAdSpend: 3900,
    nativeMetrics: {
      impressions: 1490,
      clicks: 121,
      conversions: 18,
    },
  },
]
