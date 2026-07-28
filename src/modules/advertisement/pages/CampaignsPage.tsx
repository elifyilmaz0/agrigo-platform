import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { adPaths } from '../paths.ts'
import { MoreHorizontal, Plus, Search } from 'lucide-react'
import EmptyState from '../components/EmptyState.tsx'
import MetricCard from '../components/MetricCard.tsx'
import PageHeader from '../components/PageHeader.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { useCampaignStore } from '../state/CampaignStore.tsx'
import { getProductName, getProductsForCompany } from '../data/products.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'
import {
  campaignTypeLabels,
  formatCurrency,
  formatDate,
  parseStatusQueryParam,
} from '../utils/formatters.ts'
import type { CampaignStatus, CampaignType } from '../types/advertisement.ts'

type DateFilter = 'all' | '7d' | '30d' | '90d'

function matchesDateFilter(createdAt: string, filter: DateFilter): boolean {
  if (filter === 'all') return true
  const created = new Date(createdAt).getTime()
  const now = new Date('2026-07-27').getTime()
  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90
  return now - created <= days * 24 * 60 * 60 * 1000
}

export default function CampaignsPage() {
  const navigate = useNavigate()
  const { campaigns, statusSummary } = useCampaignStore()
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const products = useMemo(
    () =>
      canAccessSelectedCompany
        ? getProductsForCompany(selectedCompanyId)
        : [],
    [canAccessSelectedCompany, selectedCompanyId],
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = parseStatusQueryParam(searchParams.get('status'))

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CampaignStatus | 'all'>(
    initialStatus ?? 'all',
  )
  const [type, setType] = useState<CampaignType | 'all'>('all')
  const [productId, setProductId] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fromQuery = parseStatusQueryParam(searchParams.get('status'))
    setStatus(fromQuery ?? 'all')
  }, [searchParams])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleStatusChange(next: CampaignStatus | 'all') {
    setStatus(next)
    const nextParams = new URLSearchParams(searchParams)
    if (next === 'all') {
      nextParams.delete('status')
    } else {
      nextParams.set('status', next)
    }
    setSearchParams(nextParams, { replace: true })
  }

  const filteredCampaigns = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !normalized || campaign.name.toLowerCase().includes(normalized)
      const matchesStatus = status === 'all' || campaign.status === status
      const matchesType = type === 'all' || campaign.type === type
      const matchesProduct =
        productId === 'all' || campaign.productId === productId
      const matchesDate = matchesDateFilter(campaign.createdAt, dateFilter)
      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesProduct &&
        matchesDate
      )
    })
  }, [search, status, type, productId, dateFilter, campaigns])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kampanyalar"
        description="Tüm reklam kampanyalarınızı durum, tür ve ürün bazında yönetin."
        actions={
          <Link
            to={adPaths.campaignNew}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Yeni Kampanya
          </Link>
        }
      />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Toplam"
          value={statusSummary.total}
          hint="Tüm kampanyalar"
          onClick={() => handleStatusChange('all')}
        />
        <MetricCard
          label="Aktif"
          value={statusSummary.active}
          accent="emerald"
          hint="Yayında olanlar"
          onClick={() => handleStatusChange('active')}
        />
        <MetricCard
          label="Taslak"
          value={statusSummary.draft}
          accent="slate"
          hint="Düzenlenebilir"
          onClick={() => handleStatusChange('draft')}
        />
        <MetricCard
          label="İnceleme Bekliyor"
          value={statusSummary.pendingReview}
          accent="amber"
          hint="AgriGO kontrolünde"
          onClick={() => handleStatusChange('pending_review')}
        />
        <MetricCard
          label="Planlandı"
          value={statusSummary.scheduled}
          accent="sky"
          hint="Başlangıç bekliyor"
          onClick={() => handleStatusChange('scheduled')}
        />
        <MetricCard
          label="Duraklatıldı"
          value={statusSummary.paused}
          accent="orange"
          hint="Geçici olarak durdu"
          onClick={() => handleStatusChange('paused')}
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
              placeholder="Kampanya adı ara..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              handleStatusChange(e.target.value as CampaignStatus | 'all')
            }
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="draft">Taslak</option>
            <option value="pending_review">İnceleme Bekliyor</option>
            <option value="scheduled">Planlandı</option>
            <option value="paused">Duraklatıldı</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as CampaignType | 'all')}
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Türler</option>
            <option value="native_recommendation">Doğal AI Önerisi</option>
            <option value="bulk_message">Toplu Mesaj</option>
          </select>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Ürünler</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            className="h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="all">Tüm Tarihler</option>
            <option value="7d">Son 7 gün</option>
            <option value="30d">Son 30 gün</option>
            <option value="90d">Son 90 gün</option>
          </select>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {filteredCampaigns.length} kampanya görüntüleniyor
        </p>
      </div>

      {filteredCampaigns.length === 0 ? (
        <EmptyState
          title="Kampanya bulunamadı"
          description="Seçili filtrelere uygun kampanya yok."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Kampanya Adı</th>
                  <th className="px-4 py-3 font-medium">Ürün</th>
                  <th className="px-4 py-3 font-medium">Tür</th>
                  <th className="px-4 py-3 font-medium">Durum</th>
                  <th className="px-4 py-3 font-medium">Bütçe</th>
                  <th className="px-4 py-3 font-medium">Oluşturulma Tarihi</th>
                  <th className="px-4 py-3 font-medium">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="cursor-pointer hover:bg-slate-50/70"
                    onClick={() => navigate(adPaths.campaign(campaign.id))}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {campaign.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {getProductName(campaign.productId)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {campaignTypeLabels[campaign.type]}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(campaign.createdAt)}
                    </td>
                    <td
                      className="relative px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        ref={openMenuId === campaign.id ? menuRef : undefined}
                        className="relative"
                      >
                        <button
                          type="button"
                          aria-label="Aksiyon menüsü"
                          onClick={() =>
                            setOpenMenuId((id) =>
                              id === campaign.id ? null : campaign.id,
                            )
                          }
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openMenuId === campaign.id ? (
                          <div className="absolute top-full right-0 z-20 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-sm">
                            <Link
                              to={adPaths.campaign(campaign.id)}
                              className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Detayı Gör
                            </Link>
                            <Link
                              to={adPaths.campaignEdit(campaign.id)}
                              className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Düzenle
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
