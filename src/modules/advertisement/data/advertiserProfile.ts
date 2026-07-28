import type {
  AdvertiserAccountStatus,
  AdvertiserBillingStatus,
  AdvertiserPaymentMethod,
  AdvertiserProfile,
} from '../types/advertiserProfile.ts'
import { COMPANY_IDS, getCompanyById } from './tenant.ts'

export const advertiserAccountStatusLabels: Record<
  AdvertiserAccountStatus,
  string
> = {
  active: 'Aktif',
  pending_approval: 'Onay Bekliyor',
  suspended: 'Askıya Alındı',
  inactive: 'Pasif',
}

export const advertiserAccountStatusStyles: Record<
  AdvertiserAccountStatus,
  string
> = {
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pending_approval: 'border-amber-200 bg-amber-50 text-amber-700',
  suspended: 'border-orange-200 bg-orange-50 text-orange-700',
  inactive: 'border-slate-200 bg-slate-50 text-slate-600',
}

export const advertiserPaymentMethodLabels: Record<
  AdvertiserPaymentMethod,
  string
> = {
  'bank-transfer': 'Banka Havalesi / EFT',
  'credit-card': 'Kredi Kartı',
  invoice: 'Kurumsal Fatura',
}

export const advertiserBillingStatusLabels: Record<
  AdvertiserBillingStatus,
  string
> = {
  'up-to-date': 'Güncel',
  pending: 'Beklemede',
  overdue: 'Gecikmiş',
}

export const advertiserBillingStatusStyles: Record<
  AdvertiserBillingStatus,
  string
> = {
  'up-to-date': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  overdue: 'border-rose-200 bg-rose-50 text-rose-700',
}

export const advertiserSectorOptions = [
  'Tarım Teknolojileri',
  'Bitki Koruma',
  'Gübre ve Besleme',
  'Sulama Sistemleri',
  'Tohum ve Fidancılık',
  'Hayvancılık',
  'Tarım Ekipmanları',
  'Diğer',
] as const

function profileFromCompany(
  companyId: string,
  extras: Partial<AdvertiserProfile> = {},
): AdvertiserProfile {
  const company = getCompanyById(companyId)
  if (!company) {
    throw new Error(`Unknown companyId: ${companyId}`)
  }

  return {
    id: `profile-${companyId}`,
    companyId,
    company: {
      name: company.name,
      sector: company.sector,
      description: company.description,
      website: company.website,
      logoUrl: null,
      logoInitials: company.logoInitials,
    },
    account: {
      advertiserId: company.advertiserId,
      status: company.status,
      registeredAt: company.registeredAt,
      updatedAt: company.updatedAt,
    },
    defaultCampaignSettings: {
      defaultDailyBudget: 5000,
      defaultTotalBudget: 50000,
      defaultDurationDays: 30,
      defaultFrequencyLabel: 'Haftada 2',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Bitki Hastalıkları', 'Hayvan Sağlığı'],
      blockedKeywords: [
        'zehir',
        'yasaklı madde',
        'garantili sonuç',
        'mucize ürün',
      ],
    },
    billing: {
      invoiceTitle: company.name,
      taxOffice: 'Merkez Vergi Dairesi',
      taxNumber: '1000000000',
      paymentMethod: 'bank-transfer',
      lastInvoiceDate: '2026-06-30',
      billingStatus: 'up-to-date',
    },
    ...extras,
  }
}

export const advertiserProfilesByCompanyId: Record<string, AdvertiserProfile> = {
  [COMPANY_IDS.isleyen]: profileFromCompany(COMPANY_IDS.isleyen, {
    defaultCampaignSettings: {
      defaultDailyBudget: 5000,
      defaultTotalBudget: 50000,
      defaultDurationDays: 30,
      defaultFrequencyLabel: 'Haftada maksimum 2 gösterim',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Bitki Hastalıkları', 'Hayvan Sağlığı'],
      blockedKeywords: [
        'zehir',
        'yasaklı madde',
        'garantili sonuç',
        'mucize ürün',
      ],
    },
    billing: {
      invoiceTitle: 'İşleyen Tarım Anonim Şirketi',
      taxOffice: 'Bornova Vergi Dairesi',
      taxNumber: '1234567890',
      paymentMethod: 'bank-transfer',
      lastInvoiceDate: '2026-06-30',
      billingStatus: 'up-to-date',
    },
  }),
  [COMPANY_IDS.bereket]: profileFromCompany(COMPANY_IDS.bereket, {
    defaultCampaignSettings: {
      defaultDailyBudget: 3500,
      defaultTotalBudget: 35000,
      defaultDurationDays: 21,
      defaultFrequencyLabel: 'Haftada maksimum 3 gösterim',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Toprak Kirliliği', 'Kimyasal Dozaj'],
      blockedKeywords: ['ucuz gübre', 'garantili verim', 'aşırı doz'],
    },
    billing: {
      invoiceTitle: 'Bereket Gübre Sanayi A.Ş.',
      taxOffice: 'Karşıyaka Vergi Dairesi',
      taxNumber: '2223334445',
      paymentMethod: 'invoice',
      lastInvoiceDate: '2026-06-15',
      billingStatus: 'up-to-date',
    },
  }),
  [COMPANY_IDS.agronova]: profileFromCompany(COMPANY_IDS.agronova, {
    defaultCampaignSettings: {
      defaultDailyBudget: 4000,
      defaultTotalBudget: 40000,
      defaultDurationDays: 30,
      defaultFrequencyLabel: 'Haftada maksimum 2 gösterim',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Bitki Hastalıkları', 'Pestisit Güvenliği'],
      blockedKeywords: ['zehirli', 'yasaklı madde', 'etiketsiz ürün'],
    },
    billing: {
      invoiceTitle: 'AgroNova Bitki Koruma Ltd. Şti.',
      taxOffice: 'Konak Vergi Dairesi',
      taxNumber: '5556667778',
      paymentMethod: 'credit-card',
      lastInvoiceDate: '2026-05-31',
      billingStatus: 'pending',
    },
  }),
  [COMPANY_IDS.verimli]: profileFromCompany(COMPANY_IDS.verimli, {
    defaultCampaignSettings: {
      defaultDailyBudget: 2500,
      defaultTotalBudget: 25000,
      defaultDurationDays: 20,
      defaultFrequencyLabel: 'Haftada maksimum 2 gösterim',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Tohum Sertifikasyonu'],
      blockedKeywords: ['sahte tohum', 'garantili çimlenme', 'korsan çeşit'],
    },
    billing: {
      invoiceTitle: 'Verimli Tohumculuk A.Ş.',
      taxOffice: 'Yenimahalle Vergi Dairesi',
      taxNumber: '6677889900',
      paymentMethod: 'bank-transfer',
      lastInvoiceDate: '2026-07-01',
      billingStatus: 'up-to-date',
    },
  }),
  [COMPANY_IDS.anadolu]: profileFromCompany(COMPANY_IDS.anadolu, {
    defaultCampaignSettings: {
      defaultDailyBudget: 3000,
      defaultTotalBudget: 30000,
      defaultDurationDays: 25,
      defaultFrequencyLabel: 'Haftada maksimum 2 gösterim',
      currency: 'TRY',
    },
    brandSafety: {
      showAdsOnRiskyTopics: false,
      sensitiveCategories: ['Su Kaynakları', 'Sulama Verimliliği'],
      blockedKeywords: ['sınırsız su', 'garantili tasarruf', 'yasadışı kuyu'],
    },
    billing: {
      invoiceTitle: 'Anadolu Sulama Sistemleri Ltd. Şti.',
      taxOffice: 'Çukurova Vergi Dairesi',
      taxNumber: '3344556677',
      paymentMethod: 'invoice',
      lastInvoiceDate: '2026-06-20',
      billingStatus: 'up-to-date',
    },
  }),
}

/** @deprecated Prefer getAdvertiserProfileForCompany */
export const initialAdvertiserProfile =
  advertiserProfilesByCompanyId[COMPANY_IDS.isleyen]

export function getAdvertiserProfileForCompany(
  companyId: string | null | undefined,
): AdvertiserProfile | undefined {
  if (!companyId) return undefined
  return advertiserProfilesByCompanyId[companyId]
}

export function getCompanyInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0 && !/^(a\.?ş\.?|ltd\.?|şti\.?)$/i.test(part))

  if (parts.length === 0) return 'ŞP'
  if (parts.length === 1) return parts[0].slice(0, 2).toLocaleUpperCase('tr-TR')
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toLocaleUpperCase('tr-TR')
}
