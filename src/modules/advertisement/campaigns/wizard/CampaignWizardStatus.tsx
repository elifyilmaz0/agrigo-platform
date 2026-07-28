type CampaignWizardStatusProps = {
  hasBeenSaved: boolean
  lastSavedAt: string | null
  isDirty: boolean
}

export default function CampaignWizardStatus({
  hasBeenSaved,
  lastSavedAt,
  isDirty,
}: CampaignWizardStatusProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
      {!hasBeenSaved ? (
        <p className="text-xs text-slate-600">
          Kampanya henüz taslak olarak oluşturulmadı.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700">
            Taslak
          </span>
          {lastSavedAt ? (
            <span className="text-slate-500">Son kaydedilme: {lastSavedAt}</span>
          ) : null}
          {isDirty ? (
            <span className="font-medium text-amber-700">
              Kaydedilmemiş değişiklikler var
            </span>
          ) : (
            <span className="text-emerald-700">Değişiklikler kaydedildi</span>
          )}
        </div>
      )}
    </div>
  )
}
