import {
  advertiserBillingStatusLabels,
  advertiserBillingStatusStyles,
  advertiserPaymentMethodLabels,
} from '../../data/advertiserProfile.ts'
import type { AdvertiserBilling } from '../../types/advertiserProfile.ts'
import { formatDate } from '../../utils/formatters.ts'
import ProfileInfoRow from './ProfileInfoRow.tsx'
import ProfileSectionCard from './ProfileSectionCard.tsx'

type BillingCardProps = {
  billing: AdvertiserBilling
}

export default function BillingCard({ billing }: BillingCardProps) {
  return (
    <ProfileSectionCard
      title="Faturalama"
      description="Fatura ve ödeme bilgilerinizin özeti."
      footnote="Faturalama bilgileri şimdilik mock olarak gösterilmektedir."
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <BillingTile label="Fatura Ünvanı" value={billing.invoiceTitle} />
        <BillingTile label="Vergi Dairesi" value={billing.taxOffice} />
        <BillingTile
          label="Vergi Numarası"
          value={
            <span className="font-mono text-xs tracking-wide">
              {billing.taxNumber}
            </span>
          }
        />
        <BillingTile
          label="Ödeme Yöntemi"
          value={advertiserPaymentMethodLabels[billing.paymentMethod]}
        />
        <BillingTile
          label="Son Fatura Tarihi"
          value={formatDate(billing.lastInvoiceDate)}
        />
        <BillingTile
          label="Faturalama Durumu"
          value={
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${advertiserBillingStatusStyles[billing.billingStatus]}`}
            >
              {advertiserBillingStatusLabels[billing.billingStatus]}
            </span>
          }
        />
      </dl>
    </ProfileSectionCard>
  )
}

function BillingTile({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
      <ProfileInfoRow label={label} value={value} />
    </div>
  )
}
