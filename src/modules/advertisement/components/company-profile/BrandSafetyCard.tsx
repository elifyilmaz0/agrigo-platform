import type { AdvertiserBrandSafety } from '../../types/advertiserProfile.ts'
import ProfileSectionCard from './ProfileSectionCard.tsx'

type BrandSafetyCardProps = {
  brandSafety: AdvertiserBrandSafety
}

export default function BrandSafetyCard({ brandSafety }: BrandSafetyCardProps) {
  return (
    <ProfileSectionCard
      title="Marka Güvenliği"
      description="Reklam gösterimlerinde uygulanan güvenlik ve uygunluk tercihleri."
      footnote="Bu alanlar gelecekte yönetici kararları doğrultusunda genişletilecektir."
    >
      <div className="space-y-4">
        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">
              Riskli Konularda Reklam Gösterme
            </p>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                brandSafety.showAdsOnRiskyTopics
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {brandSafety.showAdsOnRiskyTopics ? 'Açık' : 'Kapalı'}
            </span>
          </div>
        </div>

        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <p className="text-xs font-medium text-slate-500">
            Hassas Kategoriler
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {brandSafety.sensitiveCategories.length > 0 ? (
              brandSafety.sensitiveCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Tanımlı değil</span>
            )}
          </div>
        </div>

        <div className="rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
          <p className="text-xs font-medium text-slate-500">Yasaklı Kelimeler</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {brandSafety.blockedKeywords.length > 0 ? (
              brandSafety.blockedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-800"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">Tanımlı değil</span>
            )}
          </div>
        </div>
      </div>
    </ProfileSectionCard>
  )
}
