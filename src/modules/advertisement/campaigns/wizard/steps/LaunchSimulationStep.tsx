import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  CircleAlert,
  Loader2,
  XCircle,
} from 'lucide-react'
import { getProductById } from '../../../data/products.ts'
import {
  formatCurrency,
  formatNumber,
} from '../../../utils/formatters.ts'
import { adPaths } from '../../../paths.ts'
import { analyzeCampaignRisks } from '../analyzeCampaignRisks.ts'
import {
  areRequiredLaunchChecksReady,
  buildLaunchChecklist,
  createSimulationId,
} from '../buildLaunchChecklist.ts'
import { calculateCampaignBudgetEstimates } from '../calculateCampaignBudgetEstimates.ts'
import { calculateCampaignReadiness } from '../calculateCampaignReadiness.ts'
import type { CampaignDraft } from '../campaignDraft.ts'
import {
  deriveOverallRiskLevel,
  overallRiskLabels,
  readinessStatusLabels,
  riskSeverityLabels,
  type LaunchSimulationResult,
} from '../campaignReadinessTypes.ts'
import type { CampaignWizardStepId } from '../campaignWizardSteps.ts'
import { formatScheduleDateTime } from '../scheduleDateHelpers.ts'

type LaunchSimulationStepProps = {
  draft: CampaignDraft
  simulationDone: boolean
  onSimulationComplete: (result: LaunchSimulationResult) => void
  onResetSimulation: () => void
  onGoToStep: (stepId: CampaignWizardStepId) => void
}

export default function LaunchSimulationStep({
  draft,
  simulationDone,
  onSimulationComplete,
  onResetSimulation,
  onGoToStep,
}: LaunchSimulationStepProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LaunchSimulationResult | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const runningRef = useRef(false)

  const readiness = calculateCampaignReadiness(draft)
  const checklist = buildLaunchChecklist(draft)
  const risks = analyzeCampaignRisks(draft)
  const overallRisk = deriveOverallRiskLevel(risks)
  const requiredReady = areRequiredLaunchChecksReady(draft)
  const estimates = calculateCampaignBudgetEstimates({
    budget: draft.budget,
    schedule: draft.schedule,
    audienceEstimatedSize: draft.audience.estimatedSize,
    campaignType: draft.campaignType,
  })
  const product = draft.productId ? getProductById(draft.productId) : undefined

  useEffect(() => {
    if (!simulationDone) {
      setResult(null)
      setLoading(false)
      runningRef.current = false
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [simulationDone])

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function runSimulation() {
    if (runningRef.current || loading) return
    if (!requiredReady) {
      setResult({
        id: createSimulationId(),
        completedAt: new Date().toISOString(),
        status: 'simulated',
        success: false,
        failedCheckIds: checklist.filter((item) => !item.ready).map((i) => i.id),
      })
      return
    }

    runningRef.current = true
    setLoading(true)
    setResult(null)

    timeoutRef.current = window.setTimeout(() => {
      const next: LaunchSimulationResult = {
        id: createSimulationId(),
        completedAt: new Date().toISOString(),
        status: 'simulated',
        success: true,
        failedCheckIds: [],
      }
      setResult(next)
      setLoading(false)
      runningRef.current = false
      onSimulationComplete(next)
      timeoutRef.current = null
    }, 1300)
  }

  function handleReplay() {
    onResetSimulation()
    setResult(null)
  }

  const startLabel =
    draft.schedule.startMode === 'now'
      ? 'Hemen başlat'
      : formatScheduleDateTime(draft.schedule.startDate, draft.schedule.startTime)
  const endLabel =
    draft.schedule.endMode === 'no-end-date'
      ? 'Bitiş tarihi yok'
      : formatScheduleDateTime(draft.schedule.endDate, draft.schedule.endTime)

  const showSuccess = result?.success === true
  const showFailure = result?.success === false

  return (
    <div className="space-y-4" aria-busy={loading}>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">
          Yayın Simülasyonu
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Kampanyanın zorunlu kontrollerini inceleyin ve gerçek yayın
          yapılmadan simülasyonu çalıştırın.
        </p>
      </section>

      {!showSuccess ? (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Hazırlık Durumu
                </h3>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                  {readiness.score}{' '}
                  <span className="text-sm font-medium text-slate-500">
                    / 100
                  </span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800">
                {readiness.status === 'ready' ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
                ) : (
                  <CircleAlert className="h-3.5 w-3.5 text-amber-700" aria-hidden />
                )}
                {readinessStatusLabels[readiness.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Genel risk: {overallRiskLabels[overallRisk]}
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Zorunlu Kontrol Listesi
            </h3>
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-100 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm text-slate-800">{item.label}</p>
                    {item.detail ? (
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {item.detail}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        item.ready ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {item.ready ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {item.statusLabel}
                    </span>
                    {!item.ready && item.relatedStep ? (
                      <button
                        type="button"
                        onClick={() => onGoToStep(item.relatedStep!)}
                        className="text-[11px] font-semibold text-emerald-700 underline"
                      >
                        Düzenle
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Öneri Kontrolleri
            </h3>
            <ul className="mt-3 space-y-1.5">
              {readiness.advisoryChecks.map((check) => (
                <li key={check.id} className="text-xs text-slate-700">
                  {check.passed ? '✓' : '○'} {check.label}
                  {!check.passed && check.detail ? (
                    <span className="ml-1 text-amber-800">— {check.detail}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Risk Özeti</h3>
            {risks.length === 0 ? (
              <p className="mt-2 text-xs text-slate-600">
                Belirgin bir kampanya riski tespit edilmedi.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                {risks.map((risk) => (
                  <li key={risk.id}>
                    • {risk.title} ({riskSeverityLabels[risk.severity]})
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Tahmini Kampanya Sonuçları
            </h3>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <Estimate
                label="Tahmini hedef kitle"
                value={
                  draft.audience.estimatedSize != null
                    ? `${formatNumber(draft.audience.estimatedSize)} çiftçi`
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini erişim"
                value={
                  estimates.estimatedReach != null
                    ? `${formatNumber(estimates.estimatedReach)} kişi`
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini gösterim"
                value={
                  estimates.estimatedImpressions != null
                    ? formatNumber(estimates.estimatedImpressions)
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini reklam harcaması"
                value={
                  estimates.estimatedTotalSpend != null
                    ? formatCurrency(estimates.estimatedTotalSpend)
                    : 'Henüz belirlenmedi'
                }
              />
            </dl>
            <p className="mt-2 text-[11px] text-slate-500">
              Bu değerler gerçek performans garantisi değildir.
            </p>
          </section>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <button
              type="button"
              onClick={runSimulation}
              disabled={!requiredReady || loading}
              aria-disabled={!requiredReady || loading}
              title={
                !requiredReady
                  ? 'Simülasyonu çalıştırmak için zorunlu kampanya alanlarını tamamlayın.'
                  : undefined
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Kampanya kontrolleri simüle ediliyor...
                </>
              ) : (
                'Yayın Simülasyonunu Çalıştır'
              )}
            </button>
            {!requiredReady ? (
              <p className="mt-2 text-xs text-amber-800">
                Simülasyonu çalıştırmak için zorunlu kampanya alanlarını
                tamamlayın.
              </p>
            ) : null}
          </div>

          {showFailure ? (
            <section
              aria-labelledby="sim-fail-heading"
              className="rounded-lg border border-rose-200 bg-rose-50 p-5"
            >
              <h3
                id="sim-fail-heading"
                className="flex items-center gap-2 text-sm font-semibold text-rose-900"
              >
                <XCircle className="h-4 w-4" aria-hidden />
                Yayın Simülasyonu Tamamlanamadı
              </h3>
              <p className="mt-1 text-xs text-rose-800">
                Bazı zorunlu kampanya kontrolleri tamamlanmadı.
              </p>
              <ul className="mt-3 space-y-2">
                {checklist
                  .filter((item) => !item.ready)
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-xs text-rose-900"
                    >
                      <span>{item.label}</span>
                      {item.relatedStep ? (
                        <button
                          type="button"
                          onClick={() => onGoToStep(item.relatedStep!)}
                          className="font-semibold underline"
                        >
                          Düzenle
                        </button>
                      ) : null}
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {showSuccess && result ? (
        <section
          aria-labelledby="sim-success-heading"
          className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-5"
        >
          <div>
            <h3
              id="sim-success-heading"
              className="flex items-center gap-2 text-base font-semibold text-emerald-950"
            >
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              Yayın Simülasyonu Başarılı
            </h3>
            <p className="mt-1 text-xs text-emerald-900">
              Kampanya gerçekten yayınlanmadı. Tüm zorunlu kontroller mock
              simülasyon kapsamında başarıyla tamamlandı.
            </p>
          </div>

          <dl className="grid gap-2 sm:grid-cols-3">
            <Estimate label="Simülasyon Kimliği" value={result.id} />
            <Estimate
              label="Tamamlanma Zamanı"
              value={new Date(result.completedAt).toLocaleString('tr-TR')}
            />
            <Estimate label="Kampanya Durumu" value="Simüle Edildi" />
          </dl>

          <div>
            <h4 className="text-xs font-semibold text-emerald-950">
              Tamamlanan Kontroller
            </h4>
            <ul className="mt-2 grid gap-1 text-xs text-emerald-900 sm:grid-cols-2">
              {[
                'Kampanya validation',
                'Ürün kontrolü',
                'Kreatif kontrolü',
                'Hedef kitle kontrolü',
                'Zamanlama kontrolü',
                'Bütçe kontrolü',
                'Consent varsayımları',
                'Delivery simulation',
              ].map((label) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-emerald-950">
              Tahmini Sonuçlar
            </h4>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              <Estimate label="Ürün" value={product?.name ?? 'Henüz belirlenmedi'} />
              <Estimate
                label="Tahmini hedef kitle"
                value={
                  draft.audience.estimatedSize != null
                    ? `${formatNumber(draft.audience.estimatedSize)} çiftçi`
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini erişim"
                value={
                  estimates.estimatedReach != null
                    ? `${formatNumber(estimates.estimatedReach)} kişi`
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini gösterim"
                value={
                  estimates.estimatedImpressions != null
                    ? formatNumber(estimates.estimatedImpressions)
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate
                label="Tahmini reklam harcaması"
                value={
                  estimates.estimatedTotalSpend != null
                    ? formatCurrency(estimates.estimatedTotalSpend)
                    : 'Henüz belirlenmedi'
                }
              />
              <Estimate label="Başlangıç" value={startLabel} />
              <Estimate label="Bitiş" value={endLabel} />
            </dl>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              to={adPaths.campaigns}
              className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Kampanyalara Dön
            </Link>
            <button
              type="button"
              onClick={() => onGoToStep('campaign-info')}
              className="inline-flex items-center justify-center rounded-md border border-emerald-300 bg-white px-3 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
            >
              Kampanyayı Düzenlemeye Devam Et
            </button>
            <Link
              to={adPaths.campaignNew}
              className="inline-flex items-center justify-center rounded-md border border-emerald-300 bg-white px-3 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
            >
              Yeni Kampanya Oluştur
            </Link>
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Tekrar Simüle Et
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function Estimate({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-emerald-100/80 bg-white/70 px-3 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs font-semibold text-slate-900">{value}</dd>
    </div>
  )
}
