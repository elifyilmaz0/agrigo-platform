import type { AdvertiserCompany, PlatformUser } from '../types/tenant.ts'

export const COMPANY_IDS = {
  isleyen: 'company-isleyen-tarim',
  bereket: 'company-bereket-gubre',
  agronova: 'company-agronova',
  verimli: 'company-verimli-tohum',
  anadolu: 'company-anadolu-sulama',
} as const

export const advertiserCompanies: AdvertiserCompany[] = [
  {
    id: COMPANY_IDS.isleyen,
    name: 'İşleyen Tarım A.Ş.',
    brandName: 'İşleyen Tarım',
    shortName: 'İşleyen Tarım',
    sector: 'Tarım Teknolojileri',
    description:
      'Bitki koruma ürünleri, gübre ve tarımsal çözümler geliştiren reklamveren. Çiftçilere ihtiyaç anında doğru ürün önerileri sunmayı hedefler.',
    website: 'https://www.isleyentarim.com',
    logoInitials: 'İT',
    advertiserId: 'ADV-000124',
    status: 'active',
    registeredAt: '2024-03-12',
    updatedAt: '2026-07-20',
  },
  {
    id: COMPANY_IDS.bereket,
    name: 'Bereket Gübre Sanayi A.Ş.',
    brandName: 'Bereket Gübre',
    shortName: 'Bereket Gübre',
    sector: 'Gübre ve Bitki Besleme',
    description:
      'Tarla, sera ve meyve üreticilerine yönelik bitki besleme ve gübre ürünleri geliştiren tarım şirketi.',
    website: 'https://www.bereketgubre.com',
    logoInitials: 'BG',
    advertiserId: 'ADV-000125',
    status: 'active',
    registeredAt: '2024-08-01',
    updatedAt: '2026-07-15',
  },
  {
    id: COMPANY_IDS.agronova,
    name: 'AgroNova Bitki Koruma Ltd. Şti.',
    brandName: 'AgroNova',
    shortName: 'AgroNova',
    sector: 'Bitki Koruma Ürünleri',
    description:
      'Bitki hastalıkları ve zararlılarıyla mücadeleye yönelik ruhsatlı tarımsal ürünler sunan reklamveren.',
    website: 'https://www.agronova.com.tr',
    logoInitials: 'AN',
    advertiserId: 'ADV-000126',
    status: 'active',
    registeredAt: '2025-01-20',
    updatedAt: '2026-07-10',
  },
  {
    id: COMPANY_IDS.verimli,
    name: 'Verimli Tohumculuk A.Ş.',
    brandName: 'Verimli Tohum',
    shortName: 'Verimli Tohum',
    sector: 'Tohumculuk',
    description:
      'Tarla bitkileri ve sebze üreticileri için sertifikalı tohum çeşitleri geliştiren tarım şirketi.',
    website: 'https://www.verimlitohum.com.tr',
    logoInitials: 'VT',
    advertiserId: 'ADV-000127',
    status: 'active',
    registeredAt: '2024-11-05',
    updatedAt: '2026-07-18',
  },
  {
    id: COMPANY_IDS.anadolu,
    name: 'Anadolu Sulama Sistemleri Ltd. Şti.',
    brandName: 'Anadolu Sulama',
    shortName: 'Anadolu Sulama',
    sector: 'Tarımsal Sulama Teknolojileri',
    description:
      'Damla sulama, yağmurlama ve akıllı sulama çözümleri geliştiren tarım teknolojileri şirketi.',
    website: 'https://www.anadolusulama.com',
    logoInitials: 'AS',
    advertiserId: 'ADV-000128',
    status: 'active',
    registeredAt: '2025-02-14',
    updatedAt: '2026-07-21',
  },
]

/** Default mock session: Elif Kaya — İşleyen Tarım */
export const DEFAULT_MOCK_USER_ID = 'user-elif-kaya'

export const platformUsers: PlatformUser[] = [
  {
    id: 'user-elif-kaya',
    name: 'Elif Kaya',
    email: 'elif.kaya@isleyentarim.com',
    role: 'advertiser',
    companyId: COMPANY_IDS.isleyen,
    userRoleLabel: 'Reklamveren Kullanıcısı',
  },
  {
    id: 'user-mert-demir',
    name: 'Mert Demir',
    email: 'mert.demir@bereketgubre.com',
    role: 'advertiser',
    companyId: COMPANY_IDS.bereket,
    userRoleLabel: 'Reklamveren Kullanıcısı',
  },
  {
    id: 'user-selin-arslan',
    name: 'Selin Arslan',
    email: 'selin.arslan@agronova.com.tr',
    role: 'advertiser',
    companyId: COMPANY_IDS.agronova,
    userRoleLabel: 'Reklamveren Kullanıcısı',
  },
  {
    id: 'user-can-yildiz',
    name: 'Can Yıldız',
    email: 'can.yildiz@verimlitohum.com.tr',
    role: 'advertiser',
    companyId: COMPANY_IDS.verimli,
    userRoleLabel: 'Reklamveren Kullanıcısı',
  },
  {
    id: 'user-zeynep-sahin',
    name: 'Zeynep Şahin',
    email: 'zeynep.sahin@anadolusulama.com',
    role: 'advertiser',
    companyId: COMPANY_IDS.anadolu,
    userRoleLabel: 'Reklamveren Kullanıcısı',
  },
  {
    id: 'user-admin',
    name: 'AgriGO Admin',
    email: 'admin@agrigo.ai',
    role: 'admin',
    userRoleLabel: 'Platform Yöneticisi',
  },
]

export function getCompanyById(id: string): AdvertiserCompany | undefined {
  return advertiserCompanies.find((company) => company.id === id)
}

export function getPlatformUserById(id: string): PlatformUser | undefined {
  return platformUsers.find((user) => user.id === id)
}

export function getAdvertiserCompanyLabel(user: PlatformUser): string {
  if (user.role === 'admin') return 'Tüm şirketler'
  return getCompanyById(user.companyId)?.name ?? 'Şirket'
}
