import { useMemo, useRef, useState } from 'react'
import { Check, ImageIcon, Search } from 'lucide-react'
import ProductPriceDisplay from '../../../components/ProductPriceDisplay.tsx'
import ProductStatusBadge from '../../../components/ProductStatusBadge.tsx'
import {
  getProductBrand,
  getProductById,
  getProductShortDescription,
  getProductsForCompany,
} from '../../../data/products.ts'
import { getProductSalesStatusOption } from '../../../data/productSalesStatus.ts'
import { getProductStockStatusOption } from '../../../data/productStockStatus.ts'
import { useTenant } from '../../../tenant/TenantProvider.tsx'
import type { Product, ProductCategory } from '../../../types/advertisement.ts'
import { formatNumber } from '../../../utils/formatters.ts'
import type { CampaignDraft } from '../campaignDraft.ts'

type ProductStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
  onAddProduct: () => void
}

export default function ProductStep({
  draft,
  errors,
  onChange,
  onAddProduct,
}: ProductStepProps) {
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | ProductCategory>('all')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const products = useMemo(
    () =>
      canAccessSelectedCompany
        ? getProductsForCompany(selectedCompanyId)
        : [],
    [canAccessSelectedCompany, selectedCompanyId],
  )

  const categoryOptions = useMemo(() => {
    const present = new Set(products.map((product) => product.category))
    return Array.from(present).sort((a, b) => a.localeCompare(b, 'tr'))
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR')
    return products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (!normalized) return true
      const brand = getProductBrand(product).toLocaleLowerCase('tr-TR')
      return (
        product.name.toLocaleLowerCase('tr-TR').includes(normalized) ||
        brand.includes(normalized) ||
        product.category.toLocaleLowerCase('tr-TR').includes(normalized)
      )
    })
  }, [query, category, products])

  const selectedProduct = draft.productId
    ? getProductById(draft.productId)
    : undefined
  const selectedInTenant =
    selectedProduct &&
    selectedCompanyId &&
    selectedProduct.companyId === selectedCompanyId
      ? selectedProduct
      : undefined

  function selectProduct(productId: string) {
    onChange({ productId })
  }

  function clearSelectionFocus() {
    searchInputRef.current?.focus()
    searchInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Kampanyada Tanıtılacak Ürün
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyanızda tanıtılacak kayıtlı ürünü seçin. Ürünler kampanyadan
              bağımsız olarak katalogda satışa sunulabilir.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={onAddProduct}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Yeni Ürün Ekle
            </button>
            <p className="mt-1 max-w-[220px] text-[11px] text-slate-500">
              Aradığınız ürün kayıtlı değilse önce ürün kataloğuna
              ekleyebilirsiniz.
            </p>
          </div>
        </div>

        {selectedInTenant ? (
          <SelectedProductSummary
            product={selectedInTenant}
            onChangeSelection={clearSelectionFocus}
          />
        ) : null}

        {selectedInTenant ? (
          <ProductCompatibilityNote campaignType={draft.campaignType} />
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px]">
          <div>
            <label
              htmlFor="wiz-product-search"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Ürün Ara
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                ref={searchInputRef}
                id="wiz-product-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün adı, marka veya kategori ara"
                className="h-9 w-full rounded-md border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="wiz-product-category"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Kategori
            </label>
            <select
              id="wiz-product-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as 'all' | ProductCategory)
              }
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="all">Tümü</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {filteredProducts.length} ürün bulundu
        </p>

        {errors.productId ? (
          <p
            id="wiz-productId-error"
            className="mt-2 text-[11px] text-red-600"
            role="alert"
          >
            {errors.productId}
          </p>
        ) : null}

        <div
          id="wiz-productId"
          role="radiogroup"
          aria-labelledby="wiz-product-group-label"
          aria-describedby={errors.productId ? 'wiz-productId-error' : undefined}
          tabIndex={-1}
          className="mt-3 outline-none"
        >
          <p id="wiz-product-group-label" className="sr-only">
            Kampanya ürünü seçimi
          </p>

          {products.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">Henüz ürün yok</p>
              <p className="mt-1 text-xs text-slate-500">
                Kampanya oluşturmak için önce bir ürün ekleyin.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 px-4 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">
                Aramanızla eşleşen ürün bulunamadı.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Arama kriterlerini değiştirebilir veya yeni ürün
                ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductSelectionCard
                  key={product.id}
                  product={product}
                  selected={draft.productId === product.id}
                  onSelect={() => selectProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SelectedProductSummary({
  product,
  onChangeSelection,
}: {
  product: Product
  onChangeSelection: () => void
}) {
  const salesOption = getProductSalesStatusOption(product.salesStatus)
  const stockOption = getProductStockStatusOption(product.stockStatus)

  return (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wide text-emerald-700 uppercase">
            Seçilen Ürün
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {product.name}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {getProductBrand(product)} · {product.category}
          </p>
          <div className="mt-2">
            <ProductPriceDisplay product={product} compact />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {salesOption ? (
              <ProductStatusBadge
                label={salesOption.label}
                tone={salesOption.tone}
              />
            ) : null}
            {stockOption ? (
              <ProductStatusBadge
                label={stockOption.label}
                tone={stockOption.tone}
              />
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
            {getProductShortDescription(product)}
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeSelection}
          className="rounded-md border border-emerald-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50"
        >
          Seçimi Değiştir
        </button>
      </div>
    </div>
  )
}

function ProductCompatibilityNote({
  campaignType,
}: {
  campaignType: CampaignDraft['campaignType']
}) {
  let message =
    'Kampanya gösterim modeli, Kampanya Bilgileri adımında seçilecektir.'

  if (campaignType === 'native') {
    message =
      'Bu ürün, çiftçinin ihtiyacıyla eşleşen AI sohbetlerinde öneri olarak kullanılacaktır.'
  } else if (campaignType === 'bulk') {
    message =
      'Bu ürün, hedef kitleye gönderilecek toplu kampanya mesajında kullanılacaktır.'
  }

  return (
    <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 px-3.5 py-3">
      <p className="text-[11px] leading-relaxed text-slate-600">{message}</p>
    </div>
  )
}

function ProductSelectionCard({
  product,
  selected,
  onSelect,
}: {
  product: Product
  selected: boolean
  onSelect: () => void
}) {
  const salesOption = getProductSalesStatusOption(product.salesStatus)
  const stockOption = getProductStockStatusOption(product.stockStatus)

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex h-full flex-col rounded-lg border p-3 text-left transition-colors ${
        selected
          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-200'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="relative mb-3">
        <div className="flex h-16 w-full items-center justify-center rounded-md bg-slate-50 text-slate-400">
          <ImageIcon className="h-5 w-5" aria-hidden />
        </div>
        <span
          className={`absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-slate-300 bg-white'
          }`}
          aria-hidden
        >
          {selected ? <Check className="h-3 w-3" /> : null}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
      <p className="mt-1 text-[11px] text-slate-500">
        {getProductBrand(product)} · {product.category}
      </p>

      <div className="mt-2">
        <ProductPriceDisplay product={product} compact />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {salesOption ? (
          <ProductStatusBadge label={salesOption.label} tone={salesOption.tone} />
        ) : null}
        {stockOption ? (
          <ProductStatusBadge label={stockOption.label} tone={stockOption.tone} />
        ) : null}
      </div>

      <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-slate-500">
        {getProductShortDescription(product)}
      </p>

      <p className="mt-auto pt-3 text-[11px] text-slate-500">
        Aktif kampanya: {formatNumber(product.campaignStats.activeCampaigns)}
      </p>
    </button>
  )
}
