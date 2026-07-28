import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_MOCK_USER_ID,
  getCompanyById,
  getPlatformUserById,
  platformUsers,
} from '../data/tenant.ts'
import {
  canAccessCompany,
  getAccessibleCompanies,
  getAccessibleCompanyIds,
  resolveSafeSelectedCompanyId,
} from './tenantAccess.ts'
import type { AdvertiserCompany, PlatformUser } from '../types/tenant.ts'
import { TENANT_STORAGE_KEYS } from '../types/tenant.ts'

type TenantContextValue = {
  currentUser: PlatformUser
  selectedCompanyId: string | null
  selectedCompany: AdvertiserCompany | null
  accessibleCompanies: AdvertiserCompany[]
  /** True only for Admin (advertisers never switch companies) */
  canSwitchCompany: boolean
  isAdmin: boolean
  canAccessSelectedCompany: boolean
  setSelectedCompanyId: (companyId: string) => boolean
  /** Mock-only: switch demo user to exercise isolation scenarios */
  setMockUserId: (userId: string) => void
  mockUsers: PlatformUser[]
}

const TenantContext = createContext<TenantContextValue | null>(null)

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore quota / private mode failures in mock UI.
  }
}

function removeStored(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore
  }
}

function resolveInitialUser(): PlatformUser {
  const storedUserId = readStored(TENANT_STORAGE_KEYS.mockUserId)
  // Drop removed multi-company mock user if still in storage
  if (storedUserId === 'user-multi-manager') {
    removeStored(TENANT_STORAGE_KEYS.mockUserId)
  }
  const fromStorage =
    storedUserId && storedUserId !== 'user-multi-manager'
      ? getPlatformUserById(storedUserId)
      : undefined
  return (
    fromStorage ??
    getPlatformUserById(DEFAULT_MOCK_USER_ID) ??
    platformUsers[0]
  )
}

function resolveInitialCompanyId(user: PlatformUser): string | null {
  if (user.role === 'advertiser') {
    return resolveSafeSelectedCompanyId(user, null)
  }
  const storedCompanyId = readStored(TENANT_STORAGE_KEYS.selectedCompanyId)
  const resolved = resolveSafeSelectedCompanyId(user, storedCompanyId)
  if (storedCompanyId && storedCompanyId !== resolved) {
    if (resolved) writeStored(TENANT_STORAGE_KEYS.selectedCompanyId, resolved)
    else removeStored(TENANT_STORAGE_KEYS.selectedCompanyId)
  }
  return resolved
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<PlatformUser>(resolveInitialUser)
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | null>(
    () => resolveInitialCompanyId(resolveInitialUser()),
  )

  const accessibleCompanies = useMemo(
    () => getAccessibleCompanies(currentUser),
    [currentUser],
  )

  const selectedCompany = useMemo(
    () =>
      selectedCompanyId ? (getCompanyById(selectedCompanyId) ?? null) : null,
    [selectedCompanyId],
  )

  const canAccessSelectedCompany = canAccessCompany(
    currentUser,
    selectedCompanyId,
  )

  const setSelectedCompanyId = useCallback(
    (companyId: string) => {
      // Advertisers cannot change company
      if (currentUser.role !== 'admin') return false
      if (!canAccessCompany(currentUser, companyId)) {
        return false
      }
      setSelectedCompanyIdState(companyId)
      writeStored(TENANT_STORAGE_KEYS.selectedCompanyId, companyId)
      return true
    },
    [currentUser],
  )

  const setMockUserId = useCallback((userId: string) => {
    const user = getPlatformUserById(userId)
    if (!user) return
    setCurrentUser(user)
    writeStored(TENANT_STORAGE_KEYS.mockUserId, user.id)

    if (user.role === 'advertiser') {
      setSelectedCompanyIdState(user.companyId)
      // Advertiser selection is not driven by localStorage company key
      return
    }

    const nextCompanyId = resolveSafeSelectedCompanyId(
      user,
      readStored(TENANT_STORAGE_KEYS.selectedCompanyId),
    )
    setSelectedCompanyIdState(nextCompanyId)
    if (nextCompanyId) {
      writeStored(TENANT_STORAGE_KEYS.selectedCompanyId, nextCompanyId)
    } else {
      removeStored(TENANT_STORAGE_KEYS.selectedCompanyId)
    }
  }, [])

  const value = useMemo<TenantContextValue>(
    () => ({
      currentUser,
      selectedCompanyId,
      selectedCompany,
      accessibleCompanies,
      canSwitchCompany: currentUser.role === 'admin',
      isAdmin: currentUser.role === 'admin',
      canAccessSelectedCompany,
      setSelectedCompanyId,
      setMockUserId,
      mockUsers: platformUsers,
    }),
    [
      currentUser,
      selectedCompanyId,
      selectedCompany,
      accessibleCompanies,
      canAccessSelectedCompany,
      setSelectedCompanyId,
      setMockUserId,
    ],
  )

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}

/** Convenience: accessible company ID list for the current user */
export function useAccessibleCompanyIds(): string[] {
  const { currentUser } = useTenant()
  return getAccessibleCompanyIds(currentUser)
}
