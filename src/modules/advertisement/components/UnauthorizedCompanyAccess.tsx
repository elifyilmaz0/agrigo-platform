import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { adPaths } from '../paths.ts'

type UnauthorizedCompanyAccessProps = {
  title?: string
  description?: string
}

export default function UnauthorizedCompanyAccess({
  title = 'Bu içeriğe erişim yetkiniz bulunmuyor.',
  description = 'Erişmeye çalıştığınız şirket veya kayıt, oturumunuz için yetkilendirilmiş hesap kapsamında değil. Veriler gösterilmedi.',
}: UnauthorizedCompanyAccessProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
        <ShieldAlert className="h-5 w-5" aria-hidden />
      </div>
      <h1 className="mt-4 text-base font-semibold text-rose-950">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-rose-900/80">
        {description}
      </p>
      <Link
        to={adPaths.dashboard}
        className="mt-5 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
      >
        Dashboard’a Dön
      </Link>
    </div>
  )
}
