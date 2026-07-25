import type { ConsentValue, Farmer } from '../../../types/farmer.ts'

type ConsentTabProps = {
  farmer: Farmer
}

type ConsentItem = {
  label: string
  value: ConsentValue
}

function getConsentBadge(value: ConsentValue) {
  if (value === true) {
    return {
      label: 'Onaylandı',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    }
  }

  if (value === false) {
    return {
      label: 'Reddedildi',
      className: 'border-red-200 bg-red-50 text-red-700',
    }
  }

  return {
    label: 'Belirtilmedi',
    className: 'border-gray-200 bg-gray-50 text-gray-600',
  }
}

function ConsentToggle({ value }: { value: ConsentValue }) {
  const isOn = value === true

  return (
    <span
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${
        isOn
          ? 'border-emerald-300 bg-emerald-500'
          : 'border-gray-200 bg-gray-200'
      }`}
      aria-hidden="true"
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          isOn ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </span>
  )
}

const consentDateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatConsentDetail(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === '') {
    return '—'
  }

  return value
}

function formatConsentTime(iso: string | null | undefined): string {
  if (iso === null || iso === undefined || iso.trim() === '') {
    return '—'
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return consentDateFormatter.format(date)
}

export default function ConsentTab({ farmer }: ConsentTabProps) {
  const items: ConsentItem[] = [
    { label: 'Pazarlama / Sponsorlu içerik', value: farmer.consent.marketing },
    { label: 'Hizmet için veri işleme', value: farmer.consent.dataProcessing },
    {
      label: 'Üçüncü taraf ürün/hizmet önerisi',
      value: farmer.consent.thirdPartyOffer,
    },
    { label: 'Analitik / raporlama kullanımı', value: farmer.consent.analytics },
  ]

  const details = farmer.consentDetails
  const detailRows = [
    { label: 'Versiyon', value: formatConsentDetail(details?.version) },
    { label: 'Kanal', value: formatConsentDetail(details?.channel) },
    { label: 'Zaman', value: formatConsentTime(details?.consentedAt) },
    { label: 'Geri Çekilme', value: formatConsentDetail(details?.withdrawal) },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item) => {
          const badge = getConsentBadge(item.value)

          return (
            <div
              key={item.label}
              className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium leading-none ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <ConsentToggle value={item.value} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <article className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">Rıza Detayları</h3>
        <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {detailRows.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-[11px] font-medium text-gray-500">{row.label}</dt>
              <dd className="mt-0.5 break-words text-sm font-semibold text-gray-900">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  )
}
