import type { Product } from '../../../../types/advertisement.ts'
import {
  BULK_BODY_MAX,
  BULK_FOOTER_MAX,
  BULK_SENDER_MAX,
  BULK_TITLE_MAX,
  type BulkCreativeDraft,
} from '../../campaignDraft.ts'
import {
  creativeCallToActionOptions,
  ctaRequiresUrl,
  type CreativeCallToAction,
} from '../../creativeCallToActions.ts'
import CreativeFieldCounter from './CreativeFieldCounter.tsx'

type BulkCreativeFormProps = {
  value: BulkCreativeDraft
  product: Product | undefined
  errors: Record<string, string>
  onChange: (patch: Partial<BulkCreativeDraft>) => void
}

export default function BulkCreativeForm({
  value,
  product,
  errors,
  onChange,
}: BulkCreativeFormProps) {
  const urlRequired = ctaRequiresUrl(value.callToAction)

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Toplu Mesaj İçeriği
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Hedef kitleye gönderilecek kampanya mesajının içeriği.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-bulk-messageTitle"
                className="block text-xs font-medium text-slate-700"
              >
                Mesaj Başlığı <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.messageTitle.length}
                max={BULK_TITLE_MAX}
              />
            </div>
            <input
              id="wiz-bulk-messageTitle"
              maxLength={BULK_TITLE_MAX}
              value={value.messageTitle}
              aria-invalid={Boolean(errors['bulk-messageTitle'])}
              onChange={(e) => onChange({ messageTitle: e.target.value })}
              className={inputClass(Boolean(errors['bulk-messageTitle']))}
              placeholder="Zeytin üreticilerine özel yaz fırsatı"
            />
            {errors['bulk-messageTitle'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['bulk-messageTitle']}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-bulk-messageBody"
                className="block text-xs font-medium text-slate-700"
              >
                Mesaj Metni <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.messageBody.length}
                max={BULK_BODY_MAX}
              />
            </div>
            <textarea
              id="wiz-bulk-messageBody"
              rows={5}
              maxLength={BULK_BODY_MAX}
              value={value.messageBody}
              aria-invalid={Boolean(errors['bulk-messageBody'])}
              onChange={(e) => onChange({ messageBody: e.target.value })}
              className={textareaClass(Boolean(errors['bulk-messageBody']))}
              placeholder="Zeytin üretiminde bitki sağlığını destekleyen ürünümüzde sınırlı süreli fırsattan yararlanabilirsiniz."
            />
            {errors['bulk-messageBody'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['bulk-messageBody']}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="wiz-bulk-callToAction"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                CTA <span className="text-red-500">*</span>
              </label>
              <select
                id="wiz-bulk-callToAction"
                value={value.callToAction ?? ''}
                aria-invalid={Boolean(errors['bulk-callToAction'])}
                onChange={(e) =>
                  onChange({
                    callToAction: (e.target.value ||
                      null) as CreativeCallToAction | null,
                  })
                }
                className={inputClass(Boolean(errors['bulk-callToAction']))}
              >
                <option value="">CTA seçin</option>
                {creativeCallToActionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors['bulk-callToAction'] ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors['bulk-callToAction']}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="wiz-bulk-destinationUrl"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Hedef URL {urlRequired ? <span className="text-red-500">*</span> : null}
              </label>
              <input
                id="wiz-bulk-destinationUrl"
                type="url"
                value={value.destinationUrl}
                aria-invalid={Boolean(errors['bulk-destinationUrl'])}
                onChange={(e) => onChange({ destinationUrl: e.target.value })}
                className={inputClass(Boolean(errors['bulk-destinationUrl']))}
                placeholder="https://marka.com/urun/urun-adi"
              />
              {product?.salesUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    onChange({ destinationUrl: product.salesUrl ?? '' })
                  }
                  className="mt-1.5 text-[11px] font-medium text-emerald-700 hover:underline"
                >
                  Seçili ürünün satış bağlantısını kullan
                </button>
              ) : null}
              {errors['bulk-destinationUrl'] ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors['bulk-destinationUrl']}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-bulk-senderName"
                className="block text-xs font-medium text-slate-700"
              >
                Gönderen Adı <span className="text-red-500">*</span>
              </label>
              <CreativeFieldCounter
                current={value.senderName.length}
                max={BULK_SENDER_MAX}
              />
            </div>
            <input
              id="wiz-bulk-senderName"
              maxLength={BULK_SENDER_MAX}
              value={value.senderName}
              aria-invalid={Boolean(errors['bulk-senderName'])}
              onChange={(e) => onChange({ senderName: e.target.value })}
              className={inputClass(Boolean(errors['bulk-senderName']))}
              placeholder="Marka adı"
            />
            {product?.brand && !value.senderName.trim() ? (
              <button
                type="button"
                onClick={() => onChange({ senderName: product.brand })}
                className="mt-1.5 text-[11px] font-medium text-emerald-700 hover:underline"
              >
                Ürün markasını kullan ({product.brand})
              </button>
            ) : null}
            {errors['bulk-senderName'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['bulk-senderName']}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-1.5 flex items-end justify-between gap-2">
              <label
                htmlFor="wiz-bulk-footerText"
                className="block text-xs font-medium text-slate-700"
              >
                Alt Bilgi
              </label>
              <CreativeFieldCounter
                current={value.footerText.length}
                max={BULK_FOOTER_MAX}
              />
            </div>
            <input
              id="wiz-bulk-footerText"
              maxLength={BULK_FOOTER_MAX}
              value={value.footerText}
              aria-invalid={Boolean(errors['bulk-footerText'])}
              aria-describedby="wiz-bulk-footerText-help"
              onChange={(e) => onChange({ footerText: e.target.value })}
              className={inputClass(Boolean(errors['bulk-footerText']))}
              placeholder="Kampanya 31 Ağustos 2026 tarihine kadar geçerlidir."
            />
            <p id="wiz-bulk-footerText-help" className="mt-1 text-[11px] text-slate-500">
              İptal, yasal bilgilendirme veya kampanya koşulları için
              kullanılabilir.
            </p>
            {errors['bulk-footerText'] ? (
              <p className="mt-1 text-[11px] text-red-600">
                {errors['bulk-footerText']}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-sky-100 bg-sky-50/50 p-4">
        <h3 className="text-xs font-semibold text-sky-900">
          Toplu mesaj yazım ilkeleri
        </h3>
        <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-sky-900/80">
          <li>• Mesaj kısa ve anlaşılır olmalı</li>
          <li>• Kampanya koşulları açık belirtilmeli</li>
          <li>• Yanıltıcı fiyat veya indirim iddiası kullanılmamalı</li>
          <li>• Aciliyet dili abartılı olmamalı</li>
          <li>
            • Pazarlama izni olmayan çiftçilere mesaj gönderilmemelidir
            (bilgilendirme)
          </li>
        </ul>
      </aside>
    </div>
  )
}

function inputClass(hasError: boolean): string {
  return `h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}

function textareaClass(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}
