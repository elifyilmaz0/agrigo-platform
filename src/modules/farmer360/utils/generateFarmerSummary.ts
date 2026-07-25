import type { Farmer } from '../types/farmer.ts'
import {
  calculateProfileCompleteness,
  isMeaningfulValue,
} from './calculateProfileCompleteness.ts'
import { getCriticalMissingFields } from './getCriticalMissingFields.ts'
import { getActiveRisks } from './getActiveRisks.ts'

export interface FarmerSummaryObservation {
  id: string
  text: string
  category: 'profile' | 'production' | 'finance' | 'insurance' | 'data_quality'
}

export interface FarmerSummaryInterpretation {
  id: string
  text: string
  tone: 'positive' | 'warning' | 'neutral'
}

export interface FarmerSummaryResult {
  headline: string
  description: string
  observations: FarmerSummaryObservation[]
  interpretations: FarmerSummaryInterpretation[]
}

type NarrativeFocus =
  | 'production'
  | 'communication'
  | 'finance'
  | 'insurance'
  | 'commercial'
  | 'profile'

type ObservationCandidate = FarmerSummaryObservation & {
  weight: number
  focus: NarrativeFocus
}

type InterpretationCandidate = FarmerSummaryInterpretation & {
  weight: number
}

function hashSeed(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

function pickVariant<T>(variants: readonly T[], seed: number, salt: number): T {
  return variants[(seed + salt) % variants.length]
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

function hasCreditNeed(creditNeed: string): boolean {
  if (!isMeaningfulValue(creditNeed)) {
    return false
  }

  const normalized = normalizeText(creditNeed)
  return normalized === 'var' || normalized === 'evet' || normalized === 'ihtiyaç var'
}

function hasNoCreditNeed(creditNeed: string): boolean {
  if (!isMeaningfulValue(creditNeed)) {
    return false
  }

  const normalized = normalizeText(creditNeed)
  return (
    normalized === 'yok' ||
    normalized === 'hayır' ||
    normalized === 'ihtiyaç yok'
  )
}

function isActiveInsurance(status: string): boolean {
  return isMeaningfulValue(status) && normalizeText(status) === 'aktif'
}

function isRegularCommunication(frequency: string): boolean {
  if (!isMeaningfulValue(frequency)) {
    return false
  }

  const normalized = normalizeText(frequency)
  return (
    normalized.includes('hafta') ||
    normalized.includes('gün') ||
    normalized.includes('düzenli')
  )
}

function isDigitalChannel(channel: string): boolean {
  if (!isMeaningfulValue(channel)) {
    return false
  }

  const normalized = normalizeText(channel)
  return (
    normalized.includes('whatsapp') ||
    normalized.includes('online') ||
    normalized.includes('dijital')
  )
}

function isCooperativeChannel(salesChannel: string): boolean {
  if (!isMeaningfulValue(salesChannel)) {
    return false
  }

  return normalizeText(salesChannel).includes('kooperatif')
}

function resolveNarrativeFocus(
  farmer: Farmer,
  seed: number,
  risks: ReturnType<typeof getActiveRisks>,
  missingFields: ReturnType<typeof getCriticalMissingFields>,
  commercialSufficient: boolean,
): NarrativeFocus {
  const candidates: NarrativeFocus[] = []

  if (risks.some((risk) => risk.category === 'insurance')) {
    candidates.push('insurance')
  }

  if (risks.some((risk) => risk.category === 'finance') || hasCreditNeed(farmer.finance.creditNeed)) {
    candidates.push('finance')
  }

  if (
    risks.some((risk) => risk.category === 'production') ||
    isMeaningfulValue(farmer.production.product)
  ) {
    candidates.push('production')
  }

  if (isRegularCommunication(farmer.communication.frequency)) {
    candidates.push('communication')
  }

  if (commercialSufficient && isMeaningfulValue(farmer.production.salesChannel)) {
    candidates.push('commercial')
  }

  if (missingFields.length === 0) {
    candidates.push('profile')
  }

  if (candidates.length === 0) {
    return pickVariant(
      ['production', 'communication', 'finance', 'profile'] as const,
      seed,
      11,
    )
  }

  return candidates[seed % candidates.length]
}

function focusRank(focus: NarrativeFocus, primary: NarrativeFocus): number {
  if (focus === primary) {
    return 0
  }

  const order: NarrativeFocus[] = [
    primary,
    'production',
    'communication',
    'finance',
    'insurance',
    'commercial',
    'profile',
  ]

  const index = order.indexOf(focus)
  return index === -1 ? 99 : index
}

function buildHeadline(farmer: Farmer, seed: number, focus: NarrativeFocus): string {
  const product = isMeaningfulValue(farmer.production.product)
    ? farmer.production.product
    : null

  const byFocus: Record<NarrativeFocus, readonly string[]> = {
    production: [
      product ? `${product} odaklı üretim okuması` : 'Üretim yapısına dair kısa okuma',
      'Saha ve üretim profiline bakış',
      product ? `${product} üretiminde güncel durum` : 'Üretim kayıtlarının kısa özeti',
      'Üretim kapasitesi ve saha görünümü',
    ],
    communication: [
      'İletişim ritmine göre profil okuması',
      'Görüşme geçmişinden çıkan tablo',
      'İletişim ve takip yoğunluğu özeti',
      'CRM temas geçmişine dayalı kısa not',
    ],
    finance: [
      'Finansal açıdan kısa profil okuması',
      'Gelir ve finans sinyallerine bakış',
      'Finans kayıtlarından çıkan tablo',
      'Maliyet ve finans görünümü',
    ],
    insurance: [
      'Sigorta tarafında dikkat çeken noktalar',
      'Koruma ve poliçe kayıtlarına bakış',
      'Sigorta durumuna dair kısa okuma',
      'Risk koruması açısından profil notu',
    ],
    commercial: [
      'Ticari eşleştirme potansiyeline bakış',
      'Satış kanalı ve pazar erişimi özeti',
      'Ticari fırsat çerçevesinde kısa not',
      'Pazar bağlantısı açısından profil okuması',
    ],
    profile: [
      'Profil bütünlüğüne dair kısa okuma',
      'Mevcut kayıtların genel görünümü',
      'Sistem kayıtları doğrultusunda özet',
      'Çok boyutlu profil incelemesi',
    ],
  }

  return pickVariant(byFocus[focus], seed, 3)
}

function buildDescription(
  farmer: Farmer,
  seed: number,
  focus: NarrativeFocus,
): string {
  const name = farmer.fullName
  const province = isMeaningfulValue(farmer.province) ? farmer.province : null
  const product = isMeaningfulValue(farmer.production.product)
    ? farmer.production.product
    : null
  const productionType = isMeaningfulValue(farmer.productionType)
    ? farmer.productionType
    : null
  const frequency = isMeaningfulValue(farmer.communication.frequency)
    ? farmer.communication.frequency
    : null
  const channel = isMeaningfulValue(farmer.preferredChannel)
    ? farmer.preferredChannel
    : null

  const intros: string[] = []

  if (province && product) {
    intros.push(
      `İlk incelemede ${province} merkezli ${product} üretimi yapan ${name} profili, mevcut kayıtlar doğrultusunda ele alındı.`,
      `Üretim yapısına bakıldığında ${name}, ${province}'da ${product} hattında ilerleyen bir üretici olarak görünüyor.`,
      `Profil incelendiğinde ${name}'ın ${province} içindeki ${product} faaliyetleri net bir çerçeve çiziyor.`,
      `Sistem kayıtları doğrultusunda ${name}; ${province} ve ${product} kombinasyonuyla özetlenebilir.`,
    )
  }

  if (province && productionType) {
    intros.push(
      `Mevcut profil yapısı ${name}'ı ${province}'da ${productionType.toLocaleLowerCase('tr-TR')} üretim tarafında konumlandırıyor.`,
      `${name} için ${province} kayıtları, ${productionType.toLocaleLowerCase('tr-TR')} üretim tipiyle birlikte okundu.`,
    )
  }

  if (product && !province) {
    intros.push(
      `Üretim yapısına bakıldığında ${name}, ${product} odaklı bir faaliyet hattı taşıyor.`,
      `Mevcut verilere göre ${name}'ın ana ürün ekseni ${product} olarak kayda geçmiş.`,
    )
  }

  if (frequency) {
    intros.push(
      `İletişim geçmişi değerlendirildiğinde ${name} ile temas ritmi ${frequency.toLocaleLowerCase('tr-TR')} düzeyinde.`,
      `CRM kayıtlarında ${name} için ${frequency.toLocaleLowerCase('tr-TR')} bir görüşme temposu görülüyor.`,
    )
  }

  if (channel) {
    intros.push(
      `Mevcut kayıtlara göre ${name} ile tercih edilen kanal ${channel}; bu da takip biçimini şekillendiriyor.`,
      `İlk bakışta ${name} profilinde ${channel} üzerinden yürüyen bir iletişim tercihi dikkat çekiyor.`,
    )
  }

  if (focus === 'finance') {
    intros.push(
      `Finansal açıdan ${name} profili, gelir ve ihtiyaç sinyalleriyle birlikte okundu.`,
      `Mevcut finans kayıtları doğrultusunda ${name} için maliyet ve kredi tarafı ayrıca incelendi.`,
    )
  }

  if (focus === 'insurance') {
    intros.push(
      `Sigorta tarafında ${name} kaydı, koruma durumu üzerinden kısa bir okumaya alındı.`,
      `Mevcut verilere göre ${name} için poliçe ve yenileme alanı ayrıca mercek altına alındı.`,
    )
  }

  if (focus === 'commercial') {
    intros.push(
      `Ticari açıdan ${name} profili, satış kanalı ve ürün bilgisiyle birlikte ele alındı.`,
      `Pazar erişimi çerçevesinde ${name} için mevcut üretim ve satış kayıtları birlikte okundu.`,
    )
  }

  intros.push(
    `Mevcut CRM kayıtları doğrultusunda ${name} için üretim, finans ve iletişim sinyalleri birlikte okundu.`,
    `Profil incelendiğinde ${name}'a dair kısa bir operasyonel özet çıkarıldı.`,
    `Sistem kayıtları doğrultusunda ${name} için çok boyutlu bir durum notu hazırlandı.`,
    `İlk incelemede ${name} profili; üretim, finans ve koruma alanları üzerinden sadeleştirildi.`,
    `Mevcut verilere göre ${name} için güncel bir operasyonel okuma oluşturuldu.`,
  )

  return pickVariant(intros, seed, 7)
}

function buildObservationCandidates(farmer: Farmer, seed: number): ObservationCandidate[] {
  const candidates: ObservationCandidate[] = []
  const { production, finance, insurance, communication, preferredChannel } = farmer

  if (isMeaningfulValue(production.product) && isMeaningfulValue(production.fieldSize)) {
    candidates.push({
      id: 'production-scale',
      category: 'production',
      focus: 'production',
      weight: 8,
      text: pickVariant(
        [
          `${production.product} üretimi ${production.fieldSize} ölçeğinde sürüyor.`,
          `Saha kaydında ${production.product} için ${production.fieldSize} üretim alanı görünüyor.`,
          `${production.fieldSize} üzerinde ${production.product} hattı aktif durumda.`,
          `Üretim ölçeği ${production.fieldSize}; ana ürün ${production.product}.`,
        ],
        seed,
        17,
      ),
    })
  } else if (!isMeaningfulValue(production.fieldSize)) {
    candidates.push({
      id: 'production-scale-missing',
      category: 'production',
      focus: 'production',
      weight: 7,
      text: pickVariant(
        [
          'Üretim ölçeği henüz netleşmemiş; kapasite okuması eksik kalıyor.',
          'Alan büyüklüğü kaydı zayıf olduğu için ölçek tarafı belirsiz.',
          'Saha büyüklüğü doğrulanmadığı için üretim kapasitesi gri alanda.',
        ],
        seed,
        19,
      ),
    })
  }

  if (isMeaningfulValue(production.irrigationSystem)) {
    candidates.push({
      id: 'irrigation-strength',
      category: 'production',
      focus: 'production',
      weight: 5,
      text: pickVariant(
        [
          `Sulama tarafında ${production.irrigationSystem} kaydı üretim istikrarını güçlendiriyor.`,
          `${production.irrigationSystem} bilgisi, saha operasyonunun daha öngörülebilir olduğunu gösteriyor.`,
          `Sulama altyapısı ${production.irrigationSystem} olarak netleşmiş durumda.`,
        ],
        seed,
        23,
      ),
    })
  }

  if (isMeaningfulValue(production.salesChannel)) {
    const cooperative = isCooperativeChannel(production.salesChannel)
    candidates.push({
      id: 'sales-channel',
      category: 'production',
      focus: 'commercial',
      weight: cooperative ? 8 : 6,
      text: pickVariant(
        cooperative
          ? [
              `Kooperatif üzerinden satış, ticari erişim açısından güçlü bir sinyal.`,
              `Satış kanalı kooperatif; pazar bağlantısı kurumsal bir çerçevede ilerliyor.`,
              `Kooperatif üyeliği, ürünün pazara çıkışını daha istikrarlı kılıyor.`,
            ]
          : [
              `Satış kanalı ${production.salesChannel}; ürünün pazara çıkış yolu net.`,
              `${production.salesChannel} üzerinden yürüyen bir satış hattı kayda geçmiş.`,
              `Ticari tarafta ${production.salesChannel} kanalı görünür durumda.`,
              `Pazar erişimi ${production.salesChannel} üzerinden tanımlı.`,
            ],
        seed,
        29,
      ),
    })
  } else {
    candidates.push({
      id: 'sales-channel-missing',
      category: 'data_quality',
      focus: 'commercial',
      weight: 6,
      text: pickVariant(
        [
          'Satış kanalı kaydı boş; ticari eşleştirme için zemin henüz zayıf.',
          'Pazar çıkış yolu netleşmediği için ticari okuma sınırlı kalıyor.',
          'Satış hattı bilgisi eksik olduğundan ticari taraf yarım görünüyor.',
        ],
        seed,
        31,
      ),
    })
  }

  if (isRegularCommunication(communication.frequency)) {
    candidates.push({
      id: 'communication-regular',
      category: 'profile',
      focus: 'communication',
      weight: 7,
      text: pickVariant(
        [
          `İletişim sıklığı ${communication.frequency.toLocaleLowerCase('tr-TR')}; takip ritmi canlı.`,
          `Düzenli temas kaydı (${communication.frequency}) ilişki yönetimini kolaylaştırıyor.`,
          `${communication.frequency} görüşme temposu, aktif bir ilişki sinyali veriyor.`,
        ],
        seed,
        37,
      ),
    })
  } else if (isMeaningfulValue(communication.frequency)) {
    candidates.push({
      id: 'communication-sparse',
      category: 'profile',
      focus: 'communication',
      weight: 4,
      text: pickVariant(
        [
          `İletişim temposu ${communication.frequency.toLocaleLowerCase('tr-TR')}; temas aralıkları daha seyrek.`,
          `Görüşme sıklığı ${communication.frequency}; ilişki yoğunluğu sınırlı görünüyor.`,
        ],
        seed,
        41,
      ),
    })
  }

  if (isDigitalChannel(preferredChannel) || isDigitalChannel(production.salesChannel)) {
    candidates.push({
      id: 'digital-usage',
      category: 'profile',
      focus: 'communication',
      weight: 5,
      text: pickVariant(
        [
          'Dijital kanal kullanımı, hızlı geri dönüş ve takip için avantaj sağlıyor.',
          'Online / mesajlaşma tercihi, operasyonel iletişimi hızlandırıyor.',
          'Dijital temas alışkanlığı, kayıt güncelliğini destekliyor.',
        ],
        seed,
        43,
      ),
    })
  }

  if (hasCreditNeed(finance.creditNeed)) {
    candidates.push({
      id: 'credit-need',
      category: 'finance',
      focus: 'finance',
      weight: 7,
      text: pickVariant(
        [
          isMeaningfulValue(finance.creditAmount)
            ? `Kredi ihtiyacı var; talep edilen tutar ${finance.creditAmount} olarak işlenmiş.`
            : 'Kredi ihtiyacı belirtilmiş; tutar tarafı henüz netleşmemiş.',
          'Finansal açıdan kredi talebi açık bir sinyal olarak duruyor.',
          isMeaningfulValue(finance.creditAmount)
            ? `Finans kaydında ${finance.creditAmount} düzeyinde bir kredi ihtiyacı görünüyor.`
            : 'Finans tarafında kredi ihtiyacı işaretlenmiş durumda.',
        ],
        seed,
        47,
      ),
    })
  } else if (hasNoCreditNeed(finance.creditNeed)) {
    candidates.push({
      id: 'finance-maturity',
      category: 'finance',
      focus: 'finance',
      weight: 6,
      text: pickVariant(
        [
          'Kredi ihtiyacı yok; finansal baskı sinyali zayıf.',
          'Finansal olgunluk açısından acil kredi baskısı görünmüyor.',
          'Mevcut finans kaydı, kredi talebi olmadan ilerliyor.',
        ],
        seed,
        53,
      ),
    })
  } else if (
    !isMeaningfulValue(finance.incomeRange) ||
    !isMeaningfulValue(finance.inputBudget)
  ) {
    candidates.push({
      id: 'finance-gap',
      category: 'finance',
      focus: 'finance',
      weight: 6,
      text: pickVariant(
        [
          'Gelir veya girdi bütçesi eksik; finansal segmentasyon yarım kalıyor.',
          'Finans tarafında gelir / bütçe boşlukları segmentasyonu zorlaştırıyor.',
          'Maliyet ve gelir kayıtları tam olmadığı için finans okuması sınırlı.',
        ],
        seed,
        59,
      ),
    })
  }

  if (isMeaningfulValue(finance.incomeRange) && isMeaningfulValue(finance.inputBudget)) {
    candidates.push({
      id: 'finance-clarity',
      category: 'finance',
      focus: 'finance',
      weight: 5,
      text: pickVariant(
        [
          `Gelir aralığı (${finance.incomeRange}) ve girdi bütçesi birlikte okunabiliyor.`,
          'Finans kayıtlarında gelir ve bütçe tarafı görece net.',
          'Gelir-girdi çifti, finansal okumayı destekliyor.',
        ],
        seed,
        61,
      ),
    })
  }

  if (isActiveInsurance(insurance.status)) {
    candidates.push({
      id: 'insurance-active',
      category: 'insurance',
      focus: 'insurance',
      weight: 6,
      text: pickVariant(
        [
          isMeaningfulValue(insurance.type)
            ? `Aktif ${insurance.type} koruması kayıtlı; risk tarafı görece dengeli.`
            : 'Aktif sigorta kaydı mevcut; koruma tarafı açık görünüyor.',
          'Sigorta durumu aktif; üretim koruması açısından olumlu bir sinyal.',
          'Poliçe tarafında aktif koruma kaydı dikkat çekiyor.',
        ],
        seed,
        67,
      ),
    })
  } else if (isMeaningfulValue(insurance.status)) {
    candidates.push({
      id: 'insurance-status',
      category: 'insurance',
      focus: 'insurance',
      weight: 6,
      text: pickVariant(
        [
          `Sigorta durumu “${insurance.status}”; koruma tarafı netleşmeye açık.`,
          `Mevcut sigorta kaydı “${insurance.status}” seviyesinde duruyor.`,
          `Koruma durumu ${insurance.status}; yenileme veya doğrulama alanı canlı.`,
        ],
        seed,
        71,
      ),
    })
  } else {
    candidates.push({
      id: 'insurance-missing',
      category: 'insurance',
      focus: 'insurance',
      weight: 6,
      text: pickVariant(
        [
          'Sigorta durumu doğrulanmamış; koruma alanı gri bölgede.',
          'Poliçe kaydı boş olduğu için sigorta okuması yapılamıyor.',
          'Koruma bilgisi eksik; risk transferi tarafı belirsiz.',
        ],
        seed,
        73,
      ),
    })
  }

  if (isMeaningfulValue(production.soilType) && isMeaningfulValue(production.irrigationSystem)) {
    candidates.push({
      id: 'production-stability',
      category: 'production',
      focus: 'production',
      weight: 4,
      text: pickVariant(
        [
          `Toprak (${production.soilType}) ve sulama bilgisi birlikte, üretim istikrarını destekliyor.`,
          'Saha parametreleri (toprak + sulama) dolu; üretim okuması daha sağlam.',
        ],
        seed,
        79,
      ),
    })
  }

  return candidates
}

function buildInterpretationCandidates(
  farmer: Farmer,
  seed: number,
  risks: ReturnType<typeof getActiveRisks>,
  completeness: ReturnType<typeof calculateProfileCompleteness>,
  missingFields: ReturnType<typeof getCriticalMissingFields>,
): InterpretationCandidate[] {
  const interpretations: InterpretationCandidate[] = []
  const commercial = completeness.find((item) => item.key === 'commercial_matching')
  const allSufficient = completeness.every((result) => result.status === 'sufficient')
  const anyInsufficient = completeness.some((result) => result.status === 'insufficient')

  if (risks.length === 0) {
    interpretations.push({
      id: 'risk-none',
      tone: 'positive',
      weight: 8,
      text: pickVariant(
        [
          'Mevcut kayıtlarda acil bir risk sinyali yok; operasyonel tablo görece sakin.',
          'Risk radarında öncelikli bir uyarı görünmüyor.',
          'İlk incelemede yüksek öncelikli bir risk baskısı hissedilmiyor.',
          'Aktif risk listesi boş; takip daha çok fırsat ve veri kalitesine kayabilir.',
        ],
        seed,
        83,
      ),
    })
  } else {
    interpretations.push({
      id: 'risk-primary',
      tone: 'warning',
      weight: 9,
      text: pickVariant(
        [
          `Dikkat çeken nokta: ${risks[0].title.toLocaleLowerCase('tr-TR')}.`,
          `${risks[0].title} şu an en net doğrulama ihtiyacı olarak duruyor.`,
          `Risk tarafında ilk bakışta ${risks[0].title.toLocaleLowerCase('tr-TR')} öne alınıyor.`,
          `${risks[0].title} kaydı, kısa vadeli takip listesinin başına yerleşiyor.`,
        ],
        seed,
        89,
      ),
    })
  }

  if (allSufficient) {
    interpretations.push({
      id: 'completeness-full',
      tone: 'positive',
      weight: 7,
      text: pickVariant(
        [
          'Profil bütünlüğü yüksek; destek, finans ve ticari kullanım için zemin hazır.',
          'Amaca göre profil tamlığı genel olarak yeterli görünüyor.',
          'Mevcut profil yapısı, farklı kullanım amaçlarını taşıyacak kadar dolu.',
          'Veri kalitesi açısından profil, operasyonel kararlar için yeterince olgun.',
        ],
        seed,
        97,
      ),
    })
  } else if (anyInsufficient) {
    interpretations.push({
      id: 'completeness-low',
      tone: 'warning',
      weight: 7,
      text: pickVariant(
        [
          'Bazı kullanım amaçlarında profil henüz ince; ek bilgi toplanması işi hızlandırır.',
          'Profil tamlığı yer yer yetersiz; karar kalitesi bu boşluklardan etkileniyor.',
          'Amaca göre bakıldığında birkaç kritik alanda veri derinliği düşük.',
          'Mevcut profil yapısı bazı senaryolarda yetersiz kalıyor.',
        ],
        seed,
        101,
      ),
    })
  } else {
    interpretations.push({
      id: 'completeness-partial',
      tone: 'neutral',
      weight: 6,
      text: pickVariant(
        [
          'Profil kısmen yeterli; bazı amaçlar için ek doğrulama faydalı olur.',
          'Veri seti orta seviyede; kritik kararlar öncesi birkaç alan netleştirilebilir.',
          'Profil bütünlüğü karışık: bazı alanlar güçlü, bazıları henüz ince.',
          'Mevcut kayıtlar kısmi bir okuma sunuyor; derinlik alan bazında değişiyor.',
        ],
        seed,
        103,
      ),
    })
  }

  if (missingFields.length === 0) {
    interpretations.push({
      id: 'missing-none',
      tone: 'positive',
      weight: 6,
      text: pickVariant(
        [
          'Kritik bilgi boşluğu yok; veri kalitesi açısından rahat bir zemin var.',
          'Eksik alan listesi temiz; profil operasyonel kullanıma hazır.',
          'Kritik alanlar dolu; takip daha çok güncellik ve ilişkiye kayabilir.',
        ],
        seed,
        107,
      ),
    })
  } else if (missingFields.length === 1) {
    interpretations.push({
      id: 'missing-fields',
      tone: 'warning',
      weight: 7,
      text: pickVariant(
        [
          `${missingFields[0].label} alanı netleşirse profil okuması belirgin şekilde güçlenir.`,
          `Kısa vadede ${missingFields[0].label.toLocaleLowerCase('tr-TR')} bilgisinin doğrulanması işi kolaylaştırır.`,
          `Tek kritik boşluk ${missingFields[0].label}; burası kapanınca tablo daha netleşir.`,
        ],
        seed,
        109,
      ),
    })
  } else {
    interpretations.push({
      id: 'missing-fields',
      tone: 'warning',
      weight: 7,
      text: pickVariant(
        [
          `${missingFields[0].label} ve ${missingFields[1].label} alanları netleşmeden tablo yarım kalıyor.`,
          `Öncelik sırası ${missingFields[0].label.toLocaleLowerCase('tr-TR')} ile ${missingFields[1].label.toLocaleLowerCase('tr-TR')} üzerinde toplanıyor.`,
          `İki kritik boşluk (${missingFields[0].label}, ${missingFields[1].label}) karar kalitesini sınırlıyor.`,
        ],
        seed,
        113,
      ),
    })
  }

  if (
    commercial?.status === 'sufficient' &&
    isMeaningfulValue(farmer.production.salesChannel)
  ) {
    interpretations.push({
      id: 'commercial-opportunity',
      tone: 'positive',
      weight: 6,
      text: pickVariant(
        [
          'Ticari eşleştirme için ürün ve satış kanalı yeterince olgun görünüyor.',
          'Pazar erişimi net; uygun alıcı / iş ortağı araması için zemin hazır.',
          'Ticari fırsat penceresi açık: üretim ve kanal bilgisi birlikte çalışıyor.',
          'Satış hattı tanımlı olduğu için ticari eşleştirme konuşulabilir seviyede.',
        ],
        seed,
        127,
      ),
    })
  }

  if (isRegularCommunication(farmer.communication.frequency) && risks.length <= 1) {
    interpretations.push({
      id: 'relationship-strength',
      tone: 'positive',
      weight: 5,
      text: pickVariant(
        [
          'Düzenli iletişim, ilişki yönetimini ve güncel veri akışını destekliyor.',
          'Canlı temas ritmi, aksiyonların sahaya inmesini kolaylaştırıyor.',
          'İletişim geçmişi güçlü; takip maliyeti görece düşük kalabilir.',
        ],
        seed,
        131,
      ),
    })
  }

  if (hasNoCreditNeed(farmer.finance.creditNeed) && isActiveInsurance(farmer.insurance.status)) {
    interpretations.push({
      id: 'stability-signal',
      tone: 'positive',
      weight: 5,
      text: pickVariant(
        [
          'Finansal baskı düşük ve sigorta aktif; genel tablo istikrarlı.',
          'Koruma ve finans tarafı birlikte okunduğunda dengeli bir profil çıkıyor.',
        ],
        seed,
        137,
      ),
    })
  }

  return interpretations
}

function selectObservations(
  candidates: ObservationCandidate[],
  seed: number,
  primaryFocus: NarrativeFocus,
): FarmerSummaryObservation[] {
  const sorted = [...candidates].sort((left, right) => {
    const focusDelta =
      focusRank(left.focus, primaryFocus) - focusRank(right.focus, primaryFocus)

    if (focusDelta !== 0) {
      return focusDelta
    }

    if (right.weight !== left.weight) {
      return right.weight - left.weight
    }

    return ((seed + left.id.length) % 7) - ((seed + right.id.length) % 7)
  })

  // Deterministic secondary shuffle within top band to vary order per farmer
  const top = sorted.slice(0, Math.min(6, sorted.length))

  if (top.length === 0) {
    return []
  }

  const rotateBy = seed % top.length
  const rotated = [...top.slice(rotateBy), ...top.slice(0, rotateBy)]

  const selected: FarmerSummaryObservation[] = []
  const usedCategories = new Set<string>()

  for (const candidate of rotated) {
    if (selected.length >= 3) {
      break
    }

    if (usedCategories.has(candidate.category) && selected.length < 2) {
      continue
    }

    selected.push({
      id: candidate.id,
      text: candidate.text,
      category: candidate.category,
    })
    usedCategories.add(candidate.category)
  }

  if (selected.length < 3) {
    for (const candidate of sorted) {
      if (selected.some((item) => item.id === candidate.id)) {
        continue
      }

      selected.push({
        id: candidate.id,
        text: candidate.text,
        category: candidate.category,
      })

      if (selected.length >= 3) {
        break
      }
    }
  }

  return selected.slice(0, 3)
}

function selectInterpretations(
  candidates: InterpretationCandidate[],
  seed: number,
): FarmerSummaryInterpretation[] {
  const sorted = [...candidates].sort((left, right) => {
    if (right.weight !== left.weight) {
      return right.weight - left.weight
    }

    return ((seed + left.id.charCodeAt(0)) % 5) - ((seed + right.id.charCodeAt(0)) % 5)
  })

  if (sorted.length === 0) {
    return []
  }

  const rotateBy = seed % sorted.length
  const rotated = [...sorted.slice(rotateBy), ...sorted.slice(0, rotateBy)]

  const selected: FarmerSummaryInterpretation[] = []
  const usedIds = new Set<string>()

  for (const candidate of rotated) {
    if (selected.length >= 3) {
      break
    }

    if (usedIds.has(candidate.id)) {
      continue
    }

    selected.push({
      id: candidate.id,
      text: candidate.text,
      tone: candidate.tone,
    })
    usedIds.add(candidate.id)
  }

  return selected.slice(0, 3)
}

export function generateFarmerSummary(farmer: Farmer): FarmerSummaryResult {
  const seed = hashSeed(farmer.id)
  const risks = getActiveRisks(farmer)
  const completeness = calculateProfileCompleteness(farmer)
  const missingFields = getCriticalMissingFields(farmer)
  const commercialSufficient =
    completeness.find((item) => item.key === 'commercial_matching')?.status ===
    'sufficient'

  const focus = resolveNarrativeFocus(
    farmer,
    seed,
    risks,
    missingFields,
    commercialSufficient,
  )

  const observations = selectObservations(
    buildObservationCandidates(farmer, seed),
    seed,
    focus,
  )

  const interpretations = selectInterpretations(
    buildInterpretationCandidates(farmer, seed, risks, completeness, missingFields),
    seed,
  )

  return {
    headline: buildHeadline(farmer, seed, focus),
    description: buildDescription(farmer, seed, focus),
    observations,
    interpretations,
  }
}
