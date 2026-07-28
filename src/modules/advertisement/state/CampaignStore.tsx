import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createCampaignCopy,
  initialCampaigns,
} from '../data/campaigns.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import { canAccessCompany } from '../tenant/tenantAccess.ts'
import type { Campaign, CampaignStatus } from '../types/advertisement.ts'
import { computeCampaignStatusSummary } from '../utils/campaignMetrics.ts'

type CampaignStoreValue = {
  /** All in-memory campaigns (mock backend). Prefer `campaigns` for UI. */
  allCampaigns: Campaign[]
  /** Tenant-scoped campaigns for the selected company */
  campaigns: Campaign[]
  statusSummary: ReturnType<typeof computeCampaignStatusSummary>
  getCampaign: (id: string) => Campaign | undefined
  updateCampaignStatus: (id: string, status: CampaignStatus) => void
  updateCampaign: (id: string, patch: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
  copyCampaign: (id: string) => Campaign | null
}

const CampaignStoreContext = createContext<CampaignStoreValue | null>(null)

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { currentUser, selectedCompanyId } = useTenant()
  const [allCampaigns, setAllCampaigns] =
    useState<Campaign[]>(initialCampaigns)

  const canUseSelected =
    Boolean(selectedCompanyId) &&
    canAccessCompany(currentUser, selectedCompanyId)

  const campaigns = useMemo(() => {
    if (!canUseSelected || !selectedCompanyId) return []
    return allCampaigns.filter(
      (campaign) => campaign.companyId === selectedCompanyId,
    )
  }, [allCampaigns, canUseSelected, selectedCompanyId])

  const getCampaign = useCallback(
    (id: string) => {
      if (!canUseSelected || !selectedCompanyId) return undefined
      return allCampaigns.find(
        (campaign) =>
          campaign.id === id && campaign.companyId === selectedCompanyId,
      )
    },
    [allCampaigns, canUseSelected, selectedCompanyId],
  )

  const assertOwned = useCallback(
    (id: string) => {
      if (!canUseSelected || !selectedCompanyId) return false
      return allCampaigns.some(
        (campaign) =>
          campaign.id === id && campaign.companyId === selectedCompanyId,
      )
    },
    [allCampaigns, canUseSelected, selectedCompanyId],
  )

  const updateCampaignStatus = useCallback(
    (id: string, status: CampaignStatus) => {
      if (!assertOwned(id)) return
      setAllCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === id
            ? { ...campaign, status, updatedAt: '2026-07-27' }
            : campaign,
        ),
      )
    },
    [assertOwned],
  )

  const updateCampaign = useCallback(
    (id: string, patch: Partial<Campaign>) => {
      if (!assertOwned(id)) return
      // Prevent tenant reassignment via patch
      const { companyId: _ignored, ...safePatch } = patch
      setAllCampaigns((current) =>
        current.map((campaign) =>
          campaign.id === id
            ? { ...campaign, ...safePatch, updatedAt: '2026-07-27' }
            : campaign,
        ),
      )
    },
    [assertOwned],
  )

  const deleteCampaign = useCallback(
    (id: string) => {
      if (!assertOwned(id)) return
      setAllCampaigns((current) =>
        current.filter((campaign) => campaign.id !== id),
      )
    },
    [assertOwned],
  )

  const copyCampaign = useCallback(
    (id: string) => {
      const source = getCampaign(id)
      if (!source || !selectedCompanyId) return null
      const newId = `camp-copy-${Date.now()}`
      const copy = {
        ...createCampaignCopy(source, newId),
        companyId: selectedCompanyId,
      }
      setAllCampaigns((current) => [copy, ...current])
      return copy
    },
    [getCampaign, selectedCompanyId],
  )

  const statusSummary = useMemo(
    () => computeCampaignStatusSummary(campaigns),
    [campaigns],
  )

  const value = useMemo(
    () => ({
      allCampaigns,
      campaigns,
      statusSummary,
      getCampaign,
      updateCampaignStatus,
      updateCampaign,
      deleteCampaign,
      copyCampaign,
    }),
    [
      allCampaigns,
      campaigns,
      statusSummary,
      getCampaign,
      updateCampaignStatus,
      updateCampaign,
      deleteCampaign,
      copyCampaign,
    ],
  )

  return (
    <CampaignStoreContext.Provider value={value}>
      {children}
    </CampaignStoreContext.Provider>
  )
}

export function useCampaignStore() {
  const context = useContext(CampaignStoreContext)
  if (!context) {
    throw new Error('useCampaignStore must be used within CampaignProvider')
  }
  return context
}
