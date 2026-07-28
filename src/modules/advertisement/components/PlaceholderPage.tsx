import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import PageHeader from './PageHeader.tsx'
import { adPaths } from '../paths.ts'

type PlaceholderPageProps = {
  title: string
  description: string
  actions?: React.ReactNode
}

export default function PlaceholderPage({
  title,
  description,
  actions,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} actions={actions} />

      <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Construction className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          {description}
        </p>
        <p className="mt-3 text-sm text-slate-400">
          Bu ekran sonraki geliştirme adımında tamamlanacaktır.
        </p>
        <Link
          to={adPaths.dashboard}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard&apos;a dön
        </Link>
      </div>
    </div>
  )
}
