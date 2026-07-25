import type { LucideIcon } from 'lucide-react'
import {
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  FileWarning,
  Info,
  ShieldAlert,
  Sprout,
  TriangleAlert,
} from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'
import {
  getActiveRisks,
  RISK_LEVEL_LABELS,
  type FarmerRisk,
  type RiskCategory,
  type RiskLevel,
} from '../../utils/getActiveRisks.ts'

type ActiveRiskCardProps = {
  farmer: Farmer
}

const levelStyles: Record<
  RiskLevel,
  { badge: string; icon: LucideIcon; iconClass: string }
> = {
  high: {
    badge: 'border-red-200 bg-red-50 text-red-700',
    icon: TriangleAlert,
    iconClass: 'text-red-600',
  },
  medium: {
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    icon: AlertCircle,
    iconClass: 'text-amber-600',
  },
  low: {
    badge: 'border-blue-200 bg-blue-50 text-blue-700',
    icon: Info,
    iconClass: 'text-blue-600',
  },
}

const categoryIcons: Record<RiskCategory, LucideIcon> = {
  production: Sprout,
  finance: CircleDollarSign,
  insurance: ShieldAlert,
  data_quality: FileWarning,
}

const categoryLabels: Record<RiskCategory, string> = {
  production: 'Üretim',
  finance: 'Finans',
  insurance: 'Sigorta',
  data_quality: 'Veri Kalitesi',
}

function RiskContent({ risk }: { risk: FarmerRisk }) {
  const levelStyle = levelStyles[risk.level]
  const LevelIcon = levelStyle.icon
  const CategoryIcon = categoryIcons[risk.category]

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none ${levelStyle.badge}`}
        >
          <LevelIcon className="h-3 w-3" aria-hidden="true" />
          {RISK_LEVEL_LABELS[risk.level]}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium leading-none text-gray-600">
          <CategoryIcon className="h-3 w-3" aria-hidden="true" />
          {categoryLabels[risk.category]}
        </span>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <LevelIcon
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${levelStyle.iconClass}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="break-words text-[13px] font-medium leading-snug text-gray-900">
            {risk.title}
          </p>
          <p className="mt-1 break-words text-xs leading-relaxed text-gray-600">
            {risk.description}
          </p>
          <span
            className="group relative mt-1.5 inline-flex items-center gap-1 rounded-md text-[11px] text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            tabIndex={0}
            aria-label="Aktif riskler, çiftçinin mevcut üretim, finans, sigorta ve veri kalitesi bilgilerine göre oluşturulur."
          >
            <Info className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
            <span>En yüksek öncelikli aktif sinyal</span>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-56 rounded-md border border-gray-200 bg-white p-3 text-left shadow-md group-hover:block group-focus-within:block"
            >
              <span className="block text-xs font-semibold text-gray-900">
                Aktif Risk Sinyali
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-gray-600">
                Aktif riskler, çiftçinin mevcut üretim, finans, sigorta ve veri
                kalitesi bilgilerine göre oluşturulur.
              </span>
            </span>
          </span>
        </div>
      </div>
    </>
  )
}

export default function ActiveRiskCard({ farmer }: ActiveRiskCardProps) {
  const risks = getActiveRisks(farmer)
  const primaryRisk = risks[0]

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-[11px] font-semibold tracking-wide text-gray-500">
        AKTİF RİSK DURUMU
      </h3>

      <div className="mt-3 flex flex-1 flex-col">
        {primaryRisk ? (
          <>
            <RiskContent risk={primaryRisk} />
            <p className="mt-auto pt-3 text-[11px] text-gray-500">
              Toplam {risks.length} aktif risk
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium leading-none text-emerald-700">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Risk Yok
              </span>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="break-words text-[13px] font-medium leading-snug text-gray-900">
                  Aktif risk bulunmuyor
                </p>
                <p className="mt-1 break-words text-xs leading-relaxed text-gray-600">
                  Mevcut çiftçi verilerinde öncelikli bir risk sinyali tespit
                  edilmedi.
                </p>
                <span
                  className="group relative mt-1.5 inline-flex items-center gap-1 rounded-md text-[11px] text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  tabIndex={0}
                  aria-label="Aktif riskler, çiftçinin mevcut üretim, finans, sigorta ve veri kalitesi bilgilerine göre oluşturulur."
                >
                  <Info className="h-3 w-3 shrink-0 text-gray-400" aria-hidden="true" />
                  <span>0 aktif risk</span>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-56 rounded-md border border-gray-200 bg-white p-3 text-left shadow-md group-hover:block group-focus-within:block"
                  >
                    <span className="block text-xs font-semibold text-gray-900">
                      Aktif Risk Sinyali
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-gray-600">
                      Aktif riskler, çiftçinin mevcut üretim, finans, sigorta ve
                      veri kalitesi bilgilerine göre oluşturulur.
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  )
}
