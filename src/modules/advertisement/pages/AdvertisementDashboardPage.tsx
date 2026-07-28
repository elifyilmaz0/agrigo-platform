import { Link, useNavigate } from 'react-router-dom'
import { adPaths } from '../paths.ts'
import {
  AlertTriangle,
  Info,
  Megaphone,
  Package,
  Sparkles,
  Target,
} from 'lucide-react'
import InfoTooltip from '../components/InfoTooltip.tsx'
import MetricCard from '../components/MetricCard.tsx'
import PageHeader from '../components/PageHeader.tsx'
import QuickActionCard from '../components/QuickActionCard.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import {
  getDashboardAlertsForCompany,
  getPerformanceSummaryForCompany,
  getRecentCampaignIdsForCompany,
  productPerformanceRows,
} from '../data/dashboard.ts'
import { getProductById, getProductName } from '../data/products.ts'
import { useCampaignStore } from '../state/CampaignStore.tsx'
import { useTenant } from '../tenant/TenantProvider.tsx'
import { clickThroughRate } from '../utils/campaignMetrics.ts'
import { metricTooltips } from '../utils/metricTooltips.ts'
import {
  campaignTypeLabels,
  formatCurrency,
  formatDate,
  formatNumber,
} from '../utils/formatters.ts'
import type { CampaignStatus } from '../types/advertisement.ts'

const alertIcons = {
  warning: AlertTriangle,
  critical: AlertTriangle,
  info: Info,
}

const alertStyles = {
  warning: 'border-amber-200 bg-amber-50/50',
  critical: 'border-orange-200 bg-orange-50/50',
  info: 'border-sky-200 bg-sky-50/40',
}

const alertIconStyles = {
  warning: 'text-amber-600',
  critical: 'text-orange-600',
  info: 'text-sky-600',
}

export default function AdvertisementDashboardPage() {
  const navigate = useNavigate()
  const { campaigns, statusSummary, getCampaign } = useCampaignStore()
  const { selectedCompany, selectedCompanyId } = useTenant()
  const companyName = selectedCompany?.name ?? 'Reklam Hesabı'

  const statusCards: Array<{
    label: string
    value: number
    status: CampaignStatus | 'all'
    accent: 'default' | 'emerald' | 'amber' | 'sky' | 'orange' | 'slate'
    hint: string
  }> = [
    {
      label: 'Toplam Kampanya',
      value: statusSummary.total,
      status: 'all',
      accent: 'default',
      hint: 'Hesabınızdaki tüm kampanyalar',
    },
    {
      label: 'Aktif Kampanya',
      value: statusSummary.active,
      status: 'active',
      accent: 'emerald',
      hint: 'Son 30 günde +2 kampanya arttı.',
    },
    {
      label: 'Taslak',
      value: statusSummary.draft,
      status: 'draft',
      accent: 'slate',
      hint: 'Tamamlanmayı bekleyen kurulumlar',
    },
    {
      label: 'İnceleme Bekliyor',
      value: statusSummary.pendingReview,
      status: 'pending_review',
      accent: 'amber',
      hint: 'Yayın öncesi AgriGO kontrolünde.',
    },
    {
      label: 'Planlandı',
      value: statusSummary.scheduled,
      status: 'scheduled',
      accent: 'sky',
      hint: 'Başlangıç tarihi yaklaşan kampanyalar',
    },
    {
      label: 'Duraklatıldı',
      value: statusSummary.paused,
      status: 'paused',
      accent: 'orange',
      hint: 'Bütçe limiti nedeniyle durduruldu.',
    },
  ]

  function goToCampaigns(status: CampaignStatus | 'all') {
    if (status === 'all') {
      navigate(adPaths.campaigns)
      return
    }
    navigate(`${adPaths.campaigns}?status=${status}`)
  }

  const performanceSummary = getPerformanceSummaryForCompany(selectedCompanyId)
  const dashboardAlerts = getDashboardAlertsForCompany(selectedCompanyId)
  const recentCampaigns = getRecentCampaignIdsForCompany(selectedCompanyId)
    .map((id) => getCampaign(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const performanceRows = productPerformanceRows
    .filter((row) => row.companyId === selectedCompanyId)
    .map((row) => {
      const product = getProductById(row.productId)
      if (!product || product.companyId !== selectedCompanyId) return null
      return { ...row, product }
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        context={`${companyName} Reklam Hesabı`}
        description={`${companyName} kampanyalarının, ürünlerinin ve hedef kitlelerinin güncel durumu.`}
        actions={
          <Link
            to={adPaths.campaignNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Megaphone className="h-3.5 w-3.5" />
            Yeni Kampanya
          </Link>
        }
      />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Hızlı İşlemler</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Yeni Kampanya Oluştur"
            description="Doğal AI önerisi veya toplu mesaj kampanyası başlatın."
            to={adPaths.campaignNew}
            icon={Megaphone}
          />
          <QuickActionCard
            title="Yeni Hedef Kitle Oluştur"
            description="Kampanyalarınız için hedef kitle tanımlayın."
            to={adPaths.audience}
            icon={Target}
          />
          <QuickActionCard
            title="Yeni Ürün Ekle"
            description="Kampanyalarda kullanmak üzere yeni ürün ekleyin."
            to={adPaths.productNew}
            icon={Package}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Kampanya Durumu Özeti</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {statusCards.map((card) => (
            <MetricCard
              key={card.label}
              label={card.label}
              value={card.value}
              hint={card.hint}
              accent={card.accent}
              onClick={() => goToCampaigns(card.status)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Performans Özeti</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Doğal AI Önerisi
            </p>
            <dl className="mt-3 space-y-2.5">
              <MetricRow
                label="Gösterim"
                value={formatNumber(performanceSummary.nativeRecommendation.impressions)}
                tooltip={metricTooltips.impressions}
              />
              <MetricRow
                label="Tıklama"
                value={formatNumber(performanceSummary.nativeRecommendation.clicks)}
                tooltip={metricTooltips.clicks}
              />
              <MetricRow
                label="Dönüşüm"
                value={formatNumber(performanceSummary.nativeRecommendation.conversions)}
                tooltip={metricTooltips.conversions}
              />
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Toplu Mesaj
            </p>
            <dl className="mt-3 space-y-2.5">
              <MetricRow
                label="Hedeflenen Uygun Kitle"
                value={formatNumber(performanceSummary.bulkMessage.targetedAudience)}
                tooltip={metricTooltips.targeted}
              />
              <MetricRow
                label="Teslim Edildi"
                value={formatNumber(performanceSummary.bulkMessage.delivered)}
                tooltip={metricTooltips.delivered}
              />
              <MetricRow
                label="Okundu"
                value={formatNumber(performanceSummary.bulkMessage.read)}
                tooltip={metricTooltips.read}
              />
              <MetricRow
                label="Tıklandı"
                value={formatNumber(performanceSummary.bulkMessage.clicked)}
                tooltip={metricTooltips.clickedBulk}
              />
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Genel Reklam Özeti
            </p>
            <dl className="mt-3 space-y-2.5">
              <MetricRow
                label="Tahmini Reklam Harcaması"
                value={formatCurrency(performanceSummary.estimatedSpend)}
                tooltip={metricTooltips.estimatedAdSpend}
                strong
              />
              <div className="flex justify-between text-sm">
                <dt className="text-slate-500">Toplam Kampanya</dt>
                <dd className="font-medium text-slate-900">{campaigns.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Ürün Bazlı Performans</h2>
            <Link to={adPaths.products} className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
              Tümünü gör
            </Link>
          </div>
          <div className="space-y-3">
            {performanceRows.map((row) => {
              const isNative = row.campaignType === 'native_recommendation'
              const ctr =
                row.nativeMetrics
                  ? clickThroughRate(
                      row.nativeMetrics.impressions,
                      row.nativeMetrics.clicks,
                    )
                  : 0

              return (
                <article
                  key={row.productId}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/40"
                  onClick={() => navigate(adPaths.product(row.productId))}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.product.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {campaignTypeLabels[row.campaignType]} · {row.product.category}
                      </p>
                    </div>
                    <Link
                      to={adPaths.product(row.productId)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Detay
                    </Link>
                  </div>

                  {isNative && row.nativeMetrics ? (
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <MiniStat
                        label="Gösterim"
                        value={formatNumber(row.nativeMetrics.impressions)}
                        tooltip={metricTooltips.impressions}
                      />
                      <MiniStat
                        label="Tıklama"
                        value={formatNumber(row.nativeMetrics.clicks)}
                        tooltip={metricTooltips.clicks}
                      />
                      <MiniStat
                        label="Dönüşüm"
                        value={formatNumber(row.nativeMetrics.conversions)}
                        tooltip={metricTooltips.conversions}
                      />
                      <MiniStat
                        label="CTR"
                        value={`%${ctr.toFixed(1)}`}
                        tooltip={metricTooltips.ctr}
                      />
                      <MiniStat
                        label="Toplam Harcama"
                        value={formatCurrency(row.estimatedAdSpend)}
                        tooltip={metricTooltips.estimatedAdSpend}
                      />
                    </div>
                  ) : null}

                  {!isNative && row.bulkMetrics ? (
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <MiniStat
                        label="Hedeflenen"
                        value={formatNumber(row.bulkMetrics.targeted)}
                        tooltip={metricTooltips.targeted}
                      />
                      <MiniStat
                        label="Teslim"
                        value={formatNumber(row.bulkMetrics.delivered)}
                        tooltip={metricTooltips.delivered}
                      />
                      <MiniStat
                        label="Okundu"
                        value={formatNumber(row.bulkMetrics.read)}
                        tooltip={metricTooltips.read}
                      />
                      <MiniStat
                        label="Tıklandı"
                        value={formatNumber(row.bulkMetrics.clicked)}
                        tooltip={metricTooltips.clickedBulk}
                      />
                      <MiniStat
                        label="Toplam Harcama"
                        value={formatCurrency(row.estimatedAdSpend)}
                        tooltip={metricTooltips.estimatedAdSpend}
                      />
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Son Kampanyalar</h2>
            <Link to={adPaths.campaigns} className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
              Tümünü gör
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {recentCampaigns.map((campaign) => (
                <li key={campaign.id}>
                  <Link
                    to={adPaths.campaign(campaign.id)}
                    className="block px-4 py-3 transition-colors hover:bg-slate-50/70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {campaign.name}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          {getProductName(campaign.productId)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {campaignTypeLabels[campaign.type]} ·{' '}
                          {formatDate(campaign.createdAt)} ·{' '}
                          {formatCurrency(campaign.budget)}
                        </p>
                      </div>
                      <StatusBadge status={campaign.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <h2 className="text-sm font-semibold text-slate-800">Dikkat Gerektirenler</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardAlerts.map((alert) => {
            const Icon = alertIcons[alert.severity]
            return (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 transition-colors hover:shadow-sm ${alertStyles[alert.severity]}`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${alertIconStyles[alert.severity]}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function MetricRow({
  label,
  value,
  tooltip,
  strong = false,
}: {
  label: string
  value: string
  tooltip: string
  strong?: boolean
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="flex items-center gap-1.5 text-slate-500">
        {label}
        <InfoTooltip label={`${label} hakkında bilgi`} text={tooltip} />
      </dt>
      <dd className={strong ? 'font-semibold text-slate-900' : 'font-medium text-slate-900'}>
        {value}
      </dd>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tooltip,
}: {
  label: string
  value: string
  tooltip: string
}) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/80 px-2.5 py-2">
      <p className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
        {label}
        <InfoTooltip label={`${label} hakkında bilgi`} text={tooltip} side="right" />
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-800">{value}</p>
    </div>
  )
}
