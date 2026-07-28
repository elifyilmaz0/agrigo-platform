import type {
  AnalyticsCampaignRow,
  AnalyticsChannelRow,
  AnalyticsDailyPoint,
  AnalyticsDateRange,
  AnalyticsKpis,
  AnalyticsProductRow,
  CompanyAnalyticsDataset,
} from '../types/analytics.ts'
import { COMPANY_IDS } from './tenant.ts'

function buildDailyTrend(
  endDate: string,
  dayCount: number,
  totals: { impressions: number; clicks: number; spend: number },
  seed: number,
): AnalyticsDailyPoint[] {
  const end = new Date(`${endDate}T12:00:00`)
  const weights = Array.from({ length: dayCount }, (_, i) => {
    const wave = 0.65 + ((Math.sin(seed + i * 0.7) + 1) / 2) * 0.7
    return (i + 1) * wave
  })
  const weightSum = weights.reduce((a, b) => a + b, 0)

  let usedImp = 0
  let usedClick = 0
  let usedSpend = 0

  return weights.map((weight, index) => {
    const isLast = index === dayCount - 1
    const date = new Date(end)
    date.setDate(end.getDate() - (dayCount - 1 - index))

    const impressions = isLast
      ? totals.impressions - usedImp
      : Math.max(0, Math.floor((totals.impressions * weight) / weightSum))
    const clicks = isLast
      ? totals.clicks - usedClick
      : Math.max(0, Math.floor((totals.clicks * weight) / weightSum))
    const spend = isLast
      ? totals.spend - usedSpend
      : Math.max(0, Math.floor((totals.spend * weight) / weightSum))

    usedImp += impressions
    usedClick += clicks
    usedSpend += spend

    return {
      date: date.toISOString().slice(0, 10),
      impressions,
      clicks,
      spend,
    }
  })
}

function kpis(
  impressions: number,
  clicks: number,
  spend: number,
  conversions: number,
  roas: number,
): AnalyticsKpis {
  return {
    impressions,
    clicks,
    ctr: impressions === 0 ? 0 : Number(((clicks / impressions) * 100).toFixed(1)),
    spend,
    conversions,
    roas,
  }
}

type DatasetSeed = {
  companyId: string
  seed: number
  ranges: Record<AnalyticsDateRange, AnalyticsKpis>
  campaigns: AnalyticsCampaignRow[]
  products: AnalyticsProductRow[]
  channels: AnalyticsChannelRow[]
  aiInsights: string[]
}

function buildDataset(seed: DatasetSeed): CompanyAnalyticsDataset {
  const range90 = seed.ranges['90d']
  return {
    id: `analytics-${seed.companyId}`,
    companyId: seed.companyId,
    kpisByRange: seed.ranges,
    dailyTrend: buildDailyTrend(
      '2026-07-27',
      90,
      {
        impressions: range90.impressions,
        clicks: range90.clicks,
        spend: range90.spend,
      },
      seed.seed,
    ),
    campaigns: seed.campaigns,
    products: seed.products,
    channels: seed.channels,
    aiInsights: seed.aiInsights,
  }
}

const analyticsSeeds: DatasetSeed[] = [
  {
    companyId: COMPANY_IDS.isleyen,
    seed: 11,
    ranges: {
      '7d': kpis(4120, 298, 9800, 48, 2.9),
      '30d': kpis(18420, 1284, 42650, 212, 3.4),
      '90d': kpis(51200, 3480, 118400, 590, 3.1),
    },
    campaigns: [
      {
        campaignId: 'camp-1',
        campaignName: 'DripFlow Bahar Sulama Sezonu',
        productId: 'prod-1',
        type: 'native_recommendation',
        impressions: 6240,
        clicks: 412,
        ctr: 6.6,
        spend: 12800,
        conversions: 68,
        status: 'active',
      },
      {
        campaignId: 'camp-2',
        campaignName: 'Zeytin Gübre Hasat Öncesi',
        productId: 'prod-2',
        type: 'bulk_message',
        impressions: 3260,
        clicks: 186,
        ctr: 5.7,
        spend: 9600,
        conversions: 42,
        status: 'active',
      },
      {
        campaignId: 'camp-4',
        campaignName: 'Zeytin Bahçesi Besleme Önerisi',
        productId: 'prod-2',
        type: 'native_recommendation',
        impressions: 4120,
        clicks: 278,
        ctr: 6.7,
        spend: 8400,
        conversions: 51,
        status: 'active',
      },
      {
        campaignId: 'camp-5',
        campaignName: 'DripFlow Bölgesel Yayılım',
        productId: 'prod-1',
        type: 'native_recommendation',
        impressions: 2800,
        clicks: 198,
        ctr: 7.1,
        spend: 5200,
        conversions: 31,
        status: 'active',
      },
      {
        campaignId: 'camp-14',
        campaignName: 'Çapa Makinesi Duraklatılan Kampanya',
        productId: 'prod-5',
        type: 'bulk_message',
        impressions: 2000,
        clicks: 210,
        ctr: 10.5,
        spend: 6650,
        conversions: 20,
        status: 'paused',
      },
    ],
    products: [
      {
        productId: 'prod-1',
        productName: 'DripFlow Damla Sulama Filtresi',
        impressions: 9040,
        ctr: 6.7,
        conversions: 99,
        spend: 18000,
      },
      {
        productId: 'prod-2',
        productName: 'Zeytin Özel Sıvı Gübre 20L',
        impressions: 7380,
        ctr: 6.3,
        conversions: 93,
        spend: 18000,
      },
      {
        productId: 'prod-5',
        productName: 'Kompakt Sıra Arası Çapa Makinesi',
        impressions: 2000,
        ctr: 10.5,
        conversions: 20,
        spend: 6650,
      },
    ],
    channels: [
      {
        channel: 'native_recommendation',
        impressions: 13160,
        ctr: 6.7,
        spend: 26400,
        conversions: 150,
      },
      {
        channel: 'bulk_message',
        impressions: 5260,
        ctr: 7.5,
        spend: 16250,
        conversions: 62,
      },
    ],
    aiInsights: [
      'DripFlow Bahar Sulama Sezonu kampanyası hedef CTR’nin üzerinde performans gösteriyor.',
      'Zeytin Gübre Hasat Öncesi toplu mesajında okunma oranı güçlü; tıklama sonrası dönüşüm artırılabilir.',
      'Çapa makinesi kampanyası duraklatıldığı için son 7 günde harcama düştü, fırsat kaybı riski var.',
    ],
  },
  {
    companyId: COMPANY_IDS.bereket,
    seed: 23,
    ranges: {
      '7d': kpis(1680, 112, 3200, 18, 2.4),
      '30d': kpis(6200, 410, 13900, 62, 2.8),
      '90d': kpis(17800, 1180, 39200, 176, 2.6),
    },
    campaigns: [
      {
        campaignId: 'camp-bg-1',
        campaignName: 'Bereket NPK İlkbahar Kampanyası',
        productId: 'prod-bg-1',
        type: 'native_recommendation',
        impressions: 3100,
        clicks: 210,
        ctr: 6.8,
        spend: 7200,
        conversions: 34,
        status: 'active',
      },
      {
        campaignId: 'camp-bg-2',
        campaignName: 'Organik Kompost Duyurusu',
        productId: 'prod-bg-2',
        type: 'bulk_message',
        impressions: 1800,
        clicks: 92,
        ctr: 5.1,
        spend: 3800,
        conversions: 14,
        status: 'active',
      },
      {
        campaignId: 'camp-bg-3',
        campaignName: 'Sera Mikro Element Bahar Duyurusu',
        productId: 'prod-bg-3',
        type: 'native_recommendation',
        impressions: 1300,
        clicks: 108,
        ctr: 8.3,
        spend: 2900,
        conversions: 14,
        status: 'scheduled',
      },
    ],
    products: [
      {
        productId: 'prod-bg-1',
        productName: 'Bereket NPK 15-15-15',
        impressions: 3100,
        ctr: 6.8,
        conversions: 34,
        spend: 7200,
      },
      {
        productId: 'prod-bg-2',
        productName: 'Bereket Organik Kompost',
        impressions: 1800,
        ctr: 5.1,
        conversions: 14,
        spend: 3800,
      },
      {
        productId: 'prod-bg-3',
        productName: 'Bereket Sera Mikro Element Paketi',
        impressions: 1300,
        ctr: 8.3,
        conversions: 14,
        spend: 2900,
      },
    ],
    channels: [
      {
        channel: 'native_recommendation',
        impressions: 4400,
        ctr: 7.2,
        spend: 10100,
        conversions: 48,
      },
      {
        channel: 'bulk_message',
        impressions: 1800,
        ctr: 5.1,
        spend: 3800,
        conversions: 14,
      },
    ],
    aiInsights: [
      'NPK kampanyası hedef CTR’nin üzerinde.',
      'Organik Kompost kampanyası düşük dönüşüm üretiyor.',
      'Toplu Mesaj performansı geçen aya göre %12 arttı.',
    ],
  },
  {
    companyId: COMPANY_IDS.agronova,
    seed: 37,
    ranges: {
      '7d': kpis(1420, 98, 2900, 14, 2.2),
      '30d': kpis(5100, 340, 13100, 48, 2.5),
      '90d': kpis(14900, 980, 37200, 138, 2.3),
    },
    campaigns: [
      {
        campaignId: 'camp-an-1',
        campaignName: 'AgroNova Fungisit Sezon Kampanyası',
        productId: 'prod-an-1',
        type: 'native_recommendation',
        impressions: 2400,
        clicks: 165,
        ctr: 6.9,
        spend: 5400,
        conversions: 22,
        status: 'active',
      },
      {
        campaignId: 'camp-an-2',
        campaignName: 'İnsektisit Max Pamuk Koruma',
        productId: 'prod-an-2',
        type: 'bulk_message',
        impressions: 1750,
        clicks: 118,
        ctr: 6.7,
        spend: 4100,
        conversions: 16,
        status: 'active',
      },
      {
        campaignId: 'camp-an-3',
        campaignName: 'Herbisit Select Buğday Sezonu',
        productId: 'prod-an-3',
        type: 'native_recommendation',
        impressions: 950,
        clicks: 57,
        ctr: 6.0,
        spend: 3600,
        conversions: 10,
        status: 'draft',
      },
    ],
    products: [
      {
        productId: 'prod-an-1',
        productName: 'AgroNova Fungisit Pro',
        impressions: 2400,
        ctr: 6.9,
        conversions: 22,
        spend: 5400,
      },
      {
        productId: 'prod-an-2',
        productName: 'AgroNova İnsektisit Max',
        impressions: 1750,
        ctr: 6.7,
        conversions: 16,
        spend: 4100,
      },
      {
        productId: 'prod-an-3',
        productName: 'AgroNova Herbisit Select',
        impressions: 950,
        ctr: 6.0,
        conversions: 10,
        spend: 3600,
      },
    ],
    channels: [
      {
        channel: 'native_recommendation',
        impressions: 3350,
        ctr: 6.6,
        spend: 9000,
        conversions: 32,
      },
      {
        channel: 'bulk_message',
        impressions: 1750,
        ctr: 6.7,
        spend: 4100,
        conversions: 16,
      },
    ],
    aiInsights: [
      'Fungisit sezon kampanyası pamuk bölgelerinde istikrarlı tıklama üretiyor.',
      'İnsektisit Max toplu mesajında teslim oranı yüksek; CTA metni güçlendirilebilir.',
      'Herbisit Select henüz taslak aşamasında olduğu için analitik katkısı sınırlı.',
    ],
  },
  {
    companyId: COMPANY_IDS.verimli,
    seed: 41,
    ranges: {
      '7d': kpis(1180, 82, 2400, 12, 2.7),
      '30d': kpis(4300, 290, 10600, 41, 3.0),
      '90d': kpis(12600, 840, 29800, 118, 2.8),
    },
    campaigns: [
      {
        campaignId: 'camp-vt-1',
        campaignName: 'Hibrit Mısır Erken Sipariş',
        productId: 'prod-vt-1',
        type: 'native_recommendation',
        impressions: 2600,
        clicks: 178,
        ctr: 6.8,
        spend: 4800,
        conversions: 29,
        status: 'active',
      },
      {
        campaignId: 'camp-vt-2',
        campaignName: 'Domates F1 Sera Duyurusu',
        productId: 'prod-vt-2',
        type: 'bulk_message',
        impressions: 1500,
        clicks: 98,
        ctr: 6.5,
        spend: 3100,
        conversions: 15,
        status: 'active',
      },
      {
        campaignId: 'camp-vt-3',
        campaignName: 'Ayçiçeği Tohumu Kurak Bölge Planı',
        productId: 'prod-vt-3',
        type: 'native_recommendation',
        impressions: 200,
        clicks: 14,
        ctr: 7.0,
        spend: 2700,
        conversions: 0,
        status: 'pending_review',
      },
    ],
    products: [
      {
        productId: 'prod-vt-1',
        productName: 'Verimli Hibrit Mısır Tohumu',
        impressions: 2600,
        ctr: 6.8,
        conversions: 29,
        spend: 4800,
      },
      {
        productId: 'prod-vt-2',
        productName: 'Verimli Domates F1 Tohumu',
        impressions: 1500,
        ctr: 6.5,
        conversions: 15,
        spend: 3100,
      },
      {
        productId: 'prod-vt-3',
        productName: 'Verimli Ayçiçeği Tohumu',
        impressions: 200,
        ctr: 7.0,
        conversions: 0,
        spend: 2700,
      },
    ],
    channels: [
      {
        channel: 'native_recommendation',
        impressions: 2800,
        ctr: 6.9,
        spend: 7500,
        conversions: 29,
      },
      {
        channel: 'bulk_message',
        impressions: 1500,
        ctr: 6.5,
        spend: 3100,
        conversions: 15,
      },
    ],
    aiInsights: [
      'Hibrit Mısır Erken Sipariş kampanyası en yüksek dönüşüm üreten kanal.',
      'Domates F1 sera segmentinde okunma oranı iyi; bütçe artışı değerlendirilebilir.',
      'Ayçiçeği kampanyası incelemede olduğu için ROAS henüz oluşmadı.',
    ],
  },
  {
    companyId: COMPANY_IDS.anadolu,
    seed: 53,
    ranges: {
      '7d': kpis(1520, 104, 3100, 16, 2.6),
      '30d': kpis(5600, 380, 12900, 55, 2.9),
      '90d': kpis(16100, 1080, 36400, 152, 2.7),
    },
    campaigns: [
      {
        campaignId: 'camp-as-1',
        campaignName: 'Akıllı Damla Başlığı Sezon Açılışı',
        productId: 'prod-as-1',
        type: 'native_recommendation',
        impressions: 2850,
        clicks: 196,
        ctr: 6.9,
        spend: 5200,
        conversions: 31,
        status: 'active',
      },
      {
        campaignId: 'camp-as-2',
        campaignName: 'Yağmurlama Hortumu Tarla Kampanyası',
        productId: 'prod-as-2',
        type: 'bulk_message',
        impressions: 1680,
        clicks: 84,
        ctr: 5.0,
        spend: 3400,
        conversions: 13,
        status: 'active',
      },
      {
        campaignId: 'camp-as-3',
        campaignName: 'Nem Sensörü Dijital Sulama Planı',
        productId: 'prod-as-3',
        type: 'native_recommendation',
        impressions: 1070,
        clicks: 100,
        ctr: 9.3,
        spend: 4300,
        conversions: 11,
        status: 'scheduled',
      },
    ],
    products: [
      {
        productId: 'prod-as-1',
        productName: 'Anadolu Akıllı Damla Başlığı',
        impressions: 2850,
        ctr: 6.9,
        conversions: 31,
        spend: 5200,
      },
      {
        productId: 'prod-as-2',
        productName: 'Anadolu Yağmurlama Hortumu 50m',
        impressions: 1680,
        ctr: 5.0,
        conversions: 13,
        spend: 3400,
      },
      {
        productId: 'prod-as-3',
        productName: 'Anadolu Toprak Nem Sensörü',
        impressions: 1070,
        ctr: 9.3,
        conversions: 11,
        spend: 4300,
      },
    ],
    channels: [
      {
        channel: 'native_recommendation',
        impressions: 3920,
        ctr: 7.6,
        spend: 9500,
        conversions: 42,
      },
      {
        channel: 'bulk_message',
        impressions: 1680,
        ctr: 5.0,
        spend: 3400,
        conversions: 13,
      },
    ],
    aiInsights: [
      'Akıllı Damla Başlığı kampanyası sulama sezonunda güçlü dönüşüm sağlıyor.',
      'Yağmurlama Hortumu toplu mesajında CTR hedef altında; hedef kitle daraltılabilir.',
      'Nem Sensörü planlı kampanyası yüksek erken CTR sinyali veriyor.',
    ],
  },
]

const analyticsByCompanyId: Record<string, CompanyAnalyticsDataset> =
  Object.fromEntries(
    analyticsSeeds.map((seed) => [seed.companyId, buildDataset(seed)]),
  )

const emptyKpis: AnalyticsKpis = {
  impressions: 0,
  clicks: 0,
  ctr: 0,
  spend: 0,
  conversions: 0,
  roas: 0,
}

export function getAnalyticsDatasetForCompany(
  companyId: string | null | undefined,
): CompanyAnalyticsDataset | undefined {
  if (!companyId) return undefined
  return analyticsByCompanyId[companyId]
}

export function getEmptyAnalyticsDataset(
  companyId: string | null = null,
): CompanyAnalyticsDataset {
  return {
    id: 'analytics-empty',
    companyId: companyId ?? '',
    kpisByRange: {
      '7d': emptyKpis,
      '30d': emptyKpis,
      '90d': emptyKpis,
    },
    dailyTrend: [],
    campaigns: [],
    products: [],
    channels: [],
    aiInsights: [],
  }
}

export function sliceDailyTrend(
  points: AnalyticsDailyPoint[],
  range: AnalyticsDateRange,
): AnalyticsDailyPoint[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  return points.slice(-days)
}
