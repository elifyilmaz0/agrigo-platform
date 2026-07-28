import { Check } from 'lucide-react'
import {
  ALLOW_FREE_STEP_NAVIGATION,
  CAMPAIGN_WIZARD_STEPS,
  getWizardStepVisualStatus,
  type CampaignWizardStepId,
} from './campaignWizardSteps.ts'

type CampaignWizardStepperProps = {
  activeStepId: CampaignWizardStepId
  onStepSelect: (stepId: CampaignWizardStepId) => void
}

export default function CampaignWizardStepper({
  activeStepId,
  onStepSelect,
}: CampaignWizardStepperProps) {
  return (
    <>
      {/* Desktop vertical */}
      <nav
        aria-label="Kampanya sihirbazı adımları"
        className="hidden w-[280px] shrink-0 print:hidden lg:block"
      >
        <ol className="sticky top-4 space-y-1 rounded-lg border border-slate-200 bg-white p-3">
          {CAMPAIGN_WIZARD_STEPS.map((step) => {
            const status = getWizardStepVisualStatus(step.id, activeStepId)
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!ALLOW_FREE_STEP_NAVIGATION && status === 'upcoming') {
                      return
                    }
                    onStepSelect(step.id)
                  }}
                  disabled={!ALLOW_FREE_STEP_NAVIGATION && status === 'upcoming'}
                  aria-current={status === 'active' ? 'step' : undefined}
                  className={`flex w-full items-start gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    status === 'active'
                      ? 'border border-emerald-200 bg-emerald-50'
                      : status === 'completed'
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-slate-50'
                  }`}
                >
                  <StepBadge status={status} order={step.order} />
                  <div className="min-w-0 pt-0.5">
                    <p
                      className={`text-xs font-semibold ${
                        status === 'active'
                          ? 'text-emerald-900'
                          : status === 'completed'
                            ? 'text-slate-700'
                            : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Mobile horizontal */}
      <nav
        aria-label="Kampanya sihirbazı adımları"
        className="-mx-1 overflow-x-auto px-1 print:hidden lg:hidden"
      >
        <ol className="flex min-w-max gap-1.5 pb-1">
          {CAMPAIGN_WIZARD_STEPS.map((step) => {
            const status = getWizardStepVisualStatus(step.id, activeStepId)
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!ALLOW_FREE_STEP_NAVIGATION && status === 'upcoming') {
                      return
                    }
                    onStepSelect(step.id)
                  }}
                  disabled={!ALLOW_FREE_STEP_NAVIGATION && status === 'upcoming'}
                  aria-current={status === 'active' ? 'step' : undefined}
                  className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-2 text-left disabled:cursor-not-allowed disabled:opacity-50 ${
                    status === 'active'
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <StepBadge status={status} order={step.order} compact />
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      status === 'active' ? 'text-emerald-900' : 'text-slate-600'
                    }`}
                  >
                    {step.shortLabel}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

function StepBadge({
  status,
  order,
  compact = false,
}: {
  status: 'completed' | 'active' | 'upcoming'
  order: number
  compact?: boolean
}) {
  const size = compact ? 'h-6 w-6 text-[10px]' : 'h-7 w-7 text-[11px]'

  if (status === 'completed') {
    return (
      <span
        className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700`}
      >
        <Check className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden />
        <span className="sr-only">Tamamlandı</span>
      </span>
    )
  }

  if (status === 'active') {
    return (
      <span
        className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full bg-emerald-700 font-semibold text-white`}
      >
        {order}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex ${size} shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-medium text-slate-400`}
    >
      {order}
    </span>
  )
}
