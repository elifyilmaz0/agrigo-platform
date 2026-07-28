import {
  advertiserAccountStatusLabels,
  advertiserAccountStatusStyles,
} from '../../data/advertiserProfile.ts'
import type { AdvertiserAccountDetails } from '../../types/advertiserProfile.ts'
import { formatDate } from '../../utils/formatters.ts'
import ProfileInfoRow from './ProfileInfoRow.tsx'
import ProfileSectionCard from './ProfileSectionCard.tsx'

type AccountStatusCardProps = {
  account: AdvertiserAccountDetails
}

export default function AccountStatusCard({ account }: AccountStatusCardProps) {
  return (
    <ProfileSectionCard
      title="Hesap Durumu"
      description="Reklamveren hesabınızın platform üzerindeki durumu."
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <ProfileInfoRow
            label="Reklamveren ID"
            value={
              <span className="font-mono text-xs tracking-wide text-slate-800">
                {account.advertiserId}
              </span>
            }
          />
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <ProfileInfoRow
            label="Hesap Durumu"
            value={
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${advertiserAccountStatusStyles[account.status]}`}
              >
                {advertiserAccountStatusLabels[account.status]}
              </span>
            }
          />
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <ProfileInfoRow
            label="Kayıt Tarihi"
            value={formatDate(account.registeredAt)}
          />
        </div>
        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <ProfileInfoRow
            label="Son Güncelleme"
            value={formatDate(account.updatedAt)}
          />
        </div>
      </dl>
    </ProfileSectionCard>
  )
}
