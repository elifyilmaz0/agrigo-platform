import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog.tsx'
import { useToast } from '../../hooks/useToast.tsx'
import { adPaths } from '../../paths.ts'
import { useCampaignStore } from '../../state/CampaignStore.tsx'
import { useTenant } from '../../tenant/TenantProvider.tsx'
import {
  createEmptyCampaignDraft,
  mapCampaignToDraft,
  type CampaignDraft,
} from './campaignDraft.ts'
import {
  CAMPAIGN_WIZARD_STEPS,
  getAdjacentWizardStep,
  getWizardStepIndex,
  parseWizardStepId,
  type CampaignWizardStepId,
} from './campaignWizardSteps.ts'
import { validateStep, focusWizardField } from './campaignWizardValidation.ts'
import CampaignWizardFooter from './CampaignWizardFooter.tsx'
import CampaignWizardHeader from './CampaignWizardHeader.tsx'
import CampaignWizardStatus from './CampaignWizardStatus.tsx'
import CampaignWizardStepper from './CampaignWizardStepper.tsx'
import AudienceStep from './steps/AudienceStep.tsx'
import BudgetStep from './steps/BudgetStep.tsx'
import CampaignInfoStep from './steps/CampaignInfoStep.tsx'
import CreativeStep from './steps/CreativeStep.tsx'
import LaunchSimulationStep from './steps/LaunchSimulationStep.tsx'
import PreviewStep from './steps/PreviewStep.tsx'
import ProductStep from './steps/ProductStep.tsx'
import ScheduleStep from './steps/ScheduleStep.tsx'
import TargetingRulesStep from './steps/TargetingRulesStep.tsx'

function formatSavedAt(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CampaignWizardPage() {
  const { campaignId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getCampaign } = useCampaignStore()
  const { selectedCompanyId } = useTenant()
  const { showToast, toastNode } = useToast()

  const mode: 'new' | 'edit' = campaignId ? 'edit' : 'new'
  const existingCampaign = campaignId ? getCampaign(campaignId) : undefined
  const preselectedProductId = searchParams.get('productId')

  const [draft, setDraft] = useState<CampaignDraft>(() => {
    if (mode === 'edit' && existingCampaign) {
      return mapCampaignToDraft(existingCampaign)
    }
    return createEmptyCampaignDraft(preselectedProductId, selectedCompanyId)
  })
  const [initializedEditId, setInitializedEditId] = useState<string | null>(
    mode === 'edit' && existingCampaign ? existingCampaign.id : null,
  )
  const [isDirty, setIsDirty] = useState(false)
  const [hasBeenSaved, setHasBeenSaved] = useState(mode === 'edit')
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    mode === 'edit' ? formatSavedAt(new Date()) : null,
  )
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [pendingExitTo, setPendingExitTo] = useState<string | null>(null)
  const [simulationDone, setSimulationDone] = useState(false)

  const rawStep = searchParams.get('step')
  const activeStepId = parseWizardStepId(rawStep)
  const activeIndex = getWizardStepIndex(activeStepId)
  const isFirstStep = activeIndex <= 0
  const isLastStep = activeIndex >= CAMPAIGN_WIZARD_STEPS.length - 1

  // Normalize invalid/missing step in URL (source of truth = URL)
  useEffect(() => {
    if (rawStep === activeStepId) return
    const next = new URLSearchParams(searchParams)
    next.set('step', activeStepId)
    setSearchParams(next, { replace: true })
  }, [rawStep, activeStepId, searchParams, setSearchParams])

  // Re-init when edit campaign id changes
  useEffect(() => {
    if (mode !== 'edit' || !existingCampaign) return
    if (initializedEditId === existingCampaign.id) return
    setDraft(mapCampaignToDraft(existingCampaign))
    setInitializedEditId(existingCampaign.id)
    setIsDirty(false)
    setHasBeenSaved(true)
    setLastSavedAt(formatSavedAt(new Date()))
    setSimulationDone(false)
    setStepErrors({})
  }, [mode, existingCampaign, initializedEditId])

  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const setStepInUrl = useCallback(
    (stepId: CampaignWizardStepId) => {
      const next = new URLSearchParams(searchParams)
      next.set('step', stepId)
      setSearchParams(next)
    },
    [searchParams, setSearchParams],
  )

  const patchDraft = useCallback(
    (patch: Partial<CampaignDraft>) => {
      setDraft((current) => {
        const next = { ...current, ...patch }
        setStepErrors((prev) => {
          if (Object.keys(prev).length === 0) return prev
          return validateStep(activeStepId, next).errors
        })
        return next
      })
      setIsDirty(true)
      setSimulationDone(false)
    },
    [activeStepId],
  )

  function requestExit(target: string) {
    if (!isDirty) {
      navigate(target)
      return
    }
    setPendingExitTo(target)
    setExitConfirmOpen(true)
  }

  function confirmExit() {
    const target = pendingExitTo ?? adPaths.campaigns
    setExitConfirmOpen(false)
    setPendingExitTo(null)
    setIsDirty(false)
    navigate(target)
  }

  function handleSaveDraft() {
    setHasBeenSaved(true)
    setLastSavedAt(formatSavedAt(new Date()))
    setIsDirty(false)
    showToast('Taslak kaydedildi.')
  }

  function handleNext() {
    const validation = validateStep(activeStepId, draft)
    if (!validation.valid) {
      setStepErrors(validation.errors)
      focusWizardField(validation.firstInvalidField)
      return
    }
    setStepErrors({})
    const next = getAdjacentWizardStep(activeStepId, 'next')
    if (next) setStepInUrl(next.id)
  }

  function handleBack() {
    const prev = getAdjacentWizardStep(activeStepId, 'prev')
    if (prev) setStepInUrl(prev.id)
  }

  function renderActiveStep() {
    switch (activeStepId) {
      case 'campaign-info':
        return (
          <CampaignInfoStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
          />
        )
      case 'product':
        return (
          <ProductStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
            onAddProduct={() => requestExit(adPaths.productNew)}
          />
        )
      case 'creative':
        return (
          <CreativeStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
            onGoToStep={setStepInUrl}
          />
        )
      case 'audience':
        return (
          <AudienceStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
            onGoToStep={setStepInUrl}
          />
        )
      case 'targeting-rules':
        return (
          <TargetingRulesStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
          />
        )
      case 'schedule':
        return (
          <ScheduleStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
          />
        )
      case 'budget':
        return (
          <BudgetStep
            draft={draft}
            errors={stepErrors}
            onChange={patchDraft}
            onGoToStep={setStepInUrl}
          />
        )
      case 'preview':
        return <PreviewStep draft={draft} onGoToStep={setStepInUrl} />
      case 'launch-simulation':
        return (
          <LaunchSimulationStep
            draft={draft}
            simulationDone={simulationDone}
            onSimulationComplete={() => {
              setSimulationDone(true)
              showToast('Yayın simülasyonu tamamlandı. Gerçek yayın yapılmadı.')
            }}
            onResetSimulation={() => setSimulationDone(false)}
            onGoToStep={setStepInUrl}
          />
        )
      default:
        return null
    }
  }

  if (mode === 'edit' && !existingCampaign) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <h1 className="text-base font-semibold text-slate-900">
          Kampanya bulunamadı
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Düzenlemek istediğiniz kampanya mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          to={adPaths.campaigns}
          className="mt-4 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
        >
          Kampanyalara Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CampaignWizardHeader
        mode={mode}
        campaignName={existingCampaign?.name ?? draft.name}
        activeStepId={activeStepId}
        onBack={() => requestExit(adPaths.campaigns)}
      />

      <CampaignWizardStatus
        hasBeenSaved={hasBeenSaved}
        lastSavedAt={lastSavedAt}
        isDirty={isDirty}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <CampaignWizardStepper
          activeStepId={activeStepId}
          onStepSelect={setStepInUrl}
        />

        <div className="min-w-0 flex-1 space-y-4">
          {renderActiveStep()}
          <CampaignWizardFooter
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onCancel={() => requestExit(adPaths.campaigns)}
            onSaveDraft={handleSaveDraft}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </div>

      <ConfirmDialog
        open={exitConfirmOpen}
        title="Kaydedilmemiş değişiklikleriniz var."
        description="Bu sayfadan ayrılırsanız yaptığınız değişiklikler kaybolacak."
        confirmLabel="Değişiklikleri Sil ve Çık"
        cancelLabel="Kal ve Düzenlemeye Devam Et"
        danger
        onCancel={() => {
          setExitConfirmOpen(false)
          setPendingExitTo(null)
        }}
        onConfirm={confirmExit}
      />

      {toastNode}
    </div>
  )
}
