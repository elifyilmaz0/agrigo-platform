import type {
  AudienceKpis,
  AudienceSegmentRecord,
  CompanyAudienceDataset,
} from '../types/audience.ts'
import { COMPANY_IDS } from './tenant.ts'

function computeKpis(segments: AudienceSegmentRecord[]): AudienceKpis {
  const totalSegments = segments.length
  const activeSegments = segments.filter((s) => s.status === 'active').length
  const usedInCampaigns = segments.filter((s) => s.campaignUsageCount > 0).length
  const averageSegmentSize =
    totalSegments === 0
      ? 0
      : Math.round(
          segments.reduce((sum, s) => sum + s.estimatedSize, 0) / totalSegments,
        )
  return {
    totalSegments,
    activeSegments,
    usedInCampaigns,
    averageSegmentSize,
  }
}

function buildDataset(
  companyId: string,
  segments: AudienceSegmentRecord[],
  aiInsights: string[],
): CompanyAudienceDataset {
  return {
    id: `audience-${companyId}`,
    companyId,
    segments,
    kpis: computeKpis(segments),
    aiInsights,
  }
}

const audienceDatasets: CompanyAudienceDataset[] = [
  buildDataset(
    COMPANY_IDS.isleyen,
    [
      {
        id: 'aud-it-1',
        companyId: COMPANY_IDS.isleyen,
        name: 'Ege Sulama Odaklı Üreticiler',
        description:
          'İzmir ve Manisa’da damla sulama kullanan bitkisel üretim işletmeleri.',
        estimatedSize: 18200,
        updatedAt: '2026-07-20',
        createdAt: '2026-05-12',
        campaignUsageCount: 4,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel / Karma' },
          { label: 'İl', value: 'İzmir, Manisa' },
          { label: 'Sulama yöntemi', value: 'Damla sulama' },
          { label: 'Ürün grubu', value: 'Bahçe / Tarla' },
        ],
      },
      {
        id: 'aud-it-2',
        companyId: COMPANY_IDS.isleyen,
        name: 'Zeytin Bahçesi Üreticileri',
        description:
          'Zeytin ve üzüm odaklı Ege bahçe üreticileri için besleme segmenti.',
        estimatedSize: 12400,
        updatedAt: '2026-07-18',
        createdAt: '2026-04-02',
        campaignUsageCount: 3,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'İl', value: 'İzmir, Manisa, Aydın' },
          { label: 'Ürün grubu', value: 'Zeytin, Üzüm' },
          { label: 'Sulama yöntemi', value: 'Damla / Yağmurlama' },
        ],
      },
      {
        id: 'aud-it-3',
        companyId: COMPANY_IDS.isleyen,
        name: 'Aktif Arıcı Segmenti',
        description: 'Varroa risk döneminde olan kayıtlı arıcılık işletmeleri.',
        estimatedSize: 4650,
        updatedAt: '2026-07-12',
        createdAt: '2026-06-01',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Arıcılık' },
          { label: 'Hayvancılık', value: 'Arıcılık' },
          { label: 'İl', value: 'Türkiye geneli' },
        ],
      },
      {
        id: 'aud-it-4',
        companyId: COMPANY_IDS.isleyen,
        name: 'Küçük-Orta Ölçekli Tarla',
        description:
          'Makine yatırımı ilgilisi olan küçük-orta ölçekli tarla üreticileri.',
        estimatedSize: 9800,
        updatedAt: '2026-07-05',
        createdAt: '2026-03-18',
        campaignUsageCount: 0,
        status: 'draft',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Tarla bitkileri' },
          { label: 'İl', value: 'İç Anadolu, Ege' },
        ],
      },
      {
        id: 'aud-it-5',
        companyId: COMPANY_IDS.isleyen,
        name: 'Sigortası Bulunmayan Üreticiler',
        description:
          'Tarım sigortası olmayan veya süresi dolmuş kayıtlı üreticiler.',
        estimatedSize: 21300,
        updatedAt: '2026-06-28',
        createdAt: '2026-02-10',
        campaignUsageCount: 0,
        status: 'inactive',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel / Hayvansal' },
          { label: 'İl', value: 'Türkiye geneli' },
          { label: 'Sigorta', value: 'Sigortasız / Süresi dolmuş' },
        ],
      },
    ],
    [
      'Ege Sulama segmenti aktif kampanyalarda en yüksek kullanım oranına sahip.',
      'Arıcı segmenti dar ama yüksek niyetli; sezonluk bütçe artışı değerlendirilebilir.',
      'Sigortasız üreticiler segmenti pasif; yeniden etkinleştirme için kural güncellemesi önerilir.',
    ],
  ),
  buildDataset(
    COMPANY_IDS.bereket,
    [
      {
        id: 'aud-bg-1',
        companyId: COMPANY_IDS.bereket,
        name: 'NPK Odaklı Tarla Üreticileri',
        description:
          'Buğday ve mısır için dengeli gübre arayan İç Anadolu üreticileri.',
        estimatedSize: 8600,
        updatedAt: '2026-07-16',
        createdAt: '2026-05-20',
        campaignUsageCount: 2,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Buğday, Mısır' },
          { label: 'İl', value: 'İç Anadolu' },
          { label: 'Sulama yöntemi', value: 'Yağmurlama / Kuru tarım' },
        ],
      },
      {
        id: 'aud-bg-2',
        companyId: COMPANY_IDS.bereket,
        name: 'Organik Toprak İyileştirme Segmenti',
        description:
          'Organik tarıma açık ve toprak verimliliği sorunu olan işletmeler.',
        estimatedSize: 5400,
        updatedAt: '2026-07-14',
        createdAt: '2026-06-08',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Organik / Açık alan' },
          { label: 'İl', value: 'Ege, Marmara' },
        ],
      },
      {
        id: 'aud-bg-3',
        companyId: COMPANY_IDS.bereket,
        name: 'Sera Mikro Besleme Segmenti',
        description: 'Domates ve biber seralarında mikro element ihtiyacı olanlar.',
        estimatedSize: 4200,
        updatedAt: '2026-07-09',
        createdAt: '2026-04-22',
        campaignUsageCount: 0,
        status: 'draft',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel (Sera)' },
          { label: 'Ürün grubu', value: 'Domates, Biber' },
          { label: 'İl', value: 'Antalya, Mersin' },
          { label: 'Sulama yöntemi', value: 'Damla sulama' },
        ],
      },
      {
        id: 'aud-bg-4',
        companyId: COMPANY_IDS.bereket,
        name: 'Gübre Arama Yapan Çiftçiler',
        description:
          'Son 60 günde gübre sorusu soran ve consent’i aktif çiftçiler.',
        estimatedSize: 11200,
        updatedAt: '2026-07-21',
        createdAt: '2026-07-01',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel / Karma' },
          { label: 'İl', value: 'Türkiye geneli' },
          { label: 'Dijital davranış', value: 'Gübre araması (60 gün)' },
        ],
      },
    ],
    [
      'NPK odaklı segment NPK İlkbahar kampanyasının ana kitlesini oluşturuyor.',
      'Organik Kompost kampanyası bu segmentte düşük dönüşüm üretiyor; kural daraltılabilir.',
      'Sera Mikro Besleme taslağı planlı kampanyaya bağlanmaya hazır.',
    ],
  ),
  buildDataset(
    COMPANY_IDS.agronova,
    [
      {
        id: 'aud-an-1',
        companyId: COMPANY_IDS.agronova,
        name: 'Mantar Riski Yüksek Bahçeler',
        description:
          'Nemli bölgelerde domates ve üzüm üreten, mantar riski yüksek işletmeler.',
        estimatedSize: 7300,
        updatedAt: '2026-07-13',
        createdAt: '2026-05-05',
        campaignUsageCount: 2,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Domates, Üzüm' },
          { label: 'İl', value: 'Karadeniz, Marmara' },
          { label: 'Sulama yöntemi', value: 'Damla / Yağmurlama' },
        ],
      },
      {
        id: 'aud-an-2',
        companyId: COMPANY_IDS.agronova,
        name: 'Pamuk Zararlı Mücadelesi',
        description:
          'Pamuk üretiminde zararlı mücadelesi planlayan tarla işletmeleri.',
        estimatedSize: 5100,
        updatedAt: '2026-07-16',
        createdAt: '2026-06-12',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Pamuk' },
          { label: 'İl', value: 'Şanlıurfa, Diyarbakır, Adana' },
        ],
      },
      {
        id: 'aud-an-3',
        companyId: COMPANY_IDS.agronova,
        name: 'Bitki Koruma İlgilileri',
        description:
          'Son 90 günde hastalık / zararlı sorusu soran consent’li üreticiler.',
        estimatedSize: 9400,
        updatedAt: '2026-07-19',
        createdAt: '2026-03-30',
        campaignUsageCount: 0,
        status: 'inactive',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel / Karma' },
          { label: 'İl', value: 'Türkiye geneli' },
          { label: 'Dijital davranış', value: 'Hastalık sorusu (90 gün)' },
        ],
      },
      {
        id: 'aud-an-4',
        companyId: COMPANY_IDS.agronova,
        name: 'Buğday Herbisit Sezonu',
        description: 'Buğday alanlarında yabancı ot mücadelesi planlayanlar.',
        estimatedSize: 6800,
        updatedAt: '2026-07-22',
        createdAt: '2026-07-10',
        campaignUsageCount: 0,
        status: 'draft',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Buğday' },
          { label: 'İl', value: 'İç Anadolu, Trakya' },
        ],
      },
    ],
    [
      'Fungisit sezon kampanyası mantar riski segmentinde istikrarlı tıklama üretiyor.',
      'Pamuk zararlı mücadelesi segmenti bölgesel olarak dar ama yüksek niyetli.',
      'Bitki Koruma İlgilileri pasif; yeniden aktivasyon CTR’yi artırabilir.',
    ],
  ),
  buildDataset(
    COMPANY_IDS.verimli,
    [
      {
        id: 'aud-vt-1',
        companyId: COMPANY_IDS.verimli,
        name: 'Hibrit Mısır Planlayanlar',
        description: 'Sezon öncesi hibrit mısır tohumu arayan üreticiler.',
        estimatedSize: 6900,
        updatedAt: '2026-07-14',
        createdAt: '2026-04-15',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Mısır' },
          { label: 'İl', value: 'Çukurova, İç Anadolu' },
          { label: 'Sulama yöntemi', value: 'Yağmurlama / Damla' },
        ],
      },
      {
        id: 'aud-vt-2',
        companyId: COMPANY_IDS.verimli,
        name: 'Domates Tohumu Segmenti',
        description: 'Sera ve açık alan domates tohumu arayan üreticiler.',
        estimatedSize: 5400,
        updatedAt: '2026-07-12',
        createdAt: '2026-05-28',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel (Sera / Açık alan)' },
          { label: 'Ürün grubu', value: 'Domates' },
          { label: 'İl', value: 'Antalya, Mersin, İzmir' },
        ],
      },
      {
        id: 'aud-vt-3',
        companyId: COMPANY_IDS.verimli,
        name: 'Ayçiçeği Kurak Bölge',
        description: 'Kurak bölgelerde ayçiçeği ekimi planlayan üreticiler.',
        estimatedSize: 4100,
        updatedAt: '2026-07-23',
        createdAt: '2026-07-08',
        campaignUsageCount: 0,
        status: 'draft',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Ürün grubu', value: 'Ayçiçeği' },
          { label: 'İl', value: 'Trakya, İç Anadolu' },
          { label: 'Sulama yöntemi', value: 'Kuru tarım / Yağmurlama' },
        ],
      },
      {
        id: 'aud-vt-4',
        companyId: COMPANY_IDS.verimli,
        name: 'Sertifikalı Tohum İlgilileri',
        description:
          'Sertifikalı tohum arayan ve dijital katalog inceleyen üreticiler.',
        estimatedSize: 8700,
        updatedAt: '2026-06-30',
        createdAt: '2026-02-20',
        campaignUsageCount: 0,
        status: 'inactive',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'İl', value: 'Türkiye geneli' },
          { label: 'Dijital davranış', value: 'Tohum kataloğu incelemesi' },
        ],
      },
    ],
    [
      'Hibrit Mısır segmenti erken sipariş kampanyasının ana dönüşüm kaynağı.',
      'Domates F1 sera segmentinde okunma oranı yüksek; bütçe artışı düşünülebilir.',
      'Ayçiçeği kurak bölge segmenti inceleme bekleyen kampanyaya bağlanmaya hazır.',
    ],
  ),
  buildDataset(
    COMPANY_IDS.anadolu,
    [
      {
        id: 'aud-as-1',
        companyId: COMPANY_IDS.anadolu,
        name: 'Damla Sulama Yenileme Segmenti',
        description: 'Damla sulama sistemi yenileyecek bahçe üreticileri.',
        estimatedSize: 7800,
        updatedAt: '2026-07-17',
        createdAt: '2026-04-08',
        campaignUsageCount: 2,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Sulama yöntemi', value: 'Damla sulama' },
          { label: 'İl', value: 'Ege, Akdeniz' },
          { label: 'Ürün grubu', value: 'Bahçe bitkileri' },
        ],
      },
      {
        id: 'aud-as-2',
        companyId: COMPANY_IDS.anadolu,
        name: 'Yağmurlama Tarla Segmenti',
        description:
          'Geniş tarla alanlarında yağmurlama sistemi kullanan veya planlayanlar.',
        estimatedSize: 6200,
        updatedAt: '2026-07-10',
        createdAt: '2026-05-15',
        campaignUsageCount: 1,
        status: 'active',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Sulama yöntemi', value: 'Yağmurlama' },
          { label: 'İl', value: 'İç Anadolu, Trakya' },
          { label: 'Ürün grubu', value: 'Tarla bitkileri' },
        ],
      },
      {
        id: 'aud-as-3',
        companyId: COMPANY_IDS.anadolu,
        name: 'Akıllı Sulama İlgilileri',
        description:
          'Nem sensörü ve dijital sulama çözümleriyle ilgilenen üreticiler.',
        estimatedSize: 3900,
        updatedAt: '2026-07-19',
        createdAt: '2026-06-20',
        campaignUsageCount: 0,
        status: 'draft',
        rules: [
          { label: 'Üretim tipi', value: 'Bitkisel' },
          { label: 'Sulama yöntemi', value: 'Damla + sensör' },
          { label: 'Dijital davranış', value: 'Akıllı sulama ilgisi' },
          { label: 'İl', value: 'Ege, Akdeniz, İç Anadolu' },
        ],
      },
      {
        id: 'aud-as-4',
        companyId: COMPANY_IDS.anadolu,
        name: 'Hayvancılık Sulama İşletmeleri',
        description:
          'Hayvancılık tesislerinde sulama / yemlik su sistemi ihtiyacı olanlar.',
        estimatedSize: 2800,
        updatedAt: '2026-06-25',
        createdAt: '2026-03-05',
        campaignUsageCount: 0,
        status: 'inactive',
        rules: [
          { label: 'Üretim tipi', value: 'Hayvansal' },
          { label: 'Hayvancılık', value: 'Büyükbaş / Küçükbaş' },
          { label: 'İl', value: 'Doğu Anadolu, İç Anadolu' },
        ],
      },
    ],
    [
      'Damla sulama yenileme segmenti sezon açılış kampanyasında güçlü dönüşüm sağlıyor.',
      'Yağmurlama tarla segmentinde CTR hedef altında; coğrafi daraltma denenebilir.',
      'Akıllı sulama ilgilileri taslağı planlı nem sensörü kampanyasına uygun.',
    ],
  ),
]

const audienceByCompanyId: Record<string, CompanyAudienceDataset> =
  Object.fromEntries(
    audienceDatasets.map((dataset) => [dataset.companyId, dataset]),
  )

export function getAudienceDatasetForCompany(
  companyId: string | null | undefined,
): CompanyAudienceDataset | undefined {
  if (!companyId) return undefined
  return audienceByCompanyId[companyId]
}

export function getEmptyAudienceDataset(
  companyId: string | null = null,
): CompanyAudienceDataset {
  return {
    id: 'audience-empty',
    companyId: companyId ?? '',
    segments: [],
    kpis: {
      totalSegments: 0,
      activeSegments: 0,
      usedInCampaigns: 0,
      averageSegmentSize: 0,
    },
    aiInsights: [],
  }
}
