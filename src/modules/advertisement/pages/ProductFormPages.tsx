import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.tsx'
import PlaceholderPage from '../components/PlaceholderPage.tsx'
import { getProductForCompany, productCategories } from '../data/products.ts'
import { productSalesStatusOptions } from '../data/productSalesStatus.ts'
import { productStockStatusOptions } from '../data/productStockStatus.ts'
import { adPaths } from '../paths.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type {
  ProductCategory,
  ProductSalesStatus,
  ProductStockStatus,
} from '../types/advertisement.ts'

type UsageSeason =
  | ''
  | 'İlkbahar'
  | 'Yaz'
  | 'Sonbahar'
  | 'Kış'
  | 'Hasat Öncesi'
  | 'Hasat Sonrası'
  | 'Tüm Sezon'

type ProductFormState = {
  name: string
  category: ProductCategory | ''
  brand: string
  shortDescription: string
  description: string
  listPrice: string
  discountedPrice: string
  salesStatus: ProductSalesStatus | ''
  stockStatus: ProductStockStatus | ''
  salesUrl: string
  sellerContact: string
  productionTypeText: string
  relatedCropsText: string
  livestockAreaText: string
  farmerProfileText: string
  usagePurposeText: string
  usageSeason: UsageSeason
  usageNotes: string
  imagePreviewUrl: string | null
  imageFileName: string | null
}

type FormErrorKey =
  | 'name'
  | 'category'
  | 'brand'
  | 'shortDescription'
  | 'description'
  | 'listPrice'
  | 'discountedPrice'
  | 'salesStatus'
  | 'stockStatus'
  | 'salesUrl'
  | 'sellerContact'
  | 'commerceContact'

type FormErrors = Partial<Record<FormErrorKey, string>>

const SHORT_DESCRIPTION_MAX = 160
const DESCRIPTION_MAX = 1000
const NAME_MAX = 100
const NAME_MIN = 2
const BRAND_MAX = 80
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

const usageSeasonOptions: Exclude<UsageSeason, ''>[] = [
  'İlkbahar',
  'Yaz',
  'Sonbahar',
  'Kış',
  'Hasat Öncesi',
  'Hasat Sonrası',
  'Tüm Sezon',
]

const emptyForm: ProductFormState = {
  name: '',
  category: '',
  brand: '',
  shortDescription: '',
  description: '',
  listPrice: '',
  discountedPrice: '',
  salesStatus: '',
  stockStatus: '',
  salesUrl: '',
  sellerContact: '',
  productionTypeText: '',
  relatedCropsText: '',
  livestockAreaText: '',
  farmerProfileText: '',
  usagePurposeText: '',
  usageSeason: '',
  usageNotes: '',
  imagePreviewUrl: null,
  imageFileName: null,
}

const FIELD_FOCUS_ORDER: FormErrorKey[] = [
  'name',
  'brand',
  'category',
  'shortDescription',
  'description',
  'listPrice',
  'discountedPrice',
  'salesStatus',
  'stockStatus',
  'salesUrl',
  'sellerContact',
  'commerceContact',
]

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? NaN : parsed
}

function isFormDirty(current: ProductFormState, initial: ProductFormState): boolean {
  return (Object.keys(current) as Array<keyof ProductFormState>).some(
    (key) => current[key] !== initial[key],
  )
}

function fieldClass(hasError: boolean): string {
  return `h-9 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}

function textareaClass(hasError = false): string {
  return `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
  }`
}

function focusFirstInvalid(errors: FormErrors) {
  const first = FIELD_FOCUS_ORDER.find((key) => errors[key])
  if (!first) return
  const id =
    first === 'commerceContact' ? 'product-sales-url' : `product-${kebab(first)}`
  window.requestAnimationFrame(() => {
    const element = document.getElementById(id)
    if (element instanceof HTMLElement) element.focus()
  })
}

function kebab(value: string): string {
  return value.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function ProductForm({
  title,
  description,
  initial,
  submitLabel,
}: {
  title: string
  description: string
  initial: ProductFormState
  submitLabel: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<FormErrors>({})
  const [toastVisible, setToastVisible] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (form.imagePreviewUrl) URL.revokeObjectURL(form.imagePreviewUrl)
    }
  }, [form.imagePreviewUrl])

  const dirty = isFormDirty(form, initial)

  function goBack() {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate(adPaths.products)
  }

  function leaveWithoutSaving() {
    setConfirmOpen(false)
    navigate(adPaths.products)
  }

  function handleCancel() {
    if (!dirty) {
      navigate(adPaths.products)
      return
    }
    setConfirmOpen(true)
  }

  function clearError(key: FormErrorKey) {
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const trimmedName = form.name.trim()
    const trimmedBrand = form.brand.trim()
    const trimmedShort = form.shortDescription.trim()

    if (!trimmedName) next.name = 'Ürün adı zorunludur.'
    else if (trimmedName.length < NAME_MIN) {
      next.name = `Ürün adı en az ${NAME_MIN} karakter olmalıdır.`
    } else if (form.name.length > NAME_MAX) {
      next.name = `Ürün adı en fazla ${NAME_MAX} karakter olabilir.`
    }

    if (!trimmedBrand) next.brand = 'Marka zorunludur.'
    else if (form.brand.length > BRAND_MAX) {
      next.brand = `Marka en fazla ${BRAND_MAX} karakter olabilir.`
    }

    if (!form.category) next.category = 'Kategori seçilmelidir.'

    if (!trimmedShort) next.shortDescription = 'Kısa açıklama zorunludur.'
    else if (form.shortDescription.length > SHORT_DESCRIPTION_MAX) {
      next.shortDescription = `Kısa açıklama en fazla ${SHORT_DESCRIPTION_MAX} karakter olabilir.`
    }

    if (form.description.length > DESCRIPTION_MAX) {
      next.description = `Detaylı açıklama en fazla ${DESCRIPTION_MAX} karakter olabilir.`
    }

    const listPrice = parseOptionalNumber(form.listPrice)
    if (listPrice != null) {
      if (Number.isNaN(listPrice) || listPrice < 0) {
        next.listPrice = 'Normal satış fiyatı 0 veya daha büyük olmalıdır.'
      }
    }

    const discountedPrice = parseOptionalNumber(form.discountedPrice)
    if (discountedPrice != null) {
      if (Number.isNaN(discountedPrice) || discountedPrice < 0) {
        next.discountedPrice = 'İndirimli fiyat 0 veya daha büyük olmalıdır.'
      } else if (
        listPrice != null &&
        !Number.isNaN(listPrice) &&
        discountedPrice > listPrice
      ) {
        next.discountedPrice =
          'İndirimli fiyat normal satış fiyatından büyük olamaz.'
      }
    }

    if (!form.salesStatus) next.salesStatus = 'Satış durumu seçilmelidir.'
    if (!form.stockStatus) next.stockStatus = 'Stok durumu seçilmelidir.'

    if (form.salesStatus === 'on-sale') {
      const hasSalesUrl = Boolean(form.salesUrl.trim())
      const hasContact = Boolean(form.sellerContact.trim())
      if (!hasSalesUrl && !hasContact) {
        next.commerceContact =
          'Satışta olan ürün için satın alma bağlantısı veya satıcı iletişim bilgisi girin.'
      }
    }

    if (form.salesUrl.trim() && !isValidUrl(form.salesUrl.trim())) {
      next.salesUrl = 'Geçerli bir URL girin (http:// veya https://).'
    }

    return next
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalid(nextErrors)
      return
    }
    setToastVisible(true)
    window.setTimeout(() => navigate(adPaths.products), 900)
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !ACCEPTED_IMAGE_TYPES.includes(file.type)) return
    if (form.imagePreviewUrl) URL.revokeObjectURL(form.imagePreviewUrl)
    setForm((current) => ({
      ...current,
      imagePreviewUrl: URL.createObjectURL(file),
      imageFileName: file.name,
    }))
  }

  function clearImage() {
    if (form.imagePreviewUrl) URL.revokeObjectURL(form.imagePreviewUrl)
    setForm((current) => ({
      ...current,
      imagePreviewUrl: null,
      imageFileName: null,
    }))
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Ürünlere Dön
      </button>

      <PageHeader title={title} description={description} />

      <form onSubmit={handleSubmit} noValidate className="max-w-[960px] space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Genel Bilgiler</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ürünün katalog kimliği. Kampanya bağlantısından bağımsızdır.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="product-name" className="mb-1.5 block text-xs font-medium text-slate-700">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="product-name"
                maxLength={NAME_MAX}
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'product-name-error' : undefined}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }))
                  clearError('name')
                }}
                className={fieldClass(Boolean(errors.name))}
                placeholder="Örn. DripFlow Damla Sulama Filtresi"
              />
              {errors.name ? (
                <p id="product-name-error" className="mt-1 text-[11px] text-red-600">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="product-category" className="mb-1.5 block text-xs font-medium text-slate-700">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category"
                value={form.category}
                aria-invalid={Boolean(errors.category)}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as ProductCategory | '',
                  }))
                  clearError('category')
                }}
                className={fieldClass(Boolean(errors.category))}
              >
                <option value="">Kategori seçin</option>
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.category}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="product-brand" className="mb-1.5 block text-xs font-medium text-slate-700">
                Marka / Üretici <span className="text-red-500">*</span>
              </label>
              <input
                id="product-brand"
                maxLength={BRAND_MAX}
                value={form.brand}
                aria-invalid={Boolean(errors.brand)}
                onChange={(e) => {
                  setForm((f) => ({ ...f, brand: e.target.value }))
                  clearError('brand')
                }}
                className={fieldClass(Boolean(errors.brand))}
                placeholder="Örn. DripFlow"
              />
              {errors.brand ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.brand}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="product-short-description"
                  className="block text-xs font-medium text-slate-700"
                >
                  Kısa Açıklama <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {form.shortDescription.length}/{SHORT_DESCRIPTION_MAX}
                </span>
              </div>
              <textarea
                id="product-short-description"
                rows={3}
                maxLength={SHORT_DESCRIPTION_MAX}
                value={form.shortDescription}
                aria-invalid={Boolean(errors.shortDescription)}
                onChange={(e) => {
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                  clearError('shortDescription')
                }}
                className={textareaClass(Boolean(errors.shortDescription))}
                placeholder="Kartlarda görünecek kısa ürün açıklaması."
              />
              {errors.shortDescription ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.shortDescription}
                </p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor="product-description"
                  className="block text-xs font-medium text-slate-700"
                >
                  Detaylı Açıklama
                </label>
                <span className="text-[11px] text-slate-400">
                  {form.description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
              <textarea
                id="product-description"
                rows={4}
                maxLength={DESCRIPTION_MAX}
                value={form.description}
                aria-invalid={Boolean(errors.description)}
                onChange={(e) => {
                  setForm((f) => ({ ...f, description: e.target.value }))
                  clearError('description')
                }}
                className={textareaClass(Boolean(errors.description))}
                placeholder="Ürün detay sayfasında gösterilecek uzun açıklama."
              />
              {errors.description ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.description}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Ticari Bilgiler</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyadan bağımsız katalog fiyatı, satış ve stok bilgileri.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="product-list-price" className="mb-1.5 block text-xs font-medium text-slate-700">
                Normal Satış Fiyatı
              </label>
              <div className="relative">
                <input
                  id="product-list-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.listPrice}
                  aria-invalid={Boolean(errors.listPrice)}
                  aria-describedby="product-list-price-help product-list-price-error"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || Number(value) >= 0) {
                      setForm((f) => ({ ...f, listPrice: value }))
                      clearError('listPrice')
                      clearError('discountedPrice')
                    }
                  }}
                  className={`${fieldClass(Boolean(errors.listPrice))} pr-10`}
                  placeholder="0"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
                  ₺
                </span>
              </div>
              <p id="product-list-price-help" className="mt-1 text-[11px] text-slate-500">
                Ürünün kampanya dışında geçerli normal satış fiyatıdır.
              </p>
              {errors.listPrice ? (
                <p id="product-list-price-error" className="mt-1 text-[11px] text-red-600">
                  {errors.listPrice}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="product-discounted-price"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                İndirimli Satış Fiyatı
              </label>
              <div className="relative">
                <input
                  id="product-discounted-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.discountedPrice}
                  aria-invalid={Boolean(errors.discountedPrice)}
                  aria-describedby="product-discounted-price-help product-discounted-price-error"
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || Number(value) >= 0) {
                      setForm((f) => ({ ...f, discountedPrice: value }))
                      clearError('discountedPrice')
                    }
                  }}
                  className={`${fieldClass(Boolean(errors.discountedPrice))} pr-10`}
                  placeholder="0"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400">
                  ₺
                </span>
              </div>
              <p
                id="product-discounted-price-help"
                className="mt-1 text-[11px] text-slate-500"
              >
                Ürün katalogda indirimli fiyatla gösterilecekse kullanılır. Kampanya
                indirimi değildir.
              </p>
              {errors.discountedPrice ? (
                <p
                  id="product-discounted-price-error"
                  className="mt-1 text-[11px] text-red-600"
                >
                  {errors.discountedPrice}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="product-sales-status" className="mb-1.5 block text-xs font-medium text-slate-700">
                Satış Durumu <span className="text-red-500">*</span>
              </label>
              <select
                id="product-sales-status"
                value={form.salesStatus}
                aria-invalid={Boolean(errors.salesStatus)}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    salesStatus: e.target.value as ProductSalesStatus | '',
                  }))
                  clearError('salesStatus')
                  clearError('commerceContact')
                }}
                className={fieldClass(Boolean(errors.salesStatus))}
              >
                <option value="">Satış durumu seçin</option>
                {productSalesStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.salesStatus ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.salesStatus}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="product-stock-status" className="mb-1.5 block text-xs font-medium text-slate-700">
                Stok Durumu <span className="text-red-500">*</span>
              </label>
              <select
                id="product-stock-status"
                value={form.stockStatus}
                aria-invalid={Boolean(errors.stockStatus)}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    stockStatus: e.target.value as ProductStockStatus | '',
                  }))
                  clearError('stockStatus')
                }}
                className={fieldClass(Boolean(errors.stockStatus))}
              >
                <option value="">Stok durumu seçin</option>
                {productStockStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.stockStatus ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.stockStatus}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="product-sales-url" className="mb-1.5 block text-xs font-medium text-slate-700">
                Satın Alma Bağlantısı
              </label>
              <input
                id="product-sales-url"
                type="url"
                value={form.salesUrl}
                aria-invalid={Boolean(errors.salesUrl || errors.commerceContact)}
                aria-describedby="product-sales-url-help product-sales-url-error product-commerce-contact-error"
                onChange={(e) => {
                  setForm((f) => ({ ...f, salesUrl: e.target.value }))
                  clearError('salesUrl')
                  clearError('commerceContact')
                }}
                className={fieldClass(
                  Boolean(errors.salesUrl || errors.commerceContact),
                )}
                placeholder="https://marka.com/urun/urun-adi"
              />
              <p id="product-sales-url-help" className="mt-1 text-[11px] text-slate-500">
                Kullanıcı ürünle ilgilendiğinde yönlendirileceği satış sayfasıdır.
              </p>
              {errors.salesUrl ? (
                <p id="product-sales-url-error" className="mt-1 text-[11px] text-red-600">
                  {errors.salesUrl}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="product-seller-contact"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Satıcı İletişim Bilgisi
              </label>
              <input
                id="product-seller-contact"
                value={form.sellerContact}
                aria-invalid={Boolean(errors.commerceContact)}
                onChange={(e) => {
                  setForm((f) => ({ ...f, sellerContact: e.target.value }))
                  clearError('sellerContact')
                  clearError('commerceContact')
                }}
                className={fieldClass(Boolean(errors.commerceContact))}
                placeholder="0850 000 00 00 veya satis@marka.com"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Doğrudan satın alma bağlantısı yoksa kullanıcıya gösterilecek
                iletişim bilgisidir.
              </p>
              {errors.commerceContact ? (
                <p
                  id="product-commerce-contact-error"
                  className="mt-1 text-[11px] text-red-600"
                >
                  {errors.commerceContact}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Ürün Uygunluğu</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Serbest metin alanları — hedefleme ve katalog uygunluğu için.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="production-type" className="mb-1.5 block text-xs font-medium text-slate-700">
                İlgili Üretim Tipi
              </label>
              <input
                id="production-type"
                value={form.productionTypeText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, productionTypeText: e.target.value }))
                }
                className={fieldClass(false)}
                placeholder="Örn: Bitkisel üretim, Hayvansal üretim"
              />
            </div>
            <div>
              <label htmlFor="livestock-area" className="mb-1.5 block text-xs font-medium text-slate-700">
                İlgili Hayvancılık Alanı
              </label>
              <input
                id="livestock-area"
                value={form.livestockAreaText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, livestockAreaText: e.target.value }))
                }
                className={fieldClass(false)}
                placeholder="Büyükbaş, Küçükbaş, Kanatlı, Arıcılık"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="related-crops" className="mb-1.5 block text-xs font-medium text-slate-700">
                İlgili Ürünler
              </label>
              <textarea
                id="related-crops"
                rows={4}
                value={form.relatedCropsText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, relatedCropsText: e.target.value }))
                }
                className={textareaClass()}
                placeholder={'Örn.\nZeytin\nÜzüm\nDomates'}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="farmer-profile" className="mb-1.5 block text-xs font-medium text-slate-700">
                Hedef Çiftçi Profili
              </label>
              <textarea
                id="farmer-profile"
                rows={3}
                value={form.farmerProfileText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, farmerProfileText: e.target.value }))
                }
                className={textareaClass()}
                placeholder="Orta ve büyük ölçekli zeytin üreticileri"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="usage-purpose" className="mb-1.5 block text-xs font-medium text-slate-700">
                Ürünün Kullanım Amacı
              </label>
              <textarea
                id="usage-purpose"
                rows={3}
                value={form.usagePurposeText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usagePurposeText: e.target.value }))
                }
                className={textareaClass()}
                placeholder={'Örn.\nVerim artırma\nHastalık önleme'}
              />
            </div>
            <div>
              <label htmlFor="usage-season" className="mb-1.5 block text-xs font-medium text-slate-700">
                Önerilen Kullanım Dönemi
              </label>
              <select
                id="usage-season"
                value={form.usageSeason}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    usageSeason: e.target.value as UsageSeason,
                  }))
                }
                className={fieldClass(false)}
              >
                <option value="">Dönem seçin</option>
                {usageSeasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="usage-notes" className="mb-1.5 block text-xs font-medium text-slate-700">
                Ek Kullanım Notları
              </label>
              <textarea
                id="usage-notes"
                rows={3}
                value={form.usageNotes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, usageNotes: e.target.value }))
                }
                className={textareaClass()}
                placeholder="Opsiyonel — dozaj, uyarı veya uygulama notları"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Görsel</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              PNG, JPG veya WEBP. Gerçek yükleme yapılmaz; yalnızca yerel önizleme.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40 sm:w-56">
              <ImagePlus className="mb-2 h-5 w-5 text-slate-400" />
              <span className="text-xs font-medium text-slate-700">Görsel seç</span>
              <span className="mt-1 text-[11px] text-slate-400">PNG · JPG · WEBP</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {form.imagePreviewUrl ? (
              <div className="relative inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img
                  src={form.imagePreviewUrl}
                  alt="Ürün önizlemesi"
                  className="h-36 w-36 object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm hover:text-red-600"
                  aria-label="Görseli kaldır"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            {submitLabel}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            İptal
          </button>
        </div>
      </form>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              Kaydedilmemiş değişiklikler
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin
              misiniz?
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Düzenlemeye Devam Et
              </button>
              <button
                type="button"
                onClick={leaveWithoutSaving}
                className="rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-900"
              >
                Değişiklikleri Kaydetmeden Çık
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toastVisible ? (
        <div className="fixed right-4 bottom-4 z-50 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-md">
          Ürün başarıyla kaydedildi.
        </div>
      ) : null}
    </div>
  )
}

export default function ProductNewPage() {
  return (
    <ProductForm
      title="Yeni Ürün"
      description="Kataloga yeni bir ticari ürün ekleyin. Kampanya bağlantısı opsiyoneldir."
      submitLabel="Ürünü Kaydet"
      initial={emptyForm}
    />
  )
}

export function ProductEditPage() {
  const { productId } = useParams()
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const product = useMemo(
    () =>
      productId && canAccessSelectedCompany
        ? getProductForCompany(productId, selectedCompanyId)
        : undefined,
    [productId, canAccessSelectedCompany, selectedCompanyId],
  )

  if (!product) {
    return (
      <PlaceholderPage
        title="Ürün bulunamadı"
        description="Bu içeriğe erişim yetkiniz bulunmuyor. Ürün mevcut değil veya başka bir şirkete aittir."
      />
    )
  }

  return (
    <ProductForm
      title="Ürün Düzenle"
      description={`${product.name} bilgilerini güncelleyin.`}
      submitLabel="Değişiklikleri Kaydet"
      initial={{
        ...emptyForm,
        name: product.name,
        category: product.category,
        brand: product.brand,
        shortDescription: product.shortDescription.slice(0, SHORT_DESCRIPTION_MAX),
        description: product.description ?? '',
        listPrice:
          product.listPrice != null ? String(product.listPrice) : '',
        discountedPrice:
          product.discountedPrice != null
            ? String(product.discountedPrice)
            : '',
        salesStatus: product.salesStatus ?? 'not-on-sale',
        stockStatus: product.stockStatus ?? 'unknown',
        salesUrl: product.salesUrl ?? '',
        sellerContact: product.sellerContact ?? '',
        productionTypeText: product.productionType ?? '',
        relatedCropsText: product.relevantProducts ?? '',
        livestockAreaText: product.livestockArea ?? '',
        farmerProfileText: product.targetFarmerProfile ?? '',
        usagePurposeText: product.usagePurpose ?? '',
        usageSeason: (product.recommendedSeason as UsageSeason) || '',
        usageNotes: product.usageNotes ?? '',
      }}
    />
  )
}
