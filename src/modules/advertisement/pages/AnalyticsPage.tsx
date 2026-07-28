import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Download, FileText, Sparkles, X } from 'lucide-react'
import InfoTooltip from '../components/InfoTooltip.tsx'
import MetricCard from '../components/MetricCard.tsx'
import PageHeader from '../components/PageHeader.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import UnauthorizedCompanyAccess from '../components/UnauthorizedCompanyAccess.tsx'
import {
  getAnalyticsDatasetForCompany,
  getEmptyAnalyticsDataset,
  sliceDailyTrend,
} from '../data/analytics.ts'
import { useToast } from '../hooks/useToast.tsx'
import { adPaths } from '../paths.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type {
  AnalyticsCampaignRow,
  AnalyticsDateRange,
  AnalyticsDailyPoint,
  AnalyticsKpis,
} from '../types/analytics.ts'
import type { CampaignType } from '../types/advertisement.ts'
import { clickThroughRate } from '../utils/campaignMetrics.ts'
import {
  campaignTypeLabels,
  formatCurrency,
  formatDate,
  formatNumber,
} from '../utils/formatters.ts'
import { metricTooltips } from '../utils/metricTooltips.ts'

type ChartMetric = 'impressions' | 'clicks' | 'spend'

const dateRangeLabels: Record<AnalyticsDateRange, string> = {
  '7d': 'Son 7 gün',
  '30d': 'Son 30 gün',
  '90d': 'Son 90 gün',
}

function aggregateCampaignKpis(
  rows: AnalyticsCampaignRow[],
  fallbackRoas: number,
): AnalyticsKpis {
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0)
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0)
  const spend = rows.reduce((sum, row) => sum + row.spend, 0)
  const conversions = rows.reduce((sum, row) => sum + row.conversions, 0)
  return {
    impressions,
    clicks,
    ctr: Number(clickThroughRate(impressions, clicks).toFixed(1)),
    spend,
    conversions,
    roas: fallbackRoas,
  }
}

export default function AnalyticsPage() {
  const { selectedCompany, selectedCompanyId, canAccessSelectedCompany } =
    useTenant()
  const { showToast, toastNode } = useToast()

  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('30d')
  const [campaignId, setCampaignId] = useState<string>('all')
  const [productId, setProductId] = useState<string>('all')
  const [campaignType, setCampaignType] = useState<CampaignType | 'all'>('all')
  const [chartMetric, setChartMetric] = useState<ChartMetric>('impressions')
  const [reportOpen, setReportOpen] = useState(false)

  const dataset = useMemo(() => {
    if (!selectedCompanyId || !canAccessSelectedCompany) {
      return getEmptyAnalyticsDataset(selectedCompanyId)
    }
    return (
      getAnalyticsDatasetForCompany(selectedCompanyId) ??
      getEmptyAnalyticsDataset(selectedCompanyId)
    )
  }, [selectedCompanyId, canAccessSelectedCompany])

  const filteredCampaigns = useMemo(() => {
    return dataset.campaigns.filter((row) => {
      const matchesCampaign = campaignId === 'all' || row.campaignId === campaignId
      const matchesProduct = productId === 'all' || row.productId === productId
      const matchesType = campaignType === 'all' || row.type === campaignType
      return matchesCampaign && matchesProduct && matchesType
    })
  }, [dataset.campaigns, campaignId, productId, campaignType])

  const filteredProducts = useMemo(() => {
    const productIds = new Set(filteredCampaigns.map((row) => row.productId))
    if (campaignId === 'all' && productId === 'all' && campaignType === 'all') {
      return dataset.products
    }
    return dataset.products.filter((row) => {
      if (productId !== 'all' && row.productId !== productId) return false
      return productIds.has(row.productId)
    })
  }, [dataset.products, filteredCampaigns, campaignId, productId, campaignType])

  const filteredChannels = useMemo(() => {
    if (campaignType !== 'all') {
      return dataset.channels.filter((row) => row.channel === campaignType)
    }
    if (campaignId === 'all' && productId === 'all') {
      return dataset.channels
    }
    const byType = filteredCampaigns.reduce(
      (acc, row) => {
        const current = acc[row.type] ?? {
          impressions: 0,
          clicks: 0,
          spend: 0,
          conversions: 0,
        }
        current.impressions += row.impressions
        current.clicks += row.clicks
        current.spend += row.spend
        current.conversions += row.conversions
        acc[row.type] = current
        return acc
      },
      {} as Record<
        CampaignType,
        {
          impressions: number
          clicks: number
          spend: number
          conversions: number
        }
      >,
    )
    return (Object.keys(byType) as CampaignType[]).map((channel) => {
      const totals = byType[channel]
      return {
        channel,
        impressions: totals.impressions,
        ctr: Number(
          clickThroughRate(totals.impressions, totals.clicks).toFixed(1),
        ),
        spend: totals.spend,
        conversions: totals.conversions,
      }
    })
  }, [dataset.channels, campaignType, campaignId, productId, filteredCampaigns])

  if (!canAccessSelectedCompany || !selectedCompanyId) {
    return <UnauthorizedCompanyAccess />
  }

  const filtersActive =
    campaignId !== 'all' || productId !== 'all' || campaignType !== 'all'

  const kpis = filtersActive
    ? aggregateCampaignKpis(
        filteredCampaigns,
        dataset.kpisByRange[dateRange].roas,
      )
    : dataset.kpisByRange[dateRange]

  const trendPoints = sliceDailyTrend(dataset.dailyTrend, dateRange)
  const companyName = selectedCompany?.name ?? 'Reklam Hesabı'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        context={`${companyName} Reklam Hesabı`}
        description="Kampanya ve ürün performansınızı tarih aralığı bazında inceleyin."
        actions={
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Rapor Önizleme
          </button>
        }
      />

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Tarih Aralığı">
            <select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as AnalyticsDateRange)
              }
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="7d">Son 7 gün</option>
              <option value="30d">Son 30 gün</option>
              <option value="90d">Son 90 gün</option>
            </select>
          </FilterField>

          <FilterField label="Kampanya">
            <select
              value={campaignId}
              onChange={(event) => setCampaignId(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tüm kampanyalar</option>
              {dataset.campaigns.map((campaign) => (
                <option key={campaign.campaignId} value={campaign.campaignId}>
                  {campaign.campaignName}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Ürün">
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tüm ürünler</option>
              {dataset.products.map((product) => (
                <option key={product.productId} value={product.productId}>
                  {product.productName}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Kampanya Türü">
            <select
              value={campaignType}
              onChange={(event) =>
                setCampaignType(event.target.value as CampaignType | 'all')
              }
              className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700"
            >
              <option value="all">Tüm türler</option>
              <option value="native_recommendation">Doğal AI Önerisi</option>
              <option value="bulk_message">Toplu Mesaj</option>
            </select>
          </FilterField>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Performans KPI</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Toplam Gösterim"
            value={formatNumber(kpis.impressions)}
            hint={dateRangeLabels[dateRange]}
            tooltip={
              <InfoTooltip label="Gösterim" text={metricTooltips.impressions} />
            }
          />
          <MetricCard
            label="Toplam Tıklama"
            value={formatNumber(kpis.clicks)}
            hint={dateRangeLabels[dateRange]}
            tooltip={
              <InfoTooltip label="Tıklama" text={metricTooltips.clicks} />
            }
          />
          <MetricCard
            label="CTR"
            value={`%${kpis.ctr.toFixed(1)}`}
            hint="Tıklama / gösterim"
            tooltip={<InfoTooltip label="CTR" text={metricTooltips.ctr} />}
          />
          <MetricCard
            label="Toplam Harcama"
            value={formatCurrency(kpis.spend)}
            hint={dateRangeLabels[dateRange]}
            tooltip={
              <InfoTooltip
                label="Harcama"
                text={metricTooltips.estimatedAdSpend}
              />
            }
          />
          <MetricCard
            label="Dönüşüm"
            value={formatNumber(kpis.conversions)}
            hint={dateRangeLabels[dateRange]}
            tooltip={
              <InfoTooltip label="Dönüşüm" text={metricTooltips.conversions} />
            }
          />
          <MetricCard
            label="ROAS"
            value={kpis.roas.toFixed(1)}
            hint="Tahmini getiri / harcama"
            accent="emerald"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Performans Grafiği
          </h2>
          <p className="text-xs text-slate-500">{dateRangeLabels[dateRange]}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap gap-1">
            {(
              [
                ['impressions', 'Gösterim'],
                ['clicks', 'Tıklama'],
                ['spend', 'Harcama'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setChartMetric(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                  chartMetric === key
                    ? 'bg-emerald-700 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <AnalyticsLineChart points={trendPoints} metric={chartMetric} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">
          Kampanya Performansı
        </h2>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Kampanya</th>
                  <th className="px-4 py-3 font-medium">Tür</th>
                  <th className="px-4 py-3 font-medium">Gösterim</th>
                  <th className="px-4 py-3 font-medium">Tıklama</th>
                  <th className="px-4 py-3 font-medium">CTR</th>
                  <th className="px-4 py-3 font-medium">Harcama</th>
                  <th className="px-4 py-3 font-medium">Dönüşüm</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Seçili filtrelere uygun kampanya bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((row) => (
                    <tr key={row.campaignId} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <Link
                          to={adPaths.campaign(row.campaignId)}
                          className="font-medium text-slate-800 hover:text-emerald-700"
                        >
                          {row.campaignName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {campaignTypeLabels[row.type]}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatNumber(row.impressions)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatNumber(row.clicks)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        %{row.ctr.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatCurrency(row.spend)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatNumber(row.conversions)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Ürün Performansı
          </h2>
          <p className="text-xs text-slate-500">
            En çok performans gösteren ürünler
          </p>
          <div className="space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                Seçili filtrelere uygun ürün bulunamadı.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <article
                  key={product.productId}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.productName}
                      </p>
                    </div>
                    <Link
                      to={adPaths.product(product.productId)}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Detay
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <MiniStat
                      label="Gösterim"
                      value={formatNumber(product.impressions)}
                    />
                    <MiniStat label="CTR" value={`%${product.ctr.toFixed(1)}`} />
                    <MiniStat
                      label="Dönüşüm"
                      value={formatNumber(product.conversions)}
                    />
                    <MiniStat
                      label="Harcama"
                      value={formatCurrency(product.spend)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Kanal Performansı
          </h2>
          <div className="space-y-3">
            {filteredChannels.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                Seçili filtrelere uygun kanal bulunamadı.
              </div>
            ) : (
              filteredChannels.map((channel) => (
                <article
                  key={channel.channel}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {campaignTypeLabels[channel.channel]}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <MiniStat
                      label="Gösterim"
                      value={formatNumber(channel.impressions)}
                    />
                    <MiniStat label="CTR" value={`%${channel.ctr.toFixed(1)}`} />
                    <MiniStat
                      label="Harcama"
                      value={formatCurrency(channel.spend)}
                    />
                    <MiniStat
                      label="Dönüşüm"
                      value={formatNumber(channel.conversions)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-800">
            AI Performans Özeti
          </h2>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
          {dataset.aiInsights.length === 0 ? (
            <p className="text-sm text-slate-600">
              Bu şirket için henüz AI özeti bulunmuyor.
            </p>
          ) : (
            <ul className="space-y-2">
              {dataset.aiInsights.map((insight) => (
                <li
                  key={insight}
                  className="flex gap-2 text-sm leading-relaxed text-slate-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {reportOpen ? (
        <ReportPreviewModal
          companyName={companyName}
          dateRange={dateRange}
          kpis={kpis}
          campaignCount={filteredCampaigns.length}
          productCount={filteredProducts.length}
          insights={dataset.aiInsights}
          onClose={() => setReportOpen(false)}
          onExport={() => {
            showToast('PDF raporu hazırlandı (mock).')
            setReportOpen(false)
          }}
        />
      ) : null}

      {toastNode}
    </div>
  )
}

function FilterField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/80 px-2.5 py-2">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function AnalyticsLineChart({
  points,
  metric,
}: {
  points: AnalyticsDailyPoint[]
  metric: ChartMetric
}) {
  const width = 720
  const height = 200
  const padding = 28
  const values = points.map((point) => point[metric])
  const max = Math.max(...values, 1)

  if (points.length === 0) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-slate-500">
        Grafik verisi bulunamadı.
      </div>
    )
  }

  const coords = values.map((value, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(values.length - 1, 1)
    const y = height - padding - (value / max) * (height - padding * 2)
    return { x, y, value, label: points[index]?.date ?? '' }
  })

  const polyline = coords.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPath = [
    `M ${coords[0].x} ${height - padding}`,
    ...coords.map((point) => `L ${point.x} ${point.y}`),
    `L ${coords[coords.length - 1].x} ${height - padding}`,
    'Z',
  ].join(' ')

  const metricLabel =
    metric === 'impressions'
      ? 'Gösterim'
      : metric === 'clicks'
        ? 'Tıklama'
        : 'Harcama'

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full"
        role="img"
        aria-label={`${metricLabel} trend grafiği`}
      >
        <path d={areaPath} fill="#059669" opacity="0.08" />
        <polyline
          fill="none"
          stroke="#059669"
          strokeWidth="2.5"
          points={polyline}
        />
        {coords.map((point) => (
          <circle key={point.label} cx={point.x} cy={point.y} r="2.5" fill="#059669">
            <title>
              {formatDate(point.label)}:{' '}
              {metric === 'spend'
                ? formatCurrency(point.value)
                : formatNumber(point.value)}
            </title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>{formatDate(points[0]?.date ?? null)}</span>
        <span>{formatDate(points[points.length - 1]?.date ?? null)}</span>
      </div>
    </div>
  )
}

function ReportPreviewModal({
  companyName,
  dateRange,
  kpis,
  campaignCount,
  productCount,
  insights,
  onClose,
  onExport,
}: {
  companyName: string
  dateRange: AnalyticsDateRange
  kpis: AnalyticsKpis
  campaignCount: number
  productCount: number
  insights: string[]
  onClose: () => void
  onExport: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="analytics-report-title"
        className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-emerald-700">Rapor Önizleme</p>
            <h3
              id="analytics-report-title"
              className="mt-1 text-sm font-semibold text-slate-900"
            >
              {companyName} — Analytics Özeti
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {dateRangeLabels[dateRange]} · {campaignCount} kampanya ·{' '}
              {productCount} ürün
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <ReportStat label="Gösterim" value={formatNumber(kpis.impressions)} />
          <ReportStat label="Tıklama" value={formatNumber(kpis.clicks)} />
          <ReportStat label="CTR" value={`%${kpis.ctr.toFixed(1)}`} />
          <ReportStat label="Harcama" value={formatCurrency(kpis.spend)} />
          <ReportStat label="Dönüşüm" value={formatNumber(kpis.conversions)} />
          <ReportStat label="ROAS" value={kpis.roas.toFixed(1)} />
        </div>

        {insights.length > 0 ? (
          <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/80 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <FileText className="h-3.5 w-3.5" />
              AI özeti
            </div>
            <ul className="space-y-1.5">
              {insights.slice(0, 3).map((insight) => (
                <li key={insight} className="text-xs leading-relaxed text-slate-600">
                  • {insight}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Download className="h-3.5 w-3.5" />
            PDF Olarak İndir
          </button>
        </div>
      </div>
    </div>
  )
}

function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-2">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
