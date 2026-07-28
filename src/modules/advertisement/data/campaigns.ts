import type {
  BulkCreative,
  Campaign,
  CampaignCreative,
  CampaignStatus,
  CampaignType,
  NativeCreative,
  NativePreviewScenario,
  SavedSegment,
} from '../types/advertisement.ts'
import { buildNativeDailyMetrics } from '../utils/campaignMetrics.ts'
import { COMPANY_IDS } from './tenant.ts'

type CampaignSeed = {
  id: string
  name: string
  productId: string
  type: CampaignType
  status: CampaignStatus
  budget: number
  createdAt: string
  impressions?: number
  clicks?: number
  conversions?: number
  companyId?: string
}

/**
 * Core seed values — status/product/budget/date/type/performance totals
 * stay the single source of truth for list, dashboard and detail.
 *
 * Status distribution:
 * Active: 7 | Draft: 3 | Pending Review: 2 | Scheduled: 1 | Paused: 1
 * Total: 14
 */
const campaignSeeds: CampaignSeed[] = [
  {
    id: 'camp-1',
    name: 'DripFlow Bahar Sulama Sezonu',
    productId: 'prod-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 8500,
    createdAt: '2026-07-18',
    impressions: 4200,
    clicks: 280,
    conversions: 42,
  },
  {
    id: 'camp-2',
    name: 'Zeytin Gübre Hasat Öncesi',
    productId: 'prod-2',
    type: 'bulk_message',
    status: 'active',
    budget: 6200,
    createdAt: '2026-07-22',
    impressions: 3100,
    clicks: 210,
    conversions: 38,
  },
  {
    id: 'camp-3',
    name: 'Damla Sulama Filtre Hatırlatma',
    productId: 'prod-1',
    type: 'bulk_message',
    status: 'active',
    budget: 4300,
    createdAt: '2026-07-10',
    impressions: 2040,
    clicks: 132,
    conversions: 26,
  },
  {
    id: 'camp-4',
    name: 'Zeytin Bahçesi Besleme Önerisi',
    productId: 'prod-2',
    type: 'native_recommendation',
    status: 'active',
    budget: 5400,
    createdAt: '2026-07-08',
    impressions: 2080,
    clicks: 146,
    conversions: 16,
  },
  {
    id: 'camp-5',
    name: 'DripFlow Bölgesel Yayılım',
    productId: 'prod-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 7800,
    createdAt: '2026-07-14',
    impressions: 1840,
    clicks: 128,
    conversions: 22,
  },
  {
    id: 'camp-6',
    name: 'Zeytin Gübre Erken Sezon',
    productId: 'prod-2',
    type: 'bulk_message',
    status: 'active',
    budget: 3200,
    createdAt: '2026-07-06',
    impressions: 1260,
    clicks: 94,
    conversions: 18,
  },
  {
    id: 'camp-7',
    name: 'Zeytin Besleme Takviye Mesajı',
    productId: 'prod-2',
    type: 'native_recommendation',
    status: 'active',
    budget: 9100,
    createdAt: '2026-07-12',
    impressions: 1600,
    clicks: 110,
    conversions: 20,
  },
  {
    id: 'camp-8',
    name: 'Buğday Tohumu Erken Sipariş Taslağı',
    productId: 'prod-3',
    type: 'native_recommendation',
    status: 'draft',
    budget: 5000,
    createdAt: '2026-07-24',
  },
  {
    id: 'camp-9',
    name: 'Varroa Sezon Koruma Taslağı',
    productId: 'prod-4',
    type: 'bulk_message',
    status: 'draft',
    budget: 3500,
    createdAt: '2026-07-23',
  },
  {
    id: 'camp-10',
    name: 'Çapa Makinesi Demo Taslağı',
    productId: 'prod-5',
    type: 'bulk_message',
    status: 'draft',
    budget: 2800,
    createdAt: '2026-07-20',
  },
  {
    id: 'camp-11',
    name: 'Buğday Tohumu İnceleme Talebi',
    productId: 'prod-3',
    type: 'native_recommendation',
    status: 'pending_review',
    budget: 6500,
    createdAt: '2026-07-19',
  },
  {
    id: 'camp-12',
    name: 'Varroa Kontrol İncelemede',
    productId: 'prod-4',
    type: 'bulk_message',
    status: 'pending_review',
    budget: 2900,
    createdAt: '2026-07-17',
  },
  {
    id: 'camp-13',
    name: 'Çapa Makinesi Ağustos Planı',
    productId: 'prod-5',
    type: 'native_recommendation',
    status: 'scheduled',
    budget: 4800,
    createdAt: '2026-07-15',
  },
  {
    id: 'camp-14',
    name: 'Çapa Makinesi Duraklatılan Kampanya',
    productId: 'prod-5',
    type: 'bulk_message',
    status: 'paused',
    budget: 3700,
    createdAt: '2026-07-01',
    impressions: 600,
    clicks: 66,
    conversions: 11,
  },
  {
    id: 'camp-bg-1',
    name: 'Bereket NPK İlkbahar Kampanyası',
    productId: 'prod-bg-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 7800,
    createdAt: '2026-07-16',
    impressions: 2800,
    clicks: 190,
    conversions: 28,
    companyId: COMPANY_IDS.bereket,
  },
  {
    id: 'camp-bg-2',
    name: 'Organik Kompost Duyurusu',
    productId: 'prod-bg-2',
    type: 'bulk_message',
    status: 'active',
    budget: 4100,
    createdAt: '2026-07-09',
    impressions: 1600,
    clicks: 98,
    conversions: 14,
    companyId: COMPANY_IDS.bereket,
  },
  {
    id: 'camp-bg-3',
    name: 'Sera Mikro Element Bahar Duyurusu',
    productId: 'prod-bg-3',
    type: 'native_recommendation',
    status: 'scheduled',
    budget: 3600,
    createdAt: '2026-07-21',
    companyId: COMPANY_IDS.bereket,
  },
  {
    id: 'camp-an-1',
    name: 'AgroNova Fungisit Sezon Kampanyası',
    productId: 'prod-an-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 6500,
    createdAt: '2026-07-12',
    impressions: 2200,
    clicks: 150,
    conversions: 20,
    companyId: COMPANY_IDS.agronova,
  },
  {
    id: 'camp-an-2',
    name: 'İnsektisit Max Pamuk Koruma',
    productId: 'prod-an-2',
    type: 'bulk_message',
    status: 'active',
    budget: 4800,
    createdAt: '2026-07-15',
    impressions: 1750,
    clicks: 118,
    conversions: 16,
    companyId: COMPANY_IDS.agronova,
  },
  {
    id: 'camp-an-3',
    name: 'Herbisit Select Buğday Sezonu',
    productId: 'prod-an-3',
    type: 'native_recommendation',
    status: 'draft',
    budget: 3900,
    createdAt: '2026-07-22',
    companyId: COMPANY_IDS.agronova,
  },
  {
    id: 'camp-vt-1',
    name: 'Hibrit Mısır Erken Sipariş',
    productId: 'prod-vt-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 5200,
    createdAt: '2026-07-14',
    impressions: 2400,
    clicks: 164,
    conversions: 27,
    companyId: COMPANY_IDS.verimli,
  },
  {
    id: 'camp-vt-2',
    name: 'Domates F1 Sera Duyurusu',
    productId: 'prod-vt-2',
    type: 'bulk_message',
    status: 'active',
    budget: 3400,
    createdAt: '2026-07-09',
    impressions: 1500,
    clicks: 98,
    conversions: 15,
    companyId: COMPANY_IDS.verimli,
  },
  {
    id: 'camp-vt-3',
    name: 'Ayçiçeği Tohumu Kurak Bölge Planı',
    productId: 'prod-vt-3',
    type: 'native_recommendation',
    status: 'pending_review',
    budget: 2900,
    createdAt: '2026-07-23',
    companyId: COMPANY_IDS.verimli,
  },
  {
    id: 'camp-as-1',
    name: 'Akıllı Damla Başlığı Sezon Açılışı',
    productId: 'prod-as-1',
    type: 'native_recommendation',
    status: 'active',
    budget: 5800,
    createdAt: '2026-07-16',
    impressions: 2650,
    clicks: 182,
    conversions: 29,
    companyId: COMPANY_IDS.anadolu,
  },
  {
    id: 'camp-as-2',
    name: 'Yağmurlama Hortumu Tarla Kampanyası',
    productId: 'prod-as-2',
    type: 'bulk_message',
    status: 'active',
    budget: 3700,
    createdAt: '2026-07-10',
    impressions: 1580,
    clicks: 104,
    conversions: 13,
    companyId: COMPANY_IDS.anadolu,
  },
  {
    id: 'camp-as-3',
    name: 'Nem Sensörü Dijital Sulama Planı',
    productId: 'prod-as-3',
    type: 'native_recommendation',
    status: 'scheduled',
    budget: 4200,
    createdAt: '2026-07-24',
    companyId: COMPANY_IDS.anadolu,
  },
]

const productSegments: Record<string, Omit<SavedSegment, 'companyId'>[]> = {
  'prod-1': [
    {
      id: 'seg-sulama-ege',
      name: 'Ege Sulama Odaklı Üreticiler',
      owner: 'brand',
      criteriaSummary: [
        'Bitkisel veya Karma üretim',
        'İzmir veya Manisa',
        'Damla sulama kullanan',
      ],
    },
  ],
  'prod-2': [
    {
      id: 'seg-zeytin-ege',
      name: 'Zeytin Bahçesi Üreticileri',
      owner: 'brand',
      criteriaSummary: [
        'Bitkisel veya Karma üretim',
        'Zeytin veya Üzüm yetiştiren',
        'İzmir veya Manisa',
      ],
    },
    {
      id: 'seg-agrigo-gubre',
      name: 'AgriGO Gübre İlgi Segmenti',
      owner: 'agrigo',
      criteriaSummary: ['Son 90 günde gübre sorusu soran', 'Aktif consent'],
    },
  ],
  'prod-3': [
    {
      id: 'seg-bugday',
      name: 'Ekmeklik Buğday Üreticileri',
      owner: 'agrigo',
      criteriaSummary: ['Bitkisel üretim', 'Buğday yetiştiren', 'İç Anadolu'],
    },
  ],
  'prod-4': [
    {
      id: 'seg-aricilik',
      name: 'Aktif Arıcı Segmenti',
      owner: 'brand',
      criteriaSummary: ['Arıcılık üretimi', 'Varroa risk dönemi'],
    },
  ],
  'prod-5': [
    {
      id: 'seg-makine',
      name: 'Küçük-Orta Ölçekli Tarla',
      owner: 'agrigo',
      criteriaSummary: ['Bitkisel üretim', 'Makine yatırımı ilgilisi'],
    },
  ],
  'prod-bg-1': [
    {
      id: 'seg-bg-npk',
      name: 'NPK Odaklı Tarla Üreticileri',
      owner: 'brand',
      criteriaSummary: ['Bitkisel üretim', 'Buğday veya Mısır', 'İç Anadolu'],
    },
    {
      id: 'seg-bg-gubre-ilgi',
      name: 'Gübre Arama Yapan Çiftçiler',
      owner: 'agrigo',
      criteriaSummary: ['Son 60 günde gübre sorusu', 'Aktif consent'],
    },
  ],
  'prod-bg-2': [
    {
      id: 'seg-bg-organik',
      name: 'Organik Toprak İyileştirme Segmenti',
      owner: 'brand',
      criteriaSummary: ['Organik tarıma açık', 'Toprak verimliliği sorunu'],
    },
  ],
  'prod-bg-3': [
    {
      id: 'seg-bg-sera',
      name: 'Sera Mikro Besleme Segmenti',
      owner: 'brand',
      criteriaSummary: ['Sera üretimi', 'Domates veya Biber'],
    },
  ],
  'prod-an-1': [
    {
      id: 'seg-an-fungisit',
      name: 'Mantar Riski Yüksek Bahçeler',
      owner: 'brand',
      criteriaSummary: ['Domates veya Üzüm', 'Nemli iklim bölgesi'],
    },
    {
      id: 'seg-an-koruma',
      name: 'Bitki Koruma İlgilileri',
      owner: 'agrigo',
      criteriaSummary: ['Son 90 günde hastalık sorusu', 'Aktif consent'],
    },
  ],
  'prod-an-2': [
    {
      id: 'seg-an-insektisit',
      name: 'Pamuk Zararlı Mücadelesi',
      owner: 'brand',
      criteriaSummary: ['Pamuk üretimi', 'Akdeniz veya Güneydoğu'],
    },
  ],
  'prod-an-3': [
    {
      id: 'seg-an-herbisit',
      name: 'Buğday Yabancı Ot Segmenti',
      owner: 'brand',
      criteriaSummary: ['Buğday veya Arpa', 'İç Anadolu'],
    },
  ],
  'prod-vt-1': [
    {
      id: 'seg-vt-misir',
      name: 'Hibrit Mısır Planlayanlar',
      owner: 'brand',
      criteriaSummary: ['Mısır üretimi', 'Erken sipariş ilgisi'],
    },
    {
      id: 'seg-vt-tarla',
      name: 'Tarla Bitkisi Tohum Segmenti',
      owner: 'agrigo',
      criteriaSummary: ['Bitkisel üretim', 'Tohum sorusu soran'],
    },
  ],
  'prod-vt-2': [
    {
      id: 'seg-vt-domates',
      name: 'Sera Domates Üreticileri',
      owner: 'brand',
      criteriaSummary: ['Domates', 'Sera veya açık alan'],
    },
  ],
  'prod-vt-3': [
    {
      id: 'seg-vt-aycicegi',
      name: 'Kurak Bölge Ayçiçeği',
      owner: 'brand',
      criteriaSummary: ['Ayçiçeği', 'Kuraklık riski yüksek iller'],
    },
  ],
  'prod-as-1': [
    {
      id: 'seg-as-damla',
      name: 'Damla Sulama Yenileme Segmenti',
      owner: 'brand',
      criteriaSummary: ['Damla sulama kullanan', 'Sera veya bahçe'],
    },
    {
      id: 'seg-as-su',
      name: 'Su Verimliliği Odaklı Üreticiler',
      owner: 'agrigo',
      criteriaSummary: ['Sulama verimliliği sorusu', 'Aktif consent'],
    },
  ],
  'prod-as-2': [
    {
      id: 'seg-as-yagmurlama',
      name: 'Yağmurlama Tarla Segmenti',
      owner: 'brand',
      criteriaSummary: ['Buğday veya Mısır', 'Açık tarla sulama'],
    },
  ],
  'prod-as-3': [
    {
      id: 'seg-as-sensor',
      name: 'Akıllı Sulama Sensör İlgilileri',
      owner: 'brand',
      criteriaSummary: ['Dijital tarım ilgisi', 'Nem takibi sorusu'],
    },
  ],
}

const naturalLanguageByProduct: Record<string, string> = {
  'prod-1':
    'Bitkisel veya Karma üretim yapan; damla sulama kullanan; İzmir veya Manisa’daki çiftçiler.',
  'prod-2':
    'Bitkisel veya Karma üretim yapan; Zeytin veya Üzüm yetiştiren; İzmir veya Manisa’daki çiftçiler.',
  'prod-3':
    'Bitkisel üretim yapan; Buğday yetiştiren; İç Anadolu’daki çiftçiler.',
  'prod-4':
    'Arıcılık yapan; aktif koloni yönetimi yapan; Ege ve Akdeniz’deki arıcılar.',
  'prod-5':
    'Bitkisel üretim yapan; sıra arası çapalama ihtiyacı olan; küçük-orta ölçekli tarla sahipleri.',
  'prod-bg-1':
    'Bitkisel üretim yapan; gübre ihtiyacı yüksek bölgelerdeki üreticiler.',
  'prod-bg-2':
    'Organik tarıma açık; toprak verimliliği sorunu yaşayan işletmeler.',
  'prod-bg-3':
    'Sera üretimi yapan; mikro element ihtiyacı olan Domates, Salatalık veya Biber üreticileri.',
  'prod-an-1':
    'Domates veya üzüm üreten; hastalık risk döneminde olan çiftçiler.',
  'prod-an-2':
    'Pamuk veya mısır üreten; zararlı mücadele döneminde olan çiftçiler.',
  'prod-an-3':
    'Buğday veya arpa üreten; yabancı ot mücadelesi planlayan üreticiler.',
  'prod-vt-1':
    'Mısır üretimi planlayan; hibrit tohum arayan tarla üreticileri.',
  'prod-vt-2':
    'Sera veya açık alanda domates üreten çiftçiler.',
  'prod-vt-3':
    'Kurak bölgelerde ayçiçeği ekecek üreticiler.',
  'prod-as-1':
    'Damla sulama kullanan; sistem yenileme ihtiyacı olan bahçe üreticileri.',
  'prod-as-2':
    'Açık tarlada yağmurlama sulama kullanan buğday veya mısır üreticileri.',
  'prod-as-3':
    'Akıllı sulama ve toprak nem takibi ile ilgilenen dijital tarım üreticileri.',
}

function buildNativeCreative(seed: CampaignSeed): NativeCreative {
  const map: Record<string, NativeCreative> = {
    'prod-1': {
      kind: 'native',
      headline: 'Sulama hattınızı sezona hazırlayın',
      recommendationText:
        'Damla sulama filtre bakımı verim kaybını azaltmaya yardımcı olabilir.',
      benefitText: 'Su kullanımını azaltmaya ve tıkanmayı önlemeye yardımcı olur.',
      ctaText: 'Ürünü İncele',
      imageLabel: 'DripFlow filtre görseli',
    },
    'prod-2': {
      kind: 'native',
      headline: 'Hasat öncesi besleme zamanı',
      recommendationText:
        'Zeytin bahçelerinde dengeli sıvı gübre uygulaması yağ kalitesini destekleyebilir.',
      benefitText: 'Verim ve yağ kalitesini destekleyen özel formülasyon.',
      ctaText: 'Detayları Gör',
      imageLabel: 'Sıvı gübre görseli',
    },
    'prod-3': {
      kind: 'native',
      headline: 'Erken sipariş avantajı',
      recommendationText:
        'Sertifikalı ekmeklik buğday tohumunda erken planlama stok riskini azaltabilir.',
      benefitText: 'Yüksek çimlenme oranı ve bölgesel uyum.',
      ctaText: 'Tohumu İncele',
    },
    'prod-5': {
      kind: 'native',
      headline: 'Sıra arası çapalama için kompakt çözüm',
      recommendationText:
        'Küçük-orta ölçekli tarlalarda kompakt çapa makinesi iş gücünü azaltabilir.',
      benefitText: 'Kompakt gövde, düşük yakıt tüketimi.',
      ctaText: 'Makineyi İncele',
      imageLabel: 'Çapa makinesi görseli',
    },
  }
  return (
    map[seed.productId] ?? {
      kind: 'native',
      headline: seed.name,
      recommendationText: 'Ürün önerisi kampanya kreatif metni.',
      benefitText: 'Kampanya fayda mesajı.',
      ctaText: 'İncele',
    }
  )
}

function buildBulkCreative(seed: CampaignSeed): BulkCreative {
  const map: Record<string, BulkCreative> = {
    'prod-1': {
      kind: 'bulk',
      messageTitle: 'Filtre bakım hatırlatması',
      messageBody:
        'Merhaba, damla sulama sezonu yaklaşırken filtre bakımı veriminizi korumaya yardımcı olabilir. DripFlow filtresini inceleyebilirsiniz.',
      ctaText: 'Ürünü Gör',
      imageLabel: 'Filtre görseli',
    },
    'prod-2': {
      kind: 'bulk',
      messageTitle: 'Hasat öncesi gübre bilgilendirmesi',
      messageBody:
        'Zeytin bahçeniz için hasat öncesi besleme döneminde Zeytin Özel Sıvı Gübre 20L seçeneğini değerlendirebilirsiniz.',
      ctaText: 'Kampanyayı Gör',
      imageLabel: 'Gübre görseli',
    },
    'prod-4': {
      kind: 'bulk',
      messageTitle: 'Varroa kontrol hatırlatması',
      messageBody:
        'Koloni sağlığı için varroa kontrol dönemini kaçırmayın. Varroa Kontrol Şeridi hakkında bilgi alabilirsiniz.',
      ctaText: 'Detaya Git',
    },
    'prod-5': {
      kind: 'bulk',
      messageTitle: 'Çapa makinesi bilgilendirmesi',
      messageBody:
        'Sıra arası çapalama işlerinizi hızlandırmak için kompakt çapa makinesi seçeneklerini inceleyebilirsiniz.',
      ctaText: 'İncele',
    },
  }
  return (
    map[seed.productId] ?? {
      kind: 'bulk',
      messageTitle: seed.name,
      messageBody: 'Kampanya toplu mesaj gövdesi.',
      ctaText: 'İncele',
    }
  )
}

function buildCreative(seed: CampaignSeed): CampaignCreative {
  return seed.type === 'native_recommendation'
    ? buildNativeCreative(seed)
    : buildBulkCreative(seed)
}

function buildNativePreviewScenarios(
  creative: NativeCreative,
): NativePreviewScenario[] {
  return [
    {
      id: 'match',
      label: 'Uygun eşleşme — öneri gösterildi',
      farmerQuestion:
        'Damla sulama sistemimde tıkanma oluyor, ne yapmalıyım?',
      aiResponse:
        'Öncelikle filtre ve damlatıcı hatlarını kontrol etmenizi öneririm. Basınç dengesini ve su kalitesini de gözden geçirmek faydalı olur.',
      showRecommendation: true,
      resultLabel: 'Öneri gösterildi',
      resultReason: 'Konu, ürün ve consent uygunluğu sağlandı.',
      creativeFit: `"${creative.headline}" kreatifi soru bağlamıyla uyumlu.`,
    },
    {
      id: 'no-consent',
      label: 'Consent uygun değil — öneri gösterilmedi',
      farmerQuestion: 'Bu sezon sulama verimini nasıl artırabilirim?',
      aiResponse:
        'Toprak nemini düzenli takip etmek ve sulama zamanlamasını bitki ihtiyacına göre ayarlamak verimi destekleyebilir.',
      showRecommendation: false,
      resultLabel: 'Öneri gösterilmedi',
      resultReason: 'Çiftçinin reklam/consent tercihi uygun değil.',
      creativeFit: 'Kreatif uygun olsa da consent engeli nedeniyle gösterilmedi.',
    },
    {
      id: 'risky',
      label: 'Riskli konu — öneri gösterilmedi',
      farmerQuestion: 'Zararlı ilaç dozunu artırarak hızlı sonuç alabilir miyim?',
      aiResponse:
        'İlaç dozunu kendi başınıza artırmanız önerilmez. Etiket talimatına ve uzman tavsiyesine uymanız gerekir.',
      showRecommendation: false,
      resultLabel: 'Öneri gösterilmedi',
      resultReason: 'Riskli konu bağlamında sponsorlu öneri bastırıldı.',
      creativeFit: 'Kampanya kreatifi bu senaryoda gösterime uygun değil.',
    },
    {
      id: 'frequency',
      label: 'Frekans limiti — öneri gösterilmedi',
      farmerQuestion: 'Filtre değişim zamanı geldi mi?',
      aiResponse:
        'Kullanım yoğunluğuna göre filtre bakım aralığını kontrol etmek iyi bir yaklaşımdır. Tıkanma artıyorsa bakımı öne alabilirsiniz.',
      showRecommendation: false,
      resultLabel: 'Öneri gösterilmedi',
      resultReason: 'Aynı oturum/dönem için frekans limiti aşıldı.',
      creativeFit: 'Kreatif uygun; frekans kuralı nedeniyle gösterilmedi.',
    },
  ]
}

function estimatedSpendFor(seed: CampaignSeed): number {
  if (seed.impressions == null) return 0
  return Math.min(seed.budget, Math.round(seed.budget * 0.62))
}

function scheduleFor(seed: CampaignSeed) {
  if (seed.status === 'draft' || seed.status === 'pending_review') {
    return { startDate: null, endDate: null }
  }
  if (seed.status === 'scheduled') {
    return { startDate: '2026-08-01', endDate: '2026-08-31' }
  }
  return {
    startDate: seed.createdAt,
    endDate: '2026-08-15',
  }
}

function segmentSizeFor(seed: CampaignSeed): {
  estimatedSegmentSize: number
  consentEligibleAudience: number
} {
  const base =
    seed.productId === 'prod-2'
      ? 5200
      : seed.productId === 'prod-1'
        ? 4100
        : seed.productId === 'prod-5'
          ? 2800
          : seed.productId === 'prod-3'
            ? 3600
            : 1900
  const consentEligibleAudience = Math.floor(base * 0.78)
  return { estimatedSegmentSize: base, consentEligibleAudience }
}

function buildCampaign(seed: CampaignSeed): Campaign {
  const companyId = seed.companyId ?? COMPANY_IDS.isleyen
  const spend = estimatedSpendFor(seed)
  const creative = buildCreative(seed)
  const sizes = segmentSizeFor(seed)
  const segments: SavedSegment[] = (productSegments[seed.productId] ?? []).map(
    (segment) => ({
      ...segment,
      companyId,
    }),
  )

  const campaign: Campaign = {
    id: seed.id,
    companyId,
    name: seed.name,
    productId: seed.productId,
    type: seed.type,
    status: seed.status,
    budget: seed.budget,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    description: `${seed.name} için hazırlanan reklam kampanyası. Bağlı ürün üzerinden hedef kitleye ulaşmayı amaçlar.`,
    impressions: seed.impressions,
    clicks: seed.clicks,
    conversions: seed.conversions,
    estimatedSpend: spend,
    schedule: scheduleFor(seed),
    segments,
    targetRules: {
      naturalLanguageSummary:
        naturalLanguageByProduct[seed.productId] ??
        'Hedef kitle kuralları tanımlı.',
      extraRules: [
        'Aktif consent zorunlu',
        'Son 30 günde aynı ürün önerisi limiti: 1',
      ],
    },
    estimatedSegmentSize: sizes.estimatedSegmentSize,
    consentEligibleAudience: sizes.consentEligibleAudience,
    creative,
  }

  if (
    seed.type === 'native_recommendation' &&
    seed.impressions != null &&
    seed.clicks != null &&
    seed.conversions != null
  ) {
    campaign.nativeDailyMetrics = buildNativeDailyMetrics(
      seed.impressions,
      seed.clicks,
      seed.conversions,
      spend,
    )
    campaign.nativePreviewScenarios = buildNativePreviewScenarios(
      creative as NativeCreative,
    )
  }

  if (seed.type === 'bulk_message') {
    const eligible = sizes.consentEligibleAudience
    // Rates chosen so funnel is consistent; spend stays aligned with seed budget usage.
    campaign.bulkPerformance = {
      eligibleAudience: eligible,
      deliveryRate: 0.84,
      readRate: 0.32,
      clickRate: 0.15,
      estimatedSpend: spend,
    }
    campaign.bulkSimulationStatus =
      seed.status === 'draft' ||
      seed.status === 'pending_review' ||
      seed.status === 'scheduled'
        ? 'not_run'
        : seed.id === 'camp-14'
          ? 'completed'
          : 'completed'
  }

  if (seed.type === 'native_recommendation') {
    campaign.nativePreviewScenarios = buildNativePreviewScenarios(
      creative as NativeCreative,
    )
  }

  return campaign
}

export const initialCampaigns: Campaign[] = campaignSeeds.map(buildCampaign)

/** Static snapshot used for non-reactive imports; prefer CampaignStore at runtime. */
export const campaigns: Campaign[] = initialCampaigns

export function getCampaignById(campaignId: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.id === campaignId)
}

export function getCampaignsByProductId(productId: string): Campaign[] {
  return campaigns.filter((campaign) => campaign.productId === productId)
}

export function createCampaignCopy(source: Campaign, newId: string): Campaign {
  const today = '2026-07-27'
  return {
    ...source,
    id: newId,
    name: `${source.name} (Kopya)`,
    status: 'draft',
    createdAt: today,
    updatedAt: today,
    schedule: { startDate: null, endDate: null },
    impressions: undefined,
    clicks: undefined,
    conversions: undefined,
    estimatedSpend: 0,
    nativeDailyMetrics: undefined,
    bulkPerformance: source.bulkPerformance
      ? {
          ...source.bulkPerformance,
          estimatedSpend: 0,
        }
      : undefined,
    bulkSimulationStatus:
      source.type === 'bulk_message' ? 'not_run' : undefined,
  }
}
