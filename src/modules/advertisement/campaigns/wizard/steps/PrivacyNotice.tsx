type PrivacyNoticeProps = {
  className?: string
}

export default function PrivacyNotice({ className = '' }: PrivacyNoticeProps) {
  return (
    <aside
      className={`rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 ${className}`}
    >
      <h3 className="text-xs font-semibold text-slate-900">
        Gizlilik ve Veri Koruma
      </h3>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
        Hedefleme yalnızca anonim ve toplulaştırılmış kriterlerle yapılır.
        Reklamverenler çiftçilerin ad, telefon, e-posta veya tekil profil
        bilgilerine erişemez.
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
        Gerçek kampanya tesliminde izin ve uygunluk kontrolleri AgriGO sistemi
        tarafından uygulanacaktır. Bu sihirbazda gösterilen değerler mock
        tahmindir.
      </p>
    </aside>
  )
}
