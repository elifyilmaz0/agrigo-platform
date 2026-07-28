/**
 * Multi-tenant types for the Advertisement platform.
 *
 * PRODUCT RULE:
 * - Each Advertiser user is bound to exactly one company (`companyId`).
 * - Advertisers cannot switch companies or see other advertisers.
 * - Admin can view all companies and switch between them.
 *
 * SECURITY NOTE (future backend):
 * Frontend filtering alone is NOT real security. When APIs are added:
 * - Authenticate every request
 * - Authorize company access server-side (advertiser.companyId / admin)
 * - Scope all DB queries by companyId
 * - Never return other tenants' rows in API payloads
 * - Keep Admin vs Advertiser authorization on the server
 */

export type PlatformUser =
  | {
      id: string
      name: string
      email: string
      role: 'advertiser'
      companyId: string
      userRoleLabel: string
    }
  | {
      id: string
      name: string
      email: string
      role: 'admin'
      userRoleLabel: string
    }

export type AdvertiserCompany = {
  id: string
  name: string
  brandName: string
  shortName: string
  sector: string
  description: string
  website: string
  logoInitials: string
  advertiserId: string
  status: 'active' | 'pending_approval' | 'suspended' | 'inactive'
  registeredAt: string
  updatedAt: string
}

export const TENANT_STORAGE_KEYS = {
  /** Admin-only selected company persistence */
  selectedCompanyId: 'agrigo.ad.selectedCompanyId',
  mockUserId: 'agrigo.ad.mockUserId',
} as const

/** Domain records that must always carry companyId for tenant isolation */
export type AnalyticsRecord = {
  id: string
  companyId: string
}

export type BillingRecord = {
  id: string
  companyId: string
}

export type Notification = {
  id: string
  companyId: string
  title: string
  body: string
}

export type SearchResult = {
  id: string
  companyId: string
  label: string
  type: 'product' | 'campaign' | 'segment'
}
