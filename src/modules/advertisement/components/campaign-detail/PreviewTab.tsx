import { useState } from 'react'
import EmptyState from '../EmptyState.tsx'
import MetricCard from '../MetricCard.tsx'
import type { Campaign, NativeCreative } from '../../types/advertisement.ts'
import { deriveBulkFunnel } from '../../utils/campaignMetrics.ts'
import { formatCurrency, formatNumber } from '../../utils/formatters.ts'

type PreviewTabProps = {
  campaign: Campaign
}

function NativePreview({ campaign }: { campaign: Campaign }) {
  const scenarios = campaign.nativePreviewScenarios ?? []
  const [activeId, setActiveId] = useState(scenarios[0]?.id ?? '')
  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const creative = campaign.creative as NativeCreative

  if (!active) {
    return (
      <EmptyState
        title="Önizleme senaryosu yok"
        description="Bu kampanya için native önizleme senaryosu tanımlı değil."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => setActiveId(scenario.id)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
              activeId === scenario.id
                ? 'bg-emerald-700 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            AgriGO AI sohbet önizlemesi
          </h3>
          <div className="space-y-3 rounded-lg bg-slate-50 p-3">
            <div className="ml-auto max-w-[90%] rounded-lg rounded-br-sm bg-emerald-700 px-3 py-2 text-xs leading-relaxed text-white">
              {active.farmerQuestion}
            </div>
            <div className="max-w-[90%] rounded-lg rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700">
              {active.aiResponse}
            </div>
            {active.showRecommendation ? (
              <div className="max-w-[90%] rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <span className="inline-flex rounded-md border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                  Sponsorlu Öneri
                </span>
                <p className="mt-2 text-xs font-semibold text-slate-900">
                  {creative.headline}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {creative.recommendationText}
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-2 text-[11px] font-semibold text-emerald-700 opacity-80"
                >
                  {creative.ctaText}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Simülasyon Sonucu
          </h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Sonuç</dt>
              <dd className="mt-0.5 font-semibold text-slate-800">
                {active.resultLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Genel neden</dt>
              <dd className="mt-0.5 text-slate-700">{active.resultReason}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">
                Kampanya/kreatif uygunluğu
              </dt>
              <dd className="mt-0.5 text-slate-700">{active.creativeFit}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Bu yalnızca simülasyon sonucudur.
          </p>
        </section>
      </div>
    </div>
  )
}

function BulkPreview({ campaign }: { campaign: Campaign }) {
  const [status, setStatus] = useState(
    campaign.bulkSimulationStatus ?? 'not_run',
  )
  const creative = campaign.creative
  const rates = campaign.bulkPerformance
  const funnel = rates ? deriveBulkFunnel(rates) : null

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Bu sonuçlar simülasyondur — gerçek bir mesaj gönderilmemiştir.
      </div>

      {status === 'not_run' ? (
        <EmptyState
          title="Simülasyon çalıştırılmadı"
          description="Bu kampanya için henüz toplu mesaj simülasyonu çalıştırılmadı."
          action={
            <button
              type="button"
              onClick={() => setStatus('completed')}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Simülasyonu Çalıştır
            </button>
          }
        />
      ) : null}

      {status === 'failed' ? (
        <EmptyState
          title="Simülasyon sonucu yüklenemedi."
          description="Tekrar deneyebilirsiniz."
          action={
            <button
              type="button"
              onClick={() => setStatus('completed')}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Tekrar Dene
            </button>
          }
        />
      ) : null}

      {status === 'completed' && creative.kind === 'bulk' && funnel ? (
        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Mesaj önizlemesi
            </h3>
            <div className="rounded-2xl bg-[#ece5dd] p-3">
              <div className="ml-auto max-w-[90%] rounded-lg bg-[#dcf8c6] px-3 py-2">
                <p className="text-xs font-semibold text-slate-800">
                  {creative.messageTitle}
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  {creative.messageBody}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Hedeflenen"
              value={formatNumber(funnel.eligibleAudience)}
            />
            <MetricCard
              label="Teslim"
              value={formatNumber(funnel.delivered)}
            />
            <MetricCard label="Okundu" value={formatNumber(funnel.read)} />
            <MetricCard
              label="Tıklandı"
              value={formatNumber(funnel.clicked)}
            />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">Huni özeti</h3>
            <p className="mt-2 text-sm text-slate-700">
              {formatNumber(funnel.eligibleAudience)} →{' '}
              {formatNumber(funnel.delivered)} → {formatNumber(funnel.read)} →{' '}
              {formatNumber(funnel.clicked)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Tahmini harcama: {formatCurrency(funnel.estimatedSpend)}
            </p>
            <button
              type="button"
              onClick={() => setStatus('failed')}
              className="mt-3 text-xs font-medium text-slate-500 underline"
            >
              Simülasyon hatasını test et
            </button>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default function PreviewTab({ campaign }: PreviewTabProps) {
  if (campaign.type === 'native_recommendation') {
    return <NativePreview campaign={campaign} />
  }
  return <BulkPreview campaign={campaign} />
}
