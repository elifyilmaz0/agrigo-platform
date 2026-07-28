import { ArrowLeft, ExternalLink, ImageIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.tsx'
import PlaceholderPage from '../components/PlaceholderPage.tsx'
import ProductPriceDisplay from '../components/ProductPriceDisplay.tsx'
import ProductStatusBadge from '../components/ProductStatusBadge.tsx'
import {
  getProductBrand,
  getProductForCompany,
  getProductShortDescription,
} from '../data/products.ts'
import { getProductSalesStatusOption } from '../data/productSalesStatus.ts'
import { getProductStockStatusOption } from '../data/productStockStatus.ts'
import { adPaths } from '../paths.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters.ts'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const product =
    productId && canAccessSelectedCompany
      ? getProductForCompany(productId, selectedCompanyId)
      : undefined

  if (!product) {
    return (
      <PlaceholderPage
        title="Ürün bulunamadı"
        description="Bu içeriğe erişim yetkiniz bulunmuyor. Ürün mevcut değil veya başka bir şirkete aittir."
      />
    )
  }

  const salesOption = getProductSalesStatusOption(product.salesStatus)
  const stockOption = getProductStockStatusOption(product.stockStatus)

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate(adPaths.products)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Ürünlere Dön
      </button>

      <PageHeader
        title={product.name}
        description={`${getProductBrand(product)} · ${product.category}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              to={adPaths.productEdit(product.id)}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Düzenle
            </Link>
            <Link
              to={`${adPaths.campaignNew}?productId=${product.id}`}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Bu Ürünle Kampanya Oluştur
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 lg:h-auto lg:min-h-[220px]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={`${product.name} görseli`}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="h-6 w-6" aria-hidden />
              <span className="text-[10px] uppercase">Ürün görseli</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Genel Bilgiler</h2>
            <dl className="mt-3 space-y-2 text-xs">
              <DetailRow label="Ürün adı" value={product.name} />
              <DetailRow label="Marka" value={getProductBrand(product)} />
              <DetailRow label="Kategori" value={product.category} />
              <DetailRow
                label="Kısa açıklama"
                value={getProductShortDescription(product)}
              />
              <DetailRow
                label="Detaylı açıklama"
                value={product.description || '—'}
              />
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">Satış Bilgileri</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ProductPriceDisplay product={product} />
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
            <dl className="mt-3 space-y-2 text-xs">
              <DetailRow
                label="Satın alma bağlantısı"
                value={
                  product.salesUrl ? (
                    <a
                      href={product.salesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                    >
                      Satış sayfasını aç
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailRow
                label="Satıcı iletişim"
                value={product.sellerContact || '—'}
              />
            </dl>
          </section>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Ürün Uygunluğu</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
          <DetailRow label="Üretim tipi" value={product.productionType || '—'} />
          <DetailRow
            label="Hayvancılık alanı"
            value={product.livestockArea || '—'}
          />
          <DetailRow
            label="İlgili ürünler"
            value={product.relevantProducts || '—'}
          />
          <DetailRow
            label="Hedef çiftçi profili"
            value={product.targetFarmerProfile || '—'}
          />
          <DetailRow
            label="Kullanım amacı"
            value={product.usagePurpose || '—'}
          />
          <DetailRow
            label="Önerilen sezon"
            value={product.recommendedSeason || '—'}
          />
          <DetailRow label="Notlar" value={product.usageNotes || '—'} />
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">Reklam Geçmişi</h2>
        <p className="mt-1 text-xs text-slate-500">
          Bu bölüm ürünün satış bilgilerinden ayrıdır. Kampanya bağlantısı
          opsiyoneldir.
        </p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
          <DetailRow
            label="Toplam Kampanya"
            value={formatNumber(product.campaignStats.totalCampaigns)}
          />
          <DetailRow
            label="Aktif Kampanya"
            value={formatNumber(product.campaignStats.activeCampaigns)}
          />
          <DetailRow
            label="Toplam Reklam Harcaması"
            value={formatCurrency(product.campaignStats.totalAdSpend)}
          />
          <DetailRow
            label="Son Kampanya Kullanımı"
            value={formatDate(product.campaignStats.lastUsedAt)}
          />
        </dl>
        {product.campaignStats.totalCampaigns === 0 ? (
          <p className="mt-3 text-xs text-slate-600">
            Bu ürün henüz bir reklam kampanyasına bağlanmadı. Katalogda satış
            durumu ayrıca yönetilir.
          </p>
        ) : null}
      </section>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="whitespace-pre-line font-medium text-slate-800 sm:text-right">
        {value}
      </dd>
    </div>
  )
}
