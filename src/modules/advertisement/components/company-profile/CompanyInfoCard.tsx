import { Pencil } from 'lucide-react'
import type { AdvertiserCompanyDetails } from '../../types/advertiserProfile.ts'
import CompanyLogoAvatar from './CompanyLogoAvatar.tsx'
import ProfileInfoRow from './ProfileInfoRow.tsx'
import ProfileSectionCard from './ProfileSectionCard.tsx'

type CompanyInfoCardProps = {
  company: AdvertiserCompanyDetails
  onEdit: () => void
}

export default function CompanyInfoCard({
  company,
  onEdit,
}: CompanyInfoCardProps) {
  return (
    <ProfileSectionCard
      title="Şirket Bilgileri"
      description="Reklam hesabınıza ait temel bilgiler."
      actions={
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Profili Düzenle
        </button>
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <CompanyLogoAvatar
          name={company.name}
          initials={company.logoInitials}
          logoUrl={company.logoUrl}
        />
        <dl className="min-w-0 flex-1 space-y-3.5">
          <ProfileInfoRow label="Şirket Adı" value={company.name} />
          <ProfileInfoRow label="Sektör" value={company.sector} />
          <ProfileInfoRow
            label="Şirket Açıklaması"
            value={
              <span className="block text-left text-sm font-normal leading-relaxed text-slate-700 sm:text-right">
                {company.description}
              </span>
            }
          />
          <ProfileInfoRow
            label="Web Sitesi"
            value={
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="break-all text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {company.website}
              </a>
            }
          />
        </dl>
      </div>
    </ProfileSectionCard>
  )
}
