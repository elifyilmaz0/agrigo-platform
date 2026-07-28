import { advertiserCompanies, getCompanyById } from '../data/tenant.ts'
import type { AdvertiserCompany, PlatformUser } from '../types/tenant.ts'

/**
 * Returns company IDs the user is allowed to access.
 * Admin → all companies. Advertiser → exactly their companyId.
 */
export function getAccessibleCompanyIds(user: PlatformUser): string[] {
  if (user.role === 'admin') {
    return advertiserCompanies.map((company) => company.id)
  }
  return getCompanyById(user.companyId) ? [user.companyId] : []
}

export function getAccessibleCompanies(user: PlatformUser): AdvertiserCompany[] {
  const ids = new Set(getAccessibleCompanyIds(user))
  return advertiserCompanies.filter((company) => ids.has(company.id))
}

export function canAccessCompany(
  user: PlatformUser,
  companyId: string | null | undefined,
): boolean {
  if (!companyId) return false
  if (user.role === 'admin') return Boolean(getCompanyById(companyId))
  return user.companyId === companyId
}

/**
 * Resolve a safe selected company for the session.
 * - Advertiser: always currentUser.companyId (ignores requested/storage).
 * - Admin: requested if valid, else first company.
 */
export function resolveSafeSelectedCompanyId(
  user: PlatformUser,
  requestedCompanyId: string | null | undefined,
): string | null {
  if (user.role === 'advertiser') {
    return getCompanyById(user.companyId) ? user.companyId : null
  }

  const accessible = getAccessibleCompanyIds(user)
  if (accessible.length === 0) return null
  if (requestedCompanyId && accessible.includes(requestedCompanyId)) {
    return requestedCompanyId
  }
  return accessible[0] ?? null
}

export function canAccessCompanyRecord(
  user: PlatformUser,
  selectedCompanyId: string | null,
  recordCompanyId: string | null | undefined,
): boolean {
  if (!selectedCompanyId || !recordCompanyId) return false
  if (!canAccessCompany(user, selectedCompanyId)) return false
  return recordCompanyId === selectedCompanyId
}

export function filterByCompanyId<T extends { companyId: string }>(
  records: T[],
  user: PlatformUser,
  selectedCompanyId: string | null,
): T[] {
  if (!selectedCompanyId || !canAccessCompany(user, selectedCompanyId)) {
    return []
  }
  return records.filter((record) => record.companyId === selectedCompanyId)
}
