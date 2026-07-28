import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {
  ADVERTISEMENT_BASE,
  FARMER360_BASE,
} from '../modules/advertisement/paths.ts'

const farmerFeatures = [
  'Çiftçi Profilleri',
  'AI Insights',
  'Timeline',
  'AI Memory',
  'Finans',
  'Üretim',
  'Sigorta',
]

const advertisementFeatures = [
  'Dashboard',
  'Ürün Yönetimi',
  'Kampanyalar',
  'Hedef Kitle',
  'Analytics',
  'Şirket Profili',
]

export default function PlatformLandingPage() {
  return (
    <div className="platform-landing h-full overflow-y-auto">
      <div className="relative mx-auto flex min-h-full max-w-5xl flex-col px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
        <header className="platform-landing-hero text-center">
          <p className="platform-landing-eyebrow mb-3 text-xs font-semibold tracking-[0.2em] text-emerald-800 uppercase">
            AgriGO
          </p>
          <h1 className="platform-landing-title text-4xl leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
            AgriGO Platform
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
            AI destekli tarım teknolojileri platformu.
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-stone-500 sm:text-base">
            Farmer360 ve Advertisement Platform modüllerine buradan
            erişebilirsiniz.
          </p>
        </header>

        <section
          aria-label="Platform modülleri"
          className="mt-10 grid flex-1 gap-5 sm:mt-12 sm:gap-6 lg:mt-14 lg:grid-cols-2"
        >
          <ModuleCard
            emoji="🌾"
            title="Farmer360"
            description="AI destekli Çiftçi CRM ve Çiftçi Kartı Yönetimi"
            features={farmerFeatures}
            to={FARMER360_BASE}
            cta="Farmer360'a Git"
            accent="forest"
          />
          <ModuleCard
            emoji="📢"
            title="Advertisement Platform"
            description="Reklamveren kampanya ve hedef kitle yönetimi"
            features={advertisementFeatures}
            to={ADVERTISEMENT_BASE}
            cta="Reklam Platformuna Git"
            accent="field"
          />
        </section>

        <aside className="platform-landing-status mt-10 rounded-xl border border-stone-200/80 bg-white/70 px-4 py-4 backdrop-blur-sm sm:mt-12 sm:px-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">
            Current Platform Modules
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <StatusRow name="Farmer360" status="MVP" />
            <StatusRow name="Advertisement Platform" status="In Development" />
          </div>
        </aside>
      </div>
    </div>
  )
}

function ModuleCard({
  emoji,
  title,
  description,
  features,
  to,
  cta,
  accent,
}: {
  emoji: string
  title: string
  description: string
  features: string[]
  to: string
  cta: string
  accent: 'forest' | 'field'
}) {
  const accentClass =
    accent === 'forest'
      ? 'platform-card-forest hover:border-emerald-400/70'
      : 'platform-card-field hover:border-amber-400/70'

  const buttonClass =
    accent === 'forest'
      ? 'bg-emerald-800 text-white hover:bg-emerald-900'
      : 'bg-stone-800 text-white hover:bg-stone-900'

  return (
    <article
      className={`platform-module-card group flex flex-col rounded-2xl border border-stone-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm transition duration-300 sm:p-7 ${accentClass}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-3xl leading-none"
          aria-hidden="true"
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <h2 className="platform-landing-card-title text-2xl text-stone-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {description}
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2.5 text-sm text-stone-700"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                accent === 'forest' ? 'bg-emerald-700' : 'bg-amber-700'
              }`}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-1 items-end">
        <Link
          to={to}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition duration-200 sm:w-auto ${buttonClass}`}
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}

function StatusRow({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50/80 px-3 py-2.5">
      <span className="text-sm font-medium text-stone-800">{name}</span>
      <span className="text-xs font-semibold tracking-wide text-stone-500">
        Status: {status}
      </span>
    </div>
  )
}
