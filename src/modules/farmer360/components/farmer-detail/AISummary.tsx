import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileWarning,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Sprout,
  TriangleAlert,
  UserRound,
} from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'
import type {
  FarmerSummaryInterpretation,
  FarmerSummaryObservation,
} from '../../utils/generateFarmerSummary.ts'
import { generateFarmerSummary } from '../../utils/generateFarmerSummary.ts'
import InfoTooltip from '../shared/InfoTooltip.tsx'

type AISummaryProps = {
  farmer: Farmer
}

const INITIAL_OBSERVATION_COUNT = 2
const INITIAL_INTERPRETATION_COUNT = 2

const observationIcons: Record<FarmerSummaryObservation['category'], LucideIcon> = {
  profile: UserRound,
  production: Sprout,
  finance: CircleDollarSign,
  insurance: ShieldCheck,
  data_quality: FileWarning,
}

const interpretationIcons: Record<FarmerSummaryInterpretation['tone'], LucideIcon> = {
  positive: CheckCircle2,
  warning: TriangleAlert,
  neutral: Lightbulb,
}

function ObservationItem({
  text,
  icon: Icon,
}: {
  text: string
  icon: LucideIcon
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-50">
        <Icon className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 break-words text-sm leading-relaxed text-gray-700">
        {text}
      </span>
    </li>
  )
}

function InterpretationItem({
  text,
  icon: Icon,
}: {
  text: string
  icon: LucideIcon
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/80">
        <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 break-words text-sm leading-relaxed text-gray-700">
        {text}
      </span>
    </li>
  )
}

export default function AISummary({ farmer }: AISummaryProps) {
  const summary = useMemo(() => generateFarmerSummary(farmer), [farmer])
  const [observationsExpanded, setObservationsExpanded] = useState(false)
  const [interpretationsExpanded, setInterpretationsExpanded] = useState(false)

  const hiddenObservationCount = Math.max(
    0,
    summary.observations.length - INITIAL_OBSERVATION_COUNT,
  )
  const hiddenInterpretationCount = Math.max(
    0,
    summary.interpretations.length - INITIAL_INTERPRETATION_COUNT,
  )

  const visibleObservations = observationsExpanded
    ? summary.observations
    : summary.observations.slice(0, INITIAL_OBSERVATION_COUNT)

  const visibleInterpretations = interpretationsExpanded
    ? summary.interpretations
    : summary.interpretations.slice(0, INITIAL_INTERPRETATION_COUNT)

  return (
    <section className="mt-4 min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-gray-900">AI Özet</h3>
                <InfoTooltip
                  label="AI Özet hakkında bilgi"
                  text="AI Özet, profil ve etkileşim verilerinden üretilen kısa bir durum okumasıdır. Karar desteği sağlar; tek başına kesin sonuç değildir."
                />
              </div>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                {summary.headline}
              </p>
            </div>
          </div>
          <p className="mt-3 break-words text-sm leading-relaxed text-gray-600">
            {summary.description}
          </p>
        </div>
        <span className="shrink-0 text-xs text-gray-400">12 dk önce</span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-stone-50/50 p-4">
          <h4 className="text-xs font-medium text-gray-500">Öne çıkanlar</h4>
          <ul className="mt-3 space-y-3">
            {visibleObservations.map((observation) => (
              <ObservationItem
                key={observation.id}
                text={observation.text}
                icon={observationIcons[observation.category]}
              />
            ))}
          </ul>
          {hiddenObservationCount > 0 && (
            <button
              type="button"
              aria-expanded={observationsExpanded}
              aria-label={
                observationsExpanded
                  ? 'Gözlemleri daralt'
                  : `${hiddenObservationCount} gözlem daha göster`
              }
              onClick={() => setObservationsExpanded((expanded) => !expanded)}
              className="mt-3 inline-flex items-center gap-1 rounded-md text-xs font-medium text-emerald-700 transition-colors hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {observationsExpanded ? (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Daha az göster
                </>
              ) : (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  {hiddenObservationCount} tane daha
                </>
              )}
            </button>
          )}
        </div>

        <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-4">
          <h4 className="text-xs font-medium text-gray-500">AI değerlendirmesi</h4>
          <ul className="mt-3 space-y-3">
            {visibleInterpretations.map((interpretation) => (
              <InterpretationItem
                key={interpretation.id}
                text={interpretation.text}
                icon={interpretationIcons[interpretation.tone]}
              />
            ))}
          </ul>
          {hiddenInterpretationCount > 0 && (
            <button
              type="button"
              aria-expanded={interpretationsExpanded}
              aria-label={
                interpretationsExpanded
                  ? 'AI yorumlarını daralt'
                  : `${hiddenInterpretationCount} AI yorumu daha göster`
              }
              onClick={() => setInterpretationsExpanded((expanded) => !expanded)}
              className="mt-3 inline-flex items-center gap-1 rounded-md text-xs font-medium text-emerald-700 transition-colors hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {interpretationsExpanded ? (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Daha az göster
                </>
              ) : (
                <>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  {hiddenInterpretationCount} tane daha
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-200 pt-4">
        <p className="text-[11px] leading-relaxed text-gray-400">
          AI tarafından konuşma, belge ve profil kayıtlarından derlenmiştir —
          ham veri değildir.
        </p>
      </div>
    </section>
  )
}
