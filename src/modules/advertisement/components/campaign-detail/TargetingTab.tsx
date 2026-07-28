import { Link } from 'react-router-dom'
import { adPaths } from '../../paths.ts'
import type { Campaign } from '../../types/advertisement.ts'
import { formatNumber } from '../../utils/formatters.ts'

type TargetingTabProps = {
  campaign: Campaign
}

const ownerLabels = {
  brand: 'Marka',
  agrigo: 'AgriGO',
} as const

export default function TargetingTab({ campaign }: TargetingTabProps) {
  const isDraft = campaign.status === 'draft'
  const multiSegment = campaign.segments.length > 1

  return (
    <div className="space-y-4">
      {isDraft ? (
        <div className="flex justify-end">
          <Link
            to={`${adPaths.campaignEdit(campaign.id)}?step=audience`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Hedeflemeyi Düzenle
          </Link>
        </div>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Seçilen Saved Segment{campaign.segments.length > 1 ? 'ler' : ''}
        </h3>
        <div className="mt-3 space-y-3">
          {campaign.segments.map((segment) => (
            <div
              key={segment.id}
              className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {segment.name}
                </p>
                <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {ownerLabels[segment.owner]}
                </span>
              </div>
              <ul className="mt-2 list-inside list-disc text-xs text-slate-600">
                {segment.criteriaSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Ek Campaign Target Rules
        </h3>
        <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
          {campaign.targetRules.extraRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Doğal dil hedef kitle özeti
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {campaign.targetRules.naturalLanguageSummary}
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Tahmini segment büyüklüğü</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatNumber(campaign.estimatedSegmentSize)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Consent sonrası uygun kitle</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatNumber(campaign.consentEligibleAudience)}
          </p>
        </div>
      </section>

      {multiSegment ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Hedefleme mantığı
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {campaign.segments.map((s) => s.name).join(' OR ')}
            {' AND '}
            Target Rules
            {' AND '}
            Consent
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Çiftçi, seçilen segmentlerden en az birine uyuyorsa; ardından ek hedef
            kuralları ve consent şartları birlikte uygulanır.
          </p>
        </section>
      ) : null}
    </div>
  )
}
