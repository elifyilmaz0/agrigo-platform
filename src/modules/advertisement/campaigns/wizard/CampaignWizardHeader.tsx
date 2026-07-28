import { ArrowLeft } from 'lucide-react'
import {
  CAMPAIGN_WIZARD_STEPS,
  getWizardProgressPercent,
  getWizardStepIndex,
  type CampaignWizardStepId,
} from './campaignWizardSteps.ts'

type CampaignWizardHeaderProps = {
  mode: 'new' | 'edit'
  campaignName?: string
  activeStepId: CampaignWizardStepId
  onBack: () => void
}

export default function CampaignWizardHeader({
  mode,
  campaignName,
  activeStepId,
  onBack,
}: CampaignWizardHeaderProps) {
  const stepIndex = getWizardStepIndex(activeStepId)
  const progress = getWizardProgressPercent(activeStepId)
  const title = mode === 'new' ? 'Yeni Kampanya' : 'Kampanyayı Düzenle'
  const subtitle =
    mode === 'new'
      ? '9 adımlı kampanya oluşturma sihirbazı'
      : campaignName || 'Kampanya'

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kampanyalara Dön
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 truncate text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-sm font-semibold text-slate-800">
            Adım {stepIndex + 1} / {CAMPAIGN_WIZARD_STEPS.length}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">%{progress} tamamlandı</p>
        </div>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Sihirbaz ilerleme durumu"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
