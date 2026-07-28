import type { AdvertiserDefaultCampaignSettings } from '../../types/advertiserProfile.ts'
import { formatCurrency, formatNumber } from '../../utils/formatters.ts'
import ProfileInfoRow from './ProfileInfoRow.tsx'
import ProfileSectionCard from './ProfileSectionCard.tsx'

type DefaultCampaignSettingsCardProps = {
  settings: AdvertiserDefaultCampaignSettings
}

export default function DefaultCampaignSettingsCard({
  settings,
}: DefaultCampaignSettingsCardProps) {
  return (
    <ProfileSectionCard
      title="Varsayılan Kampanya Ayarları"
      description="Yeni kampanya oluştururken kullanılacak varsayılan ayarlar."
      footnote="Bu bölüm şimdilik yalnızca görüntülenir. Daha sonra düzenlenebilir hale getirilecektir."
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <SettingTile
          label="Varsayılan Günlük Bütçe"
          value={formatCurrency(settings.defaultDailyBudget)}
        />
        <SettingTile
          label="Varsayılan Toplam Bütçe"
          value={formatCurrency(settings.defaultTotalBudget)}
        />
        <SettingTile
          label="Varsayılan Kampanya Süresi"
          value={`${formatNumber(settings.defaultDurationDays)} Gün`}
        />
        <SettingTile
          label="Varsayılan Frekans Limiti"
          value={settings.defaultFrequencyLabel}
        />
      </dl>
    </ProfileSectionCard>
  )
}

function SettingTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
      <ProfileInfoRow label={label} value={value} />
    </div>
  )
}
