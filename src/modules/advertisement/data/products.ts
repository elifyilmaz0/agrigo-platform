import type { Product } from '../types/advertisement.ts'
import { COMPANY_IDS } from './tenant.ts'

export const products: Product[] = [
  {
    id: 'prod-1',
    companyId: COMPANY_IDS.isleyen,
    name: 'DripFlow Damla Sulama Filtresi',
    brand: 'DripFlow',
    category: 'Sulama',
    shortDescription:
      'Damla sulama hatlarında tıkanmayı önleyen yüksek verimli filtre.',
    description:
      'Damla sulama sistemlerinde tıkanmayı önleyen yüksek verimli filtre. Sera ve açık alan sulama hatları için uygundur.',
    listPrice: 2450,
    discountedPrice: 2190,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    salesUrl: 'https://ornek-marka.com/urun/dripflow-filtre',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Domates\nSalatalık\nBiber',
    usagePurpose: 'Sulama verimliliği artırma',
    recommendedSeason: 'Tüm Sezon',
    usageNotes: 'Filtreyi sezon başında ve her 30 günde bir kontrol edin.',
    campaignStats: {
      totalCampaigns: 3,
      activeCampaigns: 3,
      totalAdSpend: 12800,
      lastUsedAt: '2026-07-18',
      last30Days: { impressions: 6240, clicks: 412, conversions: 68 },
    },
    createdAt: '2026-03-12',
    updatedAt: '2026-07-18',
  },
  {
    id: 'prod-2',
    companyId: COMPANY_IDS.isleyen,
    name: 'Zeytin Özel Sıvı Gübre 20L',
    brand: 'OliveBoost',
    category: 'Gübre',
    shortDescription:
      'Zeytin bahçeleri için formüle edilmiş sıvı gübre. Verim ve yağ kalitesini destekler.',
    description:
      'Zeytin bahçeleri için formüle edilmiş sıvı gübre. Verim ve yağ kalitesini destekler.',
    listPrice: 1890,
    discountedPrice: null,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'low-stock',
    sellerContact: '0850 123 45 67',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Zeytin',
    targetFarmerProfile: 'Orta ve büyük ölçekli zeytin üreticileri',
    usagePurpose: 'Verim artırma\nToprak besleme',
    recommendedSeason: 'İlkbahar',
    campaignStats: {
      totalCampaigns: 4,
      activeCampaigns: 4,
      totalAdSpend: 9600,
      lastUsedAt: '2026-07-22',
      last30Days: { impressions: 5180, clicks: 356, conversions: 54 },
    },
    createdAt: '2026-02-04',
    updatedAt: '2026-07-22',
  },
  {
    id: 'prod-3',
    companyId: COMPANY_IDS.isleyen,
    name: 'Sertifikalı Ekmeklik Buğday Tohumu',
    brand: 'TarımSeed',
    category: 'Tohum',
    shortDescription:
      'Yüksek çimlenme oranına sahip sertifikalı ekmeklik buğday tohumu.',
    description:
      'Yüksek çimlenme oranına sahip sertifikalı ekmeklik buğday tohumu. Bölgesel iklim koşullarına uyumludur.',
    listPrice: 980,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    salesUrl: 'https://ornek-marka.com/urun/bugday-tohumu',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Buğday',
    recommendedSeason: 'Sonbahar',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 0,
      totalAdSpend: 7200,
      lastUsedAt: '2026-06-28',
      last30Days: { impressions: 2840, clicks: 198, conversions: 31 },
    },
    createdAt: '2026-01-20',
    updatedAt: '2026-06-28',
  },
  {
    id: 'prod-4',
    companyId: COMPANY_IDS.isleyen,
    name: 'Varroa Kontrol Şeridi',
    brand: 'BeeGuard',
    category: 'Arıcılık',
    shortDescription:
      'Arı kolonilerinde varroa mücadelesi için güvenli ve etkili şerit formu.',
    description:
      'Arı kolonilerinde varroa mücadelesi için güvenli ve etkili şerit formu. Koloni sağlığını korur.',
    listPrice: 420,
    currency: 'TRY',
    salesStatus: 'out-of-stock',
    stockStatus: 'out-of-stock',
    sellerContact: 'aricilik@beeguard.example',
    productionType: 'Arıcılık',
    livestockArea: 'Arıcılık',
    usagePurpose: 'Zararlı kontrolü',
    recommendedSeason: 'Yaz',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 0,
      totalAdSpend: 4500,
      lastUsedAt: '2026-07-05',
      last30Days: { impressions: 1960, clicks: 142, conversions: 28 },
    },
    createdAt: '2025-11-08',
    updatedAt: '2026-07-05',
  },
  {
    id: 'prod-5',
    companyId: COMPANY_IDS.isleyen,
    name: 'Kompakt Sıra Arası Çapa Makinesi',
    brand: 'AgriTools',
    category: 'Ekipman',
    shortDescription:
      'Küçük ve orta ölçekli tarlalarda sıra arası çapalama için kompakt makine.',
    description:
      'Küçük ve orta ölçekli tarlalarda sıra arası çapalama için kompakt tarım makinesi.',
    listPrice: 18500,
    discountedPrice: 16800,
    currency: 'TRY',
    salesStatus: 'coming-soon',
    stockStatus: 'unknown',
    salesUrl: 'https://ornek-marka.com/urun/capa-makinesi',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Sebze\nMısır\nAyçiçeği',
    targetFarmerProfile: 'Küçük ve orta ölçekli üreticiler',
    recommendedSeason: 'İlkbahar',
    campaignStats: {
      totalCampaigns: 3,
      activeCampaigns: 0,
      totalAdSpend: 8550,
      lastUsedAt: '2026-07-12',
      last30Days: { impressions: 2200, clicks: 176, conversions: 31 },
    },
    createdAt: '2026-04-01',
    updatedAt: '2026-07-12',
  },
  {
    id: 'prod-6',
    companyId: COMPANY_IDS.isleyen,
    name: 'Biyolojik Yaprak Bitkisi Mücadelesi',
    brand: 'BioProtect',
    category: 'Bitki Koruma',
    shortDescription:
      'Yaprak biti ve benzeri zararlılara karşı biyolojik mücadele çözümü.',
    description:
      'Yaprak biti ve benzeri zararlılara karşı biyolojik mücadele çözümü. Kimyasal kalıntı bırakmaz.',
    listPrice: 760,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    salesUrl: 'https://ornek-marka.com/urun/biyolojik-mucadele',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Domates\nBiber\nSalatalık',
    usagePurpose: 'Zararlı kontrolü',
    recommendedSeason: 'Yaz',
    campaignStats: {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalAdSpend: 0,
      lastUsedAt: null,
      last30Days: { impressions: 0, clicks: 0, conversions: 0 },
    },
    createdAt: '2026-05-15',
    updatedAt: '2026-07-01',
  },
  {
    id: 'prod-bg-1',
    companyId: COMPANY_IDS.bereket,
    name: 'Bereket NPK 15-15-15',
    brand: 'Bereket',
    category: 'Gübre',
    shortDescription: 'Genel amaçlı dengeli NPK gübre.',
    listPrice: 1250,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    productionType: 'Bitkisel üretim',
    relevantProducts: 'Buğday\nMısır',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalAdSpend: 7200,
      lastUsedAt: '2026-07-19',
      last30Days: { impressions: 3100, clicks: 210, conversions: 34 },
    },
    createdAt: '2025-09-01',
    updatedAt: '2026-07-19',
  },
  {
    id: 'prod-bg-2',
    companyId: COMPANY_IDS.bereket,
    name: 'Bereket Organik Kompost',
    brand: 'Bereket',
    category: 'Gübre',
    shortDescription: 'Toprak yapısını güçlendiren organik kompost.',
    listPrice: 890,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 3800,
      lastUsedAt: '2026-07-11',
      last30Days: { impressions: 1800, clicks: 120, conversions: 18 },
    },
    createdAt: '2026-01-10',
    updatedAt: '2026-07-11',
  },
  {
    id: 'prod-bg-3',
    companyId: COMPANY_IDS.bereket,
    name: 'Bereket Sera Mikro Element Paketi',
    brand: 'Bereket',
    category: 'Gübre',
    shortDescription: 'Sera üreticileri için dengeli mikro element karışımı.',
    listPrice: 980,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Domates\nSalatalık\nBiber',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 2900,
      lastUsedAt: '2026-07-08',
      last30Days: { impressions: 1400, clicks: 95, conversions: 12 },
    },
    createdAt: '2026-02-18',
    updatedAt: '2026-07-08',
  },
  {
    id: 'prod-an-1',
    companyId: COMPANY_IDS.agronova,
    name: 'AgroNova Fungisit Pro',
    brand: 'AgroNova',
    category: 'Bitki Koruma',
    shortDescription: 'Mantar hastalıklarına karşı koruma çözümü.',
    listPrice: 1560,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'low-stock',
    relevantProducts: 'Domates\nÜzüm',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalAdSpend: 5400,
      lastUsedAt: '2026-07-14',
      last30Days: { impressions: 2400, clicks: 165, conversions: 22 },
    },
    createdAt: '2025-12-01',
    updatedAt: '2026-07-14',
  },
  {
    id: 'prod-an-2',
    companyId: COMPANY_IDS.agronova,
    name: 'AgroNova İnsektisit Max',
    brand: 'AgroNova',
    category: 'Bitki Koruma',
    shortDescription: 'Yaprak bitlerine karşı ruhsatlı koruma ürünü.',
    listPrice: 1340,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Pamuk\nMısır',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 4100,
      lastUsedAt: '2026-07-17',
      last30Days: { impressions: 1900, clicks: 128, conversions: 17 },
    },
    createdAt: '2026-01-22',
    updatedAt: '2026-07-17',
  },
  {
    id: 'prod-an-3',
    companyId: COMPANY_IDS.agronova,
    name: 'AgroNova Herbisit Select',
    brand: 'AgroNova',
    category: 'Bitki Koruma',
    shortDescription: 'Seçici yabancı ot mücadelesi için herbisit.',
    listPrice: 1180,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Buğday\nArpa',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 3600,
      lastUsedAt: '2026-07-05',
      last30Days: { impressions: 1550, clicks: 102, conversions: 14 },
    },
    createdAt: '2026-03-03',
    updatedAt: '2026-07-05',
  },
  {
    id: 'prod-vt-1',
    companyId: COMPANY_IDS.verimli,
    name: 'Verimli Hibrit Mısır Tohumu',
    brand: 'Verimli Tohum',
    category: 'Tohum',
    shortDescription: 'Yüksek verimli hibrit mısır çeşidi.',
    listPrice: 720,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Mısır',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalAdSpend: 4800,
      lastUsedAt: '2026-07-19',
      last30Days: { impressions: 2600, clicks: 178, conversions: 29 },
    },
    createdAt: '2025-10-12',
    updatedAt: '2026-07-19',
  },
  {
    id: 'prod-vt-2',
    companyId: COMPANY_IDS.verimli,
    name: 'Verimli Domates F1 Tohumu',
    brand: 'Verimli Tohum',
    category: 'Tohum',
    shortDescription: 'Sera ve açık alan için F1 domates tohumu.',
    listPrice: 540,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'low-stock',
    relevantProducts: 'Domates',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 3100,
      lastUsedAt: '2026-07-11',
      last30Days: { impressions: 1700, clicks: 112, conversions: 19 },
    },
    createdAt: '2026-01-08',
    updatedAt: '2026-07-11',
  },
  {
    id: 'prod-vt-3',
    companyId: COMPANY_IDS.verimli,
    name: 'Verimli Ayçiçeği Tohumu',
    brand: 'Verimli Tohum',
    category: 'Tohum',
    shortDescription: 'Kuraklığa dayanıklı ayçiçeği çeşidi.',
    listPrice: 610,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Ayçiçeği',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 2700,
      lastUsedAt: '2026-07-03',
      last30Days: { impressions: 1320, clicks: 88, conversions: 11 },
    },
    createdAt: '2026-02-25',
    updatedAt: '2026-07-03',
  },
  {
    id: 'prod-as-1',
    companyId: COMPANY_IDS.anadolu,
    name: 'Anadolu Akıllı Damla Başlığı',
    brand: 'Anadolu Sulama',
    category: 'Sulama',
    shortDescription: 'Basınç dengeli akıllı damla sulama başlığı.',
    listPrice: 1850,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Domates\nBiber',
    campaignStats: {
      totalCampaigns: 2,
      activeCampaigns: 1,
      totalAdSpend: 5200,
      lastUsedAt: '2026-07-20',
      last30Days: { impressions: 2850, clicks: 196, conversions: 31 },
    },
    createdAt: '2025-11-18',
    updatedAt: '2026-07-20',
  },
  {
    id: 'prod-as-2',
    companyId: COMPANY_IDS.anadolu,
    name: 'Anadolu Yağmurlama Hortumu 50m',
    brand: 'Anadolu Sulama',
    category: 'Sulama',
    shortDescription: 'Tarla sulaması için dayanıklı yağmurlama hortumu.',
    listPrice: 990,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Buğday\nMısır',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 3400,
      lastUsedAt: '2026-07-13',
      last30Days: { impressions: 1680, clicks: 109, conversions: 15 },
    },
    createdAt: '2026-01-30',
    updatedAt: '2026-07-13',
  },
  {
    id: 'prod-as-3',
    companyId: COMPANY_IDS.anadolu,
    name: 'Anadolu Toprak Nem Sensörü',
    brand: 'Anadolu Sulama',
    category: 'Ekipman',
    shortDescription: 'Akıllı sulama kararları için toprak nem sensörü.',
    listPrice: 2750,
    currency: 'TRY',
    salesStatus: 'on-sale',
    stockStatus: 'in-stock',
    relevantProducts: 'Domates\nÜzüm',
    campaignStats: {
      totalCampaigns: 1,
      activeCampaigns: 1,
      totalAdSpend: 3900,
      lastUsedAt: '2026-07-07',
      last30Days: { impressions: 1490, clicks: 121, conversions: 18 },
    },
    createdAt: '2026-03-11',
    updatedAt: '2026-07-07',
  },
]

export const productCategories = [
  'Sulama',
  'Gübre',
  'Tohum',
  'Arıcılık',
  'Ekipman',
  'Bitki Koruma',
  'Hayvancılık',
  'Diğer',
] as const

export const productionTypeOptions = [
  'Bitkisel',
  'Hayvansal',
  'Arıcılık',
  'Karma',
] as const

export const cropOptions = [
  'Zeytin',
  'Üzüm',
  'Buğday',
  'Domates',
  'Mısır',
  'Ayçiçeği',
] as const

export const livestockOptions = [
  'Büyükbaş',
  'Küçükbaş',
  'Kanatlı',
  'Arıcılık',
] as const

export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId)
}

/** Tenant-safe lookup: returns product only when it belongs to companyId */
export function getProductForCompany(
  productId: string,
  companyId: string | null | undefined,
): Product | undefined {
  if (!companyId) return undefined
  const product = getProductById(productId)
  if (!product || product.companyId !== companyId) return undefined
  return product
}

export function getProductsForCompany(companyId: string | null | undefined): Product[] {
  if (!companyId) return []
  return products.filter((product) => product.companyId === companyId)
}

export function getProductName(productId: string): string {
  return getProductById(productId)?.name ?? 'Bilinmeyen Ürün'
}

export function getProductBrand(product: Product): string {
  return product.brand?.trim() || 'AgriGO Marka'
}

export function getProductShortDescription(product: Product): string {
  return product.shortDescription?.trim() || product.description?.trim() || ''
}

export function getProductListPrice(product: Product): number | null {
  if (product.listPrice != null && !Number.isNaN(product.listPrice)) {
    return product.listPrice
  }
  return null
}

export function getProductDiscountedPrice(product: Product): number | null {
  if (
    product.discountedPrice != null &&
    !Number.isNaN(product.discountedPrice)
  ) {
    return product.discountedPrice
  }
  return null
}
