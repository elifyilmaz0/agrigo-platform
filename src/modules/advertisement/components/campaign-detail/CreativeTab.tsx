import { Link } from 'react-router-dom'
import { adPaths } from '../../paths.ts'
import type { Campaign } from '../../types/advertisement.ts'

type CreativeTabProps = {
  campaign: Campaign
}

export default function CreativeTab({ campaign }: CreativeTabProps) {
  const isDraft = campaign.status === 'draft'
  const creative = campaign.creative

  return (
    <div className="space-y-4">
      {isDraft ? (
        <div className="flex justify-end">
          <Link
            to={`${adPaths.campaignEdit(campaign.id)}?step=creative`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Kreatifi Düzenle
          </Link>
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Bu kampanya taslak olmadığı için kreatif salt okunur görüntülenir.
        </p>
      )}

      {creative.kind === 'native' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Kreatif İçerik
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Başlık</dt>
                <dd className="mt-0.5 font-medium text-slate-800">
                  {creative.headline}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Kısa öneri metni</dt>
                <dd className="mt-0.5 text-slate-700">
                  {creative.recommendationText}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Ürün fayda açıklaması</dt>
                <dd className="mt-0.5 text-slate-700">{creative.benefitText}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">CTA metni</dt>
                <dd className="mt-0.5 font-medium text-emerald-700">
                  {creative.ctaText}
                </dd>
              </div>
              {creative.imageLabel ? (
                <div>
                  <dt className="text-xs text-slate-500">Opsiyonel görsel</dt>
                  <dd className="mt-0.5 text-slate-700">{creative.imageLabel}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Sponsorlu Öneri kart önizlemesi
            </h3>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4">
              <span className="inline-flex rounded-md border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
                Sponsorlu Öneri
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {creative.headline}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {creative.recommendationText}
              </p>
              <p className="mt-2 text-xs text-slate-500">{creative.benefitText}</p>
              {creative.imageLabel ? (
                <div className="mt-3 flex h-24 items-center justify-center rounded-md border border-dashed border-slate-200 bg-white text-[11px] text-slate-400">
                  {creative.imageLabel}
                </div>
              ) : null}
              <button
                type="button"
                disabled
                className="mt-3 rounded-md bg-emerald-700/80 px-3 py-1.5 text-xs font-medium text-white opacity-80"
              >
                {creative.ctaText}
              </button>
              <p className="mt-2 text-[11px] text-slate-400">
                Önizleme modunda bağlantılar aktif değildir.
              </p>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              AI cevabı ile reklam kartı aynı mesaj balonunda gösterilmez.
            </p>
          </section>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Mesaj İçeriği
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Mesaj başlığı</dt>
                <dd className="mt-0.5 font-medium text-slate-800">
                  {creative.messageTitle}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Mesaj gövdesi</dt>
                <dd className="mt-0.5 leading-relaxed text-slate-700">
                  {creative.messageBody}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">CTA metni</dt>
                <dd className="mt-0.5 font-medium text-emerald-700">
                  {creative.ctaText}
                </dd>
              </div>
              {creative.imageLabel ? (
                <div>
                  <dt className="text-xs text-slate-500">Opsiyonel görsel</dt>
                  <dd className="mt-0.5 text-slate-700">{creative.imageLabel}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              WhatsApp formatı simülasyonu
            </h3>
            <p className="mb-3 text-[11px] text-slate-500">
              WhatsApp formatı simülasyonu — gerçek WhatsApp gönderimi değildir.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-[#ece5dd] p-3">
              <div className="ml-auto max-w-[90%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-3 py-2 shadow-sm">
                <p className="text-xs font-semibold text-slate-800">
                  {creative.messageTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  {creative.messageBody}
                </p>
                {creative.imageLabel ? (
                  <div className="mt-2 rounded-md bg-white/70 px-2 py-3 text-center text-[10px] text-slate-500">
                    {creative.imageLabel}
                  </div>
                ) : null}
                <button
                  type="button"
                  disabled
                  className="mt-2 text-xs font-semibold text-sky-700 underline opacity-80"
                >
                  {creative.ctaText}
                </button>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Önizleme modunda bağlantılar aktif değildir.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}
