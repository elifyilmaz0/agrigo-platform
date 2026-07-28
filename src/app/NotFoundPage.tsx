import { Link } from 'react-router-dom'
import { adPaths, FARMER360_BASE } from '../modules/advertisement/paths.ts'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center">
      <p className="text-sm font-semibold text-slate-900">Sayfa bulunamadı</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        İstediğiniz adres mevcut değil veya taşınmış olabilir.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Link
          to={adPaths.dashboard}
          className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
        >
          Reklam Platformu
        </Link>
        <Link
          to={FARMER360_BASE}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Farmer360
        </Link>
      </div>
    </div>
  )
}
