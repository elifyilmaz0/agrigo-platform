export type AdvertiserAccountStatus =
  | 'active'
  | 'pending_approval'
  | 'suspended'
  | 'inactive'

export type AdvertiserPaymentMethod =
  | 'bank-transfer'
  | 'credit-card'
  | 'invoice'

export type AdvertiserBillingStatus = 'up-to-date' | 'pending' | 'overdue'

export type AdvertiserCompanyDetails = {
  name: string
  sector: string
  description: string
  website: string
  logoUrl: string | null
  logoInitials: string
}

export type AdvertiserAccountDetails = {
  advertiserId: string
  status: AdvertiserAccountStatus
  registeredAt: string
  updatedAt: string
}

export type AdvertiserDefaultCampaignSettings = {
  defaultDailyBudget: number
  defaultTotalBudget: number
  defaultDurationDays: number
  defaultFrequencyLabel: string
  currency: 'TRY'
}

export type AdvertiserBrandSafety = {
  showAdsOnRiskyTopics: boolean
  sensitiveCategories: string[]
  blockedKeywords: string[]
}

export type AdvertiserBilling = {
  invoiceTitle: string
  taxOffice: string
  taxNumber: string
  paymentMethod: AdvertiserPaymentMethod
  lastInvoiceDate: string
  billingStatus: AdvertiserBillingStatus
}

export type AdvertiserProfile = {
  id: string
  companyId: string
  company: AdvertiserCompanyDetails
  account: AdvertiserAccountDetails
  defaultCampaignSettings: AdvertiserDefaultCampaignSettings
  brandSafety: AdvertiserBrandSafety
  billing: AdvertiserBilling
}

export type AdvertiserCompanyEditableFields = {
  name: string
  sector: string
  description: string
  website: string
  logoUrl: string
}
