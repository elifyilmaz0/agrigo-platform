type CampaignWizardFooterProps = {
  isFirstStep: boolean
  isLastStep: boolean
  onCancel: () => void
  onSaveDraft: () => void
  onBack: () => void
  onNext: () => void
}

export default function CampaignWizardFooter({
  isFirstStep,
  isLastStep,
  onCancel,
  onSaveDraft,
  onBack,
  onNext,
}: CampaignWizardFooterProps) {
  return (
    <div className="campaign-wizard-footer sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur print:hidden sm:-mx-0 sm:rounded-b-lg lg:px-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            Taslak Olarak Kaydet
          </button>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={isFirstStep}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Geri
          </button>
          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              İleri
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
