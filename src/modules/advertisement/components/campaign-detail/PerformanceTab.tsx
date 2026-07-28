import { useMemo, useState } from 'react'
import EmptyState from '../EmptyState.tsx'
import InfoTooltip from '../InfoTooltip.tsx'
import MetricCard from '../MetricCard.tsx'
import type { Campaign } from '../../types/advertisement.ts'
import {
  clickThroughRate,
  deriveBulkFunnel,
  hasPerformanceData,
} from '../../utils/campaignMetrics.ts'
import { metricTooltips } from '../../utils/metricTooltips.ts'
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from '../../utils/formatters.ts'

type PerformanceTabProps = {
  campaign: Campaign
}

type NativeMetricKey = 'impressions' | 'clicks' | 'conversions'

function SimpleLineChart({
  labels,
  values,
}: {
  labels: string[]
  values: number[]
}) {
  const width = 560
  const height = 180
  const padding = 24
  const max = Math.max(...values, 1)

  const points = values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(values.length - 1, 1)
    const y = height - padding - (value / max) * (height - padding * 2)
    return `${x},${y}`
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-44 w-full"
      role="img"
      aria-label="Performans trend grafiği"
    >
      <polyline
        fill="none"
        stroke="#059669"
        strokeWidth="2.5"
        points={points.join(' ')}
      />
      {values.map((value, index) => {
        const x =
          padding +
          (index * (width - padding * 2)) / Math.max(values.length - 1, 1)
        const y = height - padding - (value / max) * (height - padding * 2)
        return (
          <circle key={labels[index]} cx={x} cy={y} r="3" fill="#059669">
            <title>
              {labels[index]}: {value}
            </title>
          </circle>
        )
      })}
    </svg>
  )
}

function NativePerformance({ campaign }: { campaign: Campaign }) {
  const [metric, setMetric] = useState<NativeMetricKey>('impressions')
  const metrics = campaign.nativeDailyMetrics ?? []

  const impressions = campaign.impressions ?? 0
  const clicks = campaign.clicks ?? 0
  const conversions = campaign.conversions ?? 0
  const ctr = clickThroughRate(impressions, clicks)

  const chartValues = useMemo(
    () => metrics.map((day) => day[metric]),
    [metrics, metric],
  )
  const chartLabels = metrics.map((day) => formatDate(day.date))

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Gösterim"
          value={formatNumber(impressions)}
          tooltip={
            <InfoTooltip label="Gösterim" text={metricTooltips.impressions} />
          }
        />
        <MetricCard
          label="Tıklama"
          value={formatNumber(clicks)}
          tooltip={
            <InfoTooltip label="Tıklama" text={metricTooltips.clicks} />
          }
        />
        <MetricCard
          label="Dönüşüm"
          value={formatNumber(conversions)}
          tooltip={
            <InfoTooltip label="Dönüşüm" text={metricTooltips.conversions} />
          }
        />
        <MetricCard
          label="Tıklama Oranı"
          value={`%${ctr.toFixed(1)}`}
          tooltip={<InfoTooltip label="CTR" text={metricTooltips.ctr} />}
        />
        <MetricCard
          label="Tahmini Harcama"
          value={formatCurrency(campaign.estimatedSpend)}
          tooltip={
            <InfoTooltip
              label="Tahmini Reklam Harcaması"
              text={metricTooltips.estimatedAdSpend}
            />
          }
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            Trend (son {metrics.length} gün)
          </h3>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ['impressions', 'Gösterim'],
                ['clicks', 'Tıklama'],
                ['conversions', 'Dönüşüm'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMetric(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  metric === key
                    ? 'bg-emerald-700 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <SimpleLineChart labels={chartLabels} values={chartValues} />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Tarih</th>
                <th className="px-4 py-2.5 font-medium">Gösterim</th>
                <th className="px-4 py-2.5 font-medium">Tıklama</th>
                <th className="px-4 py-2.5 font-medium">Dönüşüm</th>
                <th className="px-4 py-2.5 font-medium">Tahmini Harcama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((day) => (
                <tr key={day.date}>
                  <td className="px-4 py-2.5 text-slate-700">
                    {formatDate(day.date)}
                  </td>
                  <td className="px-4 py-2.5">{formatNumber(day.impressions)}</td>
                  <td className="px-4 py-2.5">{formatNumber(day.clicks)}</td>
                  <td className="px-4 py-2.5">{formatNumber(day.conversions)}</td>
                  <td className="px-4 py-2.5">
                    {formatCurrency(day.estimatedSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {metrics.map((day) => (
            <div key={day.date} className="space-y-1 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-800">
                {formatDate(day.date)}
              </p>
              <p className="text-slate-600">
                {formatNumber(day.impressions)} gösterim ·{' '}
                {formatNumber(day.clicks)} tıklama ·{' '}
                {formatNumber(day.conversions)} dönüşüm
              </p>
              <p className="text-slate-500">
                {formatCurrency(day.estimatedSpend)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function BulkPerformance({ campaign }: { campaign: Campaign }) {
  const rates = campaign.bulkPerformance
  if (!rates) {
    return (
      <EmptyState
        title="Performans verisi yok"
        description="Bu kampanya için toplu mesaj performans verisi tanımlı değil."
      />
    )
  }

  const funnel = deriveBulkFunnel(rates)

  const steps = [
    {
      label: 'Hedeflenen Uygun Kitle',
      value: funnel.eligibleAudience,
    },
    { label: 'Teslim Edildi', value: funnel.delivered },
    { label: 'Okundu', value: funnel.read },
    { label: 'Tıklandı', value: funnel.clicked },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Hedeflenen Uygun Kitle"
          value={formatNumber(funnel.eligibleAudience)}
          tooltip={
            <InfoTooltip label="Hedeflenen" text={metricTooltips.targeted} />
          }
        />
        <MetricCard
          label="Teslim Edildi"
          value={formatNumber(funnel.delivered)}
          tooltip={
            <InfoTooltip label="Teslim" text={metricTooltips.delivered} />
          }
        />
        <MetricCard
          label="Okundu"
          value={formatNumber(funnel.read)}
          tooltip={<InfoTooltip label="Okundu" text={metricTooltips.read} />}
        />
        <MetricCard
          label="Tıklandı"
          value={formatNumber(funnel.clicked)}
          tooltip={
            <InfoTooltip label="Tıklandı" text={metricTooltips.clickedBulk} />
          }
        />
        <MetricCard label="Başarısız" value={formatNumber(funnel.failed)} />
        <MetricCard
          label="Tahmini Harcama"
          value={formatCurrency(funnel.estimatedSpend)}
          tooltip={
            <InfoTooltip
              label="Tahmini Reklam Harcaması"
              text={metricTooltips.estimatedAdSpend}
            />
          }
        />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Huni</h3>
        <div className="mt-4 space-y-2">
          {steps.map((step, index) => {
            const widthPct =
              (step.value / Math.max(funnel.eligibleAudience, 1)) * 100
            return (
              <div key={step.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    {index > 0 ? '→ ' : ''}
                    {step.label}
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatNumber(step.value)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <dl className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <div>
            Teslim oranı:{' '}
            <span className="font-semibold text-slate-800">
              %{funnel.deliveryRatePct.toFixed(1)}
            </span>
          </div>
          <div>
            Okunma oranı:{' '}
            <span className="font-semibold text-slate-800">
              %{funnel.readRatePct.toFixed(1)}
            </span>
          </div>
          <div>
            Tıklama oranı:{' '}
            <span className="font-semibold text-slate-800">
              %{funnel.clickRatePct.toFixed(1)}
            </span>
          </div>
        </dl>
        <p className="mt-3 text-[11px] text-slate-400">
          Teslim Edildi + Başarısız = Hedeflenen · Hedeflenen ≥ Teslim ≥ Okundu ≥
          Tıklandı
        </p>
      </section>
    </div>
  )
}

export default function PerformanceTab({ campaign }: PerformanceTabProps) {
  if (!hasPerformanceData(campaign.status)) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
          {['Gösterim', 'Tıklama', 'Dönüşüm', 'Oran', 'Harcama'].map((label) => (
            <MetricCard key={label} label={label} value="—" />
          ))}
        </div>
        <EmptyState
          title="Performans verisi yok"
          description="Bu kampanya henüz yayınlanmadığı için performans verisi bulunmuyor."
        />
      </div>
    )
  }

  if (campaign.type === 'native_recommendation') {
    return <NativePerformance campaign={campaign} />
  }

  return <BulkPerformance campaign={campaign} />
}
