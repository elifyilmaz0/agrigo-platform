import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import AccountStatusCard from '../components/company-profile/AccountStatusCard.tsx'
import BillingCard from '../components/company-profile/BillingCard.tsx'
import BrandSafetyCard from '../components/company-profile/BrandSafetyCard.tsx'
import CompanyInfoCard from '../components/company-profile/CompanyInfoCard.tsx'
import DefaultCampaignSettingsCard from '../components/company-profile/DefaultCampaignSettingsCard.tsx'
import EditCompanyProfileModal from '../components/company-profile/EditCompanyProfileModal.tsx'
import PageHeader from '../components/PageHeader.tsx'
import UnauthorizedCompanyAccess from '../components/UnauthorizedCompanyAccess.tsx'
import {
  getAdvertiserProfileForCompany,
  getCompanyInitials,
} from '../data/advertiserProfile.ts'
import { useToast } from '../hooks/useToast.tsx'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type {
  AdvertiserCompanyEditableFields,
  AdvertiserProfile,
} from '../types/advertiserProfile.ts'

function cloneProfile(profile: AdvertiserProfile): AdvertiserProfile {
  return structuredClone(profile)
}

export default function CompanyProfilePage() {
  const { showToast, toastNode } = useToast()
  const {
    selectedCompanyId,
    selectedCompany,
    canAccessSelectedCompany,
  } = useTenant()
  const seed = getAdvertiserProfileForCompany(selectedCompanyId)
  const [profile, setProfile] = useState<AdvertiserProfile | null>(
    seed ? cloneProfile(seed) : null,
  )
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const next = getAdvertiserProfileForCompany(selectedCompanyId)
    setProfile(next ? cloneProfile(next) : null)
    setEditOpen(false)
  }, [selectedCompanyId])

  if (!canAccessSelectedCompany || !selectedCompanyId || !profile) {
    return <UnauthorizedCompanyAccess />
  }

  function handleSaveCompany(values: AdvertiserCompanyEditableFields) {
    const today = new Date().toISOString().slice(0, 10)
    setProfile((current) => {
      if (!current) return current
      return {
        ...current,
        company: {
          name: values.name,
          sector: values.sector,
          description: values.description,
          website: values.website,
          logoUrl: values.logoUrl ? values.logoUrl : null,
          logoInitials: getCompanyInitials(values.name),
        },
        account: {
          ...current.account,
          updatedAt: today,
        },
      }
    })
    setEditOpen(false)
    showToast('Şirket profili güncellendi.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Şirket Profili"
        context={`${selectedCompany?.name ?? profile.company.name} Reklam Hesabı`}
        description="Reklam hesabı, şirket bilgileri, marka güvenliği ve faturalama ayarlarını yönetin. Bu sayfa yalnızca seçili yetkili şirketin verilerini gösterir."
        actions={
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden />
            Profili Düzenle
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 lg:col-span-2">
          <CompanyInfoCard
            company={profile.company}
            onEdit={() => setEditOpen(true)}
          />
        </div>

        <AccountStatusCard account={profile.account} />
        <DefaultCampaignSettingsCard
          settings={profile.defaultCampaignSettings}
        />
        <BrandSafetyCard brandSafety={profile.brandSafety} />
        <BillingCard billing={profile.billing} />
      </div>

      <EditCompanyProfileModal
        open={editOpen}
        company={profile.company}
        onCancel={() => setEditOpen(false)}
        onSave={handleSaveCompany}
      />

      {toastNode}
    </div>
  )
}
