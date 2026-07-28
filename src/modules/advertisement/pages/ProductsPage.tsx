import { useMemo, useState } from 'react'
import { ExternalLink, ImageIcon, Plus, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState.tsx'
import MetricCard from '../components/MetricCard.tsx'
import PageHeader from '../components/PageHeader.tsx'
import ProductPriceDisplay from '../components/ProductPriceDisplay.tsx'
import ProductStatusBadge from '../components/ProductStatusBadge.tsx'
import {
  getProductBrand,
  getProductShortDescription,
  getProductsForCompany,
  productCategories,
} from '../data/products.ts'
import {
  getProductSalesStatusLabel,
  getProductSalesStatusOption,
} from '../data/productSalesStatus.ts'
import {
  getProductStockStatusLabel,
  getProductStockStatusOption,
} from '../data/productStockStatus.ts'
import { adPaths } from '../paths.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type { Product, ProductCategory } from '../types/advertisement.ts'
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters.ts'

type UsageFilter = 'all' | 'used' | 'unused' | 'active'
type SortOption = 'name' | 'campaigns' | 'spend' | 'date'

function matchesUsage(product: Product, usage: UsageFilter): boolean {
  if (usage === 'all') return true
  if (usage === 'used') return product.campaignStats.totalCampaigns > 0
  if (usage === 'unused') return product.campaignStats.totalCampaigns === 0
  return product.campaignStats.activeCampaigns > 0
}

export default function ProductsPage() {
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'all'>('all')
  const [usage, setUsage] = useState<UsageFilter>('all')
  const [sort, setSort] = useState<SortOption>('name')

  const products = useMemo(
    () =>
      canAccessSelectedCompany
        ? getProductsForCompany(selectedCompanyId)
        : [],
    [canAccessSelectedCompany, selectedCompanyId],
  )

  const productSummary = useMemo(
    () => ({
      total: products.length,
      usedInCampaigns: products.filter((p) => p.campaignStats.totalCampaigns > 0)
        .length,
      withActiveCampaigns: products.filter(
        (p) => p.campaignStats.activeCampaigns > 0,
      ).length,
      unused: products.filter((p) => p.campaignStats.totalCampaigns === 0)
        .length,
    }),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    const result = products.filter((product) => {
      const haystack = [
        product.name,
        getProductBrand(product),
        product.category,
        getProductShortDescription(product),
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch = !normalized || haystack.includes(normalized)
      const matchesCategory = category === 'all' || product.category === category
      return matchesSearch && matchesCategory && matchesUsage(product, usage)
    })

    result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'tr')
      if (sort === 'campaigns') {
        return b.campaignStats.totalCampaigns - a.campaignStats.totalCampaigns
      }
      if (sort === 'spend') {
        return b.campaignStats.totalAdSpend - a.campaignStats.totalAdSpend
      }
      return (b.campaignStats.lastUsedAt ?? '').localeCompare(
        a.campaignStats.lastUsedAt ?? '',
      )
    })

    return result
  }, [search, category, usage, sort, products])

  function clearFilters() {
    setSearch('')
    setCategory('all')
    setUsage('all')
    setSort('name')
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'all' ||
    usage !== 'all' ||
    sort !== 'name'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ürünler"
        description="Katalog ürünlerinizi yönetin. Ürünler kampanyadan bağımsız satışa sunulabilir."
        actions={
          <Link
            to={adPaths.productNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Yeni Ürün
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Toplam Ürün"
          value={productSummary.total}
          hint="Katalogdaki tüm ürünler"
        />
        <MetricCard
          label="Kampanyada Kullanılan"
          value={productSummary.usedInCampaigns}
          accent="emerald"
          hint="En az bir kampanyaya bağlı"
        />
        <MetricCard
          label="Aktif Kampanyası Olan"
          value={productSummary.withActiveCampaigns}
          accent="sky"
          hint="Şu an yayında kampanyası var"
        />
        <MetricCard
          label="Kampanyada Kullanılmayan"
          value={productSummary.unused}
          accent="slate"
          hint="Katalogda mevcut, henüz reklamda kullanılmadı"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün adı, marka veya kategori ara..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as ProductCategory | 'all')
            }
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Kategoriler</option>
            {productCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={usage}
            onChange={(e) => setUsage(e.target.value as UsageFilter)}
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Kullanım</option>
            <option value="used">Kampanyada Kullanılan</option>
            <option value="active">Aktif Kampanyası Olan</option>
            <option value="unused">Kampanyada Kullanılmayan</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="name">Ada göre</option>
            <option value="campaigns">Kampanya sayısına göre</option>
            <option value="spend">Reklam harcamasına göre</option>
            <option value="date">Son kampanya tarihine göre</option>
          </select>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
              Filtreleri temizle
            </button>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {filteredProducts.length} ürün görüntüleniyor
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Ürün bulunamadı"
          description="Arama veya filtre kriterlerinize uygun ürün yok."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Filtreleri temizle
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCatalogCard({ product }: { product: Product }) {
  const salesOption = getProductSalesStatusOption(product.salesStatus)
  const stockOption = getProductStockStatusOption(product.stockStatus)
  const neverUsedInCampaign = product.campaignStats.totalCampaigns === 0

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-300">
      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`${product.name} görseli`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-400">
            <ImageIcon className="h-6 w-6" aria-hidden />
            <span className="text-[10px] font-medium tracking-wide uppercase">
              Ürün görseli
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {getProductBrand(product)} · {product.category}
          </p>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {getProductShortDescription(product)}
          </p>
        </div>

        <div className="mt-3 space-y-2">
          <ProductPriceDisplay product={product} />
          <div className="flex flex-wrap gap-1.5">
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
        </div>

        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/70 p-3">
          <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
            Reklam Geçmişi
          </p>
          {neverUsedInCampaign ? (
            <p className="mt-2 text-xs text-slate-600">
              Toplam Kampanya: 0 · Henüz kampanyada kullanılmadı
            </p>
          ) : (
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Toplam Kampanya</dt>
                <dd className="font-medium text-slate-800">
                  {formatNumber(product.campaignStats.totalCampaigns)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Aktif Kampanya</dt>
                <dd className="font-medium text-slate-800">
                  {formatNumber(product.campaignStats.activeCampaigns)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Toplam Reklam Harcaması</dt>
                <dd className="font-medium text-slate-800">
                  {formatCurrency(product.campaignStats.totalAdSpend)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Son Kampanya Kullanımı</dt>
                <dd className="font-medium text-slate-800">
                  {formatDate(product.campaignStats.lastUsedAt)}
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-3 mt-4">
          <Link
            to={`${adPaths.campaignNew}?productId=${product.id}`}
            className="rounded-md bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
            aria-label={`${product.name} ile kampanya oluştur`}
          >
            Bu Ürünle Kampanya Oluştur
          </Link>
          <Link
            to={adPaths.product(product.id)}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            aria-label={`${product.name} ürününü görüntüle`}
          >
            Ürünü Görüntüle
          </Link>
          <Link
            to={adPaths.productEdit(product.id)}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            aria-label={`${product.name} ürününü düzenle`}
          >
            Düzenle
          </Link>
          {product.salesUrl ? (
            <a
              href={product.salesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              aria-label={`${product.name} satış sayfasını aç`}
            >
              Satış Sayfasını Aç
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : null}
        </div>

        <p className="sr-only">
          Satış durumu: {getProductSalesStatusLabel(product.salesStatus)}. Stok
          durumu: {getProductStockStatusLabel(product.stockStatus)}.
        </p>
      </div>
    </article>
  )
}
