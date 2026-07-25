import type { ProductionType } from '../types/farmer.ts'

export type DemoDocument = {
  id: string
  name: string
  type: string
  date: string
  status: string
  kind: 'pdf' | 'xlsx'
  summary: string
}

const DOCUMENTS_BY_FARMER: Record<string, DemoDocument[]> = {
  '1': [
    {
      id: '1-doc-soil',
      name: 'Toprak Analizi.pdf',
      type: 'PDF',
      date: '14 Tem 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary:
        'Çumra sera parseli — pH 7.1, organik madde %2.4, potasyum orta. Domates besleme önerisi içerir.',
    },
    {
      id: '1-doc-cks',
      name: 'ÇKS Belgesi.pdf',
      type: 'PDF',
      date: '2 Mar 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: '40 dönüm sera/açık alan ÇKS kayıt özeti (demo).',
    },
    {
      id: '1-doc-fert',
      name: 'Gübreleme Planı.pdf',
      type: 'PDF',
      date: '20 Şub 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Damla sulama ile entegre sezonluk gübreleme planı.',
    },
    {
      id: '1-doc-leaf',
      name: 'Yaprak Örnek Fotoğrafı.pdf',
      type: 'PDF',
      date: '19 Tem 2026',
      status: 'İncelemede',
      kind: 'pdf',
      summary: 'Domates yaprağı lekelenme görseli — AI hastalık sinyali ile ilişkili.',
    },
  ],
  '2': [
    {
      id: '2-doc-vet',
      name: 'Veteriner Kontrol.pdf',
      type: 'PDF',
      date: '12 Tem 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Holstein sürü sağlık kontrolü; soğutma tankı hijyen notu.',
    },
    {
      id: '2-doc-biz',
      name: 'İşletme Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '12 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '42 baş süt işletmesi kayıt özeti.',
    },
    {
      id: '2-doc-vax',
      name: 'Aşı Takibi.pdf',
      type: 'PDF',
      date: '10 Şub 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Sürü aşı takvimi — düzenli takip kaydı.',
    },
    {
      id: '2-doc-count',
      name: 'Hayvan Sayım.xlsx',
      type: 'Excel',
      date: '5 Şub 2026',
      status: 'Güncel',
      kind: 'xlsx',
      summary: 'Holstein kategori bazlı sayım tablosu.',
    },
  ],
  '3': [
    {
      id: '3-doc-honey',
      name: 'Bal Analiz Sonucu.pdf',
      type: 'PDF',
      date: '8 Tem 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Kestane-ıhlamur çiçek balı analiz parametreleri.',
    },
    {
      id: '3-doc-reg',
      name: 'Arıcı Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '8 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '120 kovan gezginci işletme kayıt özeti.',
    },
    {
      id: '3-doc-inv',
      name: 'Kovan Envanteri.xlsx',
      type: 'Excel',
      date: '1 Mar 2026',
      status: 'Güncel',
      kind: 'xlsx',
      summary: 'Kovan adedi ve Ordu–Samsun hat dağılımı.',
    },
    {
      id: '3-doc-permit',
      name: 'Gezginci Arıcılık İzni.pdf',
      type: 'PDF',
      date: '4 Şub 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Gezginci hat izin geçerlilik bilgileri.',
    },
  ],
  '4': [
    {
      id: '4-doc-cks',
      name: 'ÇKS Belgesi.pdf',
      type: 'PDF',
      date: '9 Tem 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '55 dönüm buğday parseli ÇKS kaydı.',
    },
    {
      id: '4-doc-biz',
      name: 'İşletme Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '9 Mar 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Buğday + 65 baş İvesi karma işletme kaydı.',
    },
    {
      id: '4-doc-soil',
      name: 'Toprak Analizi.pdf',
      type: 'PDF',
      date: '11 Şub 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Alüvyal toprak — buğday için azot/fosfor önerileri.',
    },
    {
      id: '4-doc-ins',
      name: 'Bitkisel Sigorta Poliçesi.pdf',
      type: 'PDF',
      date: '18 May 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Poliçe bitiş 30 Eyl 2026 — bitkisel ürün sigortası.',
    },
  ],
  '5': [
    {
      id: '5-doc-fert',
      name: 'Gübreleme Planı.pdf',
      type: 'PDF',
      date: '8 Tem 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: '72 dönüm mısır — pivot sulama ile uyumlu gübreleme planı.',
    },
    {
      id: '5-doc-cks',
      name: 'ÇKS Belgesi.pdf',
      type: 'PDF',
      date: '2 Mar 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Karacabey mısır parseli ÇKS özeti.',
    },
    {
      id: '5-doc-soil',
      name: 'Toprak Analizi.pdf',
      type: 'PDF',
      date: '14 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Tınlı toprak — mısır besin dengesi özeti.',
    },
    {
      id: '5-doc-irr',
      name: 'Sulama Raporu.pdf',
      type: 'PDF',
      date: '7 Şub 2026',
      status: 'Taslak',
      kind: 'pdf',
      summary: 'Pivot çalışma süresi ve su tüketimi taslak raporu.',
    },
  ],
  '6': [
    {
      id: '6-doc-vax',
      name: 'Aşı Takibi.pdf',
      type: 'PDF',
      date: '12 Tem 2026',
      status: 'Taslak',
      kind: 'pdf',
      summary: 'Kıvırcık sürü aşı takvimi — kısmi kayıt, tamamlanmayı bekliyor.',
    },
    {
      id: '6-doc-biz',
      name: 'İşletme Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '12 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '85 baş koyun işletmesi kayıt özeti.',
    },
    {
      id: '6-doc-vet',
      name: 'Veteriner Kontrol.pdf',
      type: 'PDF',
      date: '28 Şub 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Son veteriner kontrol notları; sağlık kaydı eksikleri işaretli.',
    },
    {
      id: '6-doc-count',
      name: 'Hayvan Sayım.xlsx',
      type: 'Excel',
      date: '5 Şub 2026',
      status: 'Güncel',
      kind: 'xlsx',
      summary: 'Kategori bazlı Kıvırcık sayım tablosu.',
    },
  ],
  '7': [
    {
      id: '7-doc-permit',
      name: 'Gezginci Arıcılık İzni.pdf',
      type: 'PDF',
      date: '8 Tem 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Muğla içi kısa mesafe gezginci izin belgesi.',
    },
    {
      id: '7-doc-reg',
      name: 'Arıcı Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '8 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '85 kovan çam balı işletme kaydı.',
    },
    {
      id: '7-doc-inv',
      name: 'Kovan Envanteri.xlsx',
      type: 'Excel',
      date: '1 Mar 2026',
      status: 'Güncel',
      kind: 'xlsx',
      summary: 'Kovan adedi ve ürün dağılımı.',
    },
    {
      id: '7-doc-label',
      name: 'Ürün Etiket Taslağı.pdf',
      type: 'PDF',
      date: '16 Tem 2026',
      status: 'İncelemede',
      kind: 'pdf',
      summary: 'Online satış kavanoz etiket görseli — AI uygunluk skoru ile ilişkili.',
    },
  ],
  '8': [
    {
      id: '8-doc-biz',
      name: 'İşletme Kayıt Belgesi.pdf',
      type: 'PDF',
      date: '10 Tem 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: 'Elma bahçesi + 40 kovan karma işletme kaydı.',
    },
    {
      id: '8-doc-cks',
      name: 'ÇKS Belgesi.pdf',
      type: 'PDF',
      date: '15 Mar 2026',
      status: 'Doğrulandı',
      kind: 'pdf',
      summary: '32 dönüm elma parseli ÇKS özeti.',
    },
    {
      id: '8-doc-hive',
      name: 'Kovan Envanteri.xlsx',
      type: 'Excel',
      date: '22 Şub 2026',
      status: 'Güncel',
      kind: 'xlsx',
      summary: 'Bahçe altı 40 kovan envanteri.',
    },
    {
      id: '8-doc-soil',
      name: 'Toprak Analizi.pdf',
      type: 'PDF',
      date: '11 Şub 2026',
      status: 'Güncel',
      kind: 'pdf',
      summary: 'Kumlu-tınlı toprak — elma için pH ve organik madde notları.',
    },
  ],
}

const FALLBACK_BY_TYPE: Record<ProductionType, DemoDocument[]> = {
  Bitkisel: DOCUMENTS_BY_FARMER['1'],
  Hayvansal: DOCUMENTS_BY_FARMER['2'],
  Arıcılık: DOCUMENTS_BY_FARMER['3'],
  Karma: DOCUMENTS_BY_FARMER['4'],
}

export function getDocumentsForFarmer(
  farmerId: string,
  productionType: ProductionType,
): DemoDocument[] {
  return DOCUMENTS_BY_FARMER[farmerId] ?? FALLBACK_BY_TYPE[productionType]
}

/** @deprecated Prefer getDocumentsForFarmer — kept for transitional call sites */
export function getDocumentsForProductionType(
  productionType: ProductionType,
): DemoDocument[] {
  return FALLBACK_BY_TYPE[productionType]
}

export function getDocumentById(
  farmerId: string,
  productionType: ProductionType,
  documentId: string,
): DemoDocument | undefined {
  return getDocumentsForFarmer(farmerId, productionType).find(
    (document) => document.id === documentId,
  )
}
