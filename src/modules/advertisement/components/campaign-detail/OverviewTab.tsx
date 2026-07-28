import { Link } from 'react-router-dom'
import { adPaths } from '../../paths.ts'
import StatusBadge from '../StatusBadge.tsx'
import type { Campaign } from '../../types/advertisement.ts'
import type { Product } from '../../types/advertisement.ts'
import {
  campaignStatusLabels,
  campaignTypeLabels,
  formatCurrency,
  formatDate,
} from '../../utils/formatters.ts'
import {
  remainingBudget,
  scheduleDurationLabel,
} from '../../utils/campaignMetrics.ts'

type OverviewTabProps = {
  campaign: Campaign
  product: Product
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-800 sm:text-right">{value}</dd>
    </div>
  )
}

export default function OverviewTab({ campaign, product }: OverviewTabProps) {
  const remaining = remainingBudget(campaign.budget, campaign.estimatedSpend)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Kampanya Bilgileri</h3>
        <dl className="mt-2">
          <InfoRow label="Kampanya adı" value={campaign.name} />
          <InfoRow
            label="Kampanya tipi"
            value={campaignTypeLabels[campaign.type]}
          />
          <InfoRow
            label="Durum"
            value={<StatusBadge status={campaign.status} />}
          />
          <InfoRow label="Açıklama" value={campaign.description} />
          <InfoRow
            label="Oluşturulma tarihi"
            value={formatDate(campaign.createdAt)}
          />
          <InfoRow
            label="Son güncelleme"
            value={formatDate(campaign.updatedAt)}
          />
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Bağlı Ürün</h3>
        <dl className="mt-2">
          <InfoRow label="Ürün adı" value={product.name} />
          <InfoRow label="Kategori" value={product.category} />
          <InfoRow
            label="Kısa açıklama"
            value={product.shortDescription || product.description || '—'}
          />
          <InfoRow label="Marka" value={product.brand || '—'} />
          {product.listPrice != null ? (
            <InfoRow
              label="Normal satış fiyatı"
              value={formatCurrency(product.listPrice)}
            />
          ) : null}
        </dl>
        <Link
          to={adPaths.product(product.id)}
          className="mt-3 inline-flex text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          Ürün detayına git
        </Link>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Hedefleme Özeti</h3>
        <dl className="mt-2">
          <InfoRow
            label="Seçilen hedef kitle"
            value={
              campaign.segments.length === 0
                ? '—'
                : campaign.segments.map((s) => s.name).join(' · ')
            }
          />
          <InfoRow
            label="Ek hedef kuralları"
            value={campaign.targetRules.extraRules.join(' · ')}
          />
          <InfoRow
            label="Tahmini segment büyüklüğü"
            value={campaign.estimatedSegmentSize.toLocaleString('tr-TR')}
          />
          <InfoRow
            label="Consent sonrası uygun kitle"
            value={campaign.consentEligibleAudience.toLocaleString('tr-TR')}
          />
        </dl>
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Zamanlama</h3>
          <dl className="mt-2">
            <InfoRow
              label="Başlangıç tarihi"
              value={formatDate(campaign.schedule.startDate)}
            />
            <InfoRow
              label="Bitiş tarihi"
              value={formatDate(campaign.schedule.endDate)}
            />
            <InfoRow
              label="Süre"
              value={scheduleDurationLabel(
                campaign.schedule.startDate,
                campaign.schedule.endDate,
              )}
            />
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Bütçe</h3>
          <dl className="mt-2">
            <InfoRow
              label="Toplam bütçe"
              value={formatCurrency(campaign.budget)}
            />
            <InfoRow
              label="Tahmini harcama"
              value={formatCurrency(campaign.estimatedSpend)}
            />
            <InfoRow label="Kalan bütçe" value={formatCurrency(remaining)} />
          </dl>
          <p className="mt-2 text-[11px] text-slate-400">
            Durum: {campaignStatusLabels[campaign.status]}
          </p>
        </div>
      </section>
    </div>
  )
}
