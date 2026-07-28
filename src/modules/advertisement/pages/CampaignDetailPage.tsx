import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { adPaths } from '../paths.ts'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import ConfirmDialog from '../components/ConfirmDialog.tsx'
import EmptyState from '../components/EmptyState.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import CreativeTab from '../components/campaign-detail/CreativeTab.tsx'
import OverviewTab from '../components/campaign-detail/OverviewTab.tsx'
import PerformanceTab from '../components/campaign-detail/PerformanceTab.tsx'
import PreviewTab from '../components/campaign-detail/PreviewTab.tsx'
import TargetingTab from '../components/campaign-detail/TargetingTab.tsx'
import { getProductForCompany } from '../data/products.ts'
import { useToast } from '../hooks/useToast.tsx'
import { useCampaignStore } from '../state/CampaignStore.tsx'
import { useTenant } from '../tenant/TenantProvider.tsx'
import type {
  CampaignDetailTab,
  CampaignStatus,
} from '../types/advertisement.ts'
import {
  campaignTypeLabels,
  formatDate,
} from '../utils/formatters.ts'

const TAB_ITEMS: Array<{ id: CampaignDetailTab; label: string }> = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'creative', label: 'Kreatif' },
  { id: 'targeting', label: 'Hedefleme' },
  { id: 'performance', label: 'Performans' },
  { id: 'preview', label: 'Önizleme' },
]

function parseTab(value: string | null): CampaignDetailTab {
  const valid = TAB_ITEMS.map((t) => t.id)
  if (value && valid.includes(value as CampaignDetailTab)) {
    return value as CampaignDetailTab
  }
  return 'overview'
}

function simulateStartStatus(campaignId: string): CampaignStatus {
  const sum = campaignId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return sum % 2 === 0 ? 'pending_review' : 'active'
}

type ConfirmKind = 'start' | 'complete' | 'archive' | 'delete' | null

type LoadState = 'loading' | 'ready' | 'error'

export default function CampaignDetailPage() {
  const { campaignId = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    getCampaign,
    updateCampaignStatus,
    deleteCampaign,
    copyCampaign,
  } = useCampaignStore()
  const { showToast, toastNode } = useToast()

  const tab = parseTab(searchParams.get('tab'))
  const accessDenied = campaignId === 'access-denied'

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [actionsOpen, setActionsOpen] = useState(false)
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null)

  const campaign = getCampaign(campaignId)
  const { selectedCompanyId } = useTenant()
  const product = campaign
    ? getProductForCompany(campaign.productId, selectedCompanyId)
    : undefined

  useEffect(() => {
    setLoadState('loading')
    const timer = window.setTimeout(() => {
      setLoadState('ready')
    }, 280)
    return () => window.clearTimeout(timer)
  }, [campaignId])

  useEffect(() => {
    const raw = searchParams.get('tab')
    if (raw && parseTab(raw) === 'overview' && raw !== 'overview') {
      const next = new URLSearchParams(searchParams)
      next.set('tab', 'overview')
      setSearchParams(next, { replace: true })
    }
  }, [searchParams, setSearchParams])

  function setTab(nextTab: CampaignDetailTab) {
    const next = new URLSearchParams(searchParams)
    next.set('tab', nextTab)
    setSearchParams(next, { replace: true })
  }

  const secondaryActions = useMemo(() => {
    if (!campaign) return []
    const actions: Array<{
      id: string
      label: string
      onClick: () => void
      danger?: boolean
    }> = []

    if (campaign.status === 'draft') {
      actions.push({
        id: 'edit',
        label: 'Düzenle',
        onClick: () => navigate(adPaths.campaignEdit(campaign.id)),
      })
    }

    if (campaign.status === 'active' || campaign.status === 'paused') {
      actions.push({
        id: 'complete',
        label: 'Tamamla',
        danger: true,
        onClick: () => setConfirmKind('complete'),
      })
    }

    actions.push({
      id: 'copy',
      label: 'Kopyala',
      onClick: () => {
        const copy = copyCampaign(campaign.id)
        if (copy) {
          showToast('Kampanya kopyalandı.')
          navigate(adPaths.campaignEdit(copy.id))
        }
      },
    })

    if (campaign.status === 'draft') {
      actions.push({
        id: 'delete',
        label: 'Sil',
        danger: true,
        onClick: () => setConfirmKind('delete'),
      })
    }

    return actions
  }, [campaign, copyCampaign, navigate, showToast])

  const primaryAction = useMemo(() => {
    if (!campaign) return null
    switch (campaign.status) {
      case 'draft':
        return {
          label: 'Başlatmayı Simüle Et',
          onClick: () => setConfirmKind('start'),
        }
      case 'active':
        return {
          label: 'Duraklat',
          onClick: () => {
            updateCampaignStatus(campaign.id, 'paused')
            showToast('Kampanya duraklatıldı.')
          },
        }
      case 'paused':
        return {
          label: 'Devam Ettir',
          onClick: () => {
            updateCampaignStatus(campaign.id, 'active')
            showToast('Kampanya devam ettirildi.')
          },
        }
      case 'completed':
        return {
          label: 'Arşivle',
          onClick: () => setConfirmKind('archive'),
        }
      default:
        return null
    }
  }, [campaign, showToast, updateCampaignStatus])

  function handleConfirm() {
    if (!campaign || !confirmKind) return

    if (confirmKind === 'start') {
      const nextStatus = simulateStartStatus(campaign.id)
      updateCampaignStatus(campaign.id, nextStatus)
      showToast(
        nextStatus === 'active'
          ? 'Kampanya başlatma simülasyonu tamamlandı. Durum: Aktif.'
          : 'Kampanya başlatma simülasyonu tamamlandı. Durum: İnceleme Bekliyor.',
      )
    }

    if (confirmKind === 'complete') {
      updateCampaignStatus(campaign.id, 'completed')
      showToast('Kampanya tamamlandı.')
    }

    if (confirmKind === 'archive') {
      updateCampaignStatus(campaign.id, 'archived')
      showToast('Kampanya arşivlendi.')
    }

    if (confirmKind === 'delete') {
      deleteCampaign(campaign.id)
      showToast('Taslak kampanya silindi.')
      navigate(adPaths.campaigns)
    }

    setConfirmKind(null)
  }

  const confirmCopy = {
    start: {
      title: 'Başlatmayı Simüle Et',
      description:
        'Bu kampanya için başlatma simülasyonu çalıştırılacak. Devam etmek istiyor musunuz?',
      footnote: 'Bu işlem gerçek bir kampanya yayını başlatmaz.',
      confirmLabel: 'Simülasyonu Başlat',
      danger: false,
    },
    complete: {
      title: 'Kampanyayı Tamamla',
      description:
        'Bu kampanyayı tamamlamak istediğinize emin misiniz? Bu işlem geri alınamaz.',
      confirmLabel: 'Tamamla',
      danger: true,
    },
    archive: {
      title: 'Kampanyayı Arşivle',
      description: 'Bu kampanyayı arşivlemek istediğinize emin misiniz?',
      confirmLabel: 'Arşivle',
      danger: false,
    },
    delete: {
      title: 'Taslak Kampanyayı Sil',
      description: 'Bu taslak kampanyayı silmek istediğinize emin misiniz?',
      confirmLabel: 'Sil',
      danger: true,
    },
  } as const

  if (accessDenied) {
    return (
      <EmptyState
        title="Yetki yok"
        description="Bu içeriğe erişim yetkiniz bulunmuyor. Kampanya mevcut değil veya başka bir şirkete aittir."
        action={
          <Link
            to={adPaths.campaigns}
            className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            Kampanyalara Dön
          </Link>
        }
      />
    )
  }

  if (loadState === 'loading') {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded bg-slate-200" />
          <div className="h-8 w-24 rounded bg-slate-200" />
        </div>
        <div className="h-10 rounded bg-slate-200" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 rounded-lg bg-slate-200" />
          <div className="h-48 rounded-lg bg-slate-200" />
        </div>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <EmptyState
        title="Kampanya verileri yüklenemedi."
        description="Bağlantıyı kontrol edip tekrar deneyin."
        action={
          <button
            type="button"
            onClick={() => {
              setLoadState('loading')
              window.setTimeout(() => setLoadState('ready'), 280)
            }}
            className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            Tekrar Dene
          </button>
        }
      />
    )
  }

  if (!campaign || !product) {
    return (
      <EmptyState
        title="Kampanya bulunamadı."
        description="Aradığınız kampanya mevcut değil veya silinmiş olabilir."
        action={
          <Link
            to={adPaths.campaigns}
            className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
          >
            Kampanyalara Dön
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link to={adPaths.campaigns} className="font-medium text-emerald-700 hover:text-emerald-800">
          Kampanyalar
        </Link>
        <span aria-hidden="true">→</span>
        <span className="truncate text-slate-700">{campaign.name}</span>
      </nav>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {campaign.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
              {campaignTypeLabels[campaign.type]}
            </span>
            <StatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-slate-600">
            Ürün: {product.name}
          </p>
          <p className="text-xs text-slate-500">
            Oluşturulma: {formatDate(campaign.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {primaryAction ? (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              {primaryAction.label}
            </button>
          ) : null}

          <div className="relative hidden sm:flex sm:flex-wrap sm:gap-2">
            {secondaryActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className={`rounded-md border px-3 py-2 text-xs font-medium ${
                  action.danger
                    ? 'border-red-200 text-red-700 hover:bg-red-50'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setActionsOpen((open) => !open)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              Aksiyonlar
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {actionsOpen ? (
              <div className="absolute top-full right-0 z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-sm">
                {secondaryActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      setActionsOpen(false)
                      action.onClick()
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs ${
                      action.danger
                        ? 'text-red-700 hover:bg-red-50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-max gap-1 border-b border-slate-200">
          {TAB_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === item.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tab === 'overview' ? (
          <OverviewTab campaign={campaign} product={product} />
        ) : null}
        {tab === 'creative' ? <CreativeTab campaign={campaign} /> : null}
        {tab === 'targeting' ? <TargetingTab campaign={campaign} /> : null}
        {tab === 'performance' ? <PerformanceTab campaign={campaign} /> : null}
        {tab === 'preview' ? <PreviewTab campaign={campaign} /> : null}
      </div>

      {confirmKind ? (
        <ConfirmDialog
          open
          title={confirmCopy[confirmKind].title}
          description={confirmCopy[confirmKind].description}
          footnote={
            confirmKind === 'start' ? confirmCopy.start.footnote : undefined
          }
          confirmLabel={confirmCopy[confirmKind].confirmLabel}
          danger={confirmCopy[confirmKind].danger}
          onCancel={() => setConfirmKind(null)}
          onConfirm={handleConfirm}
        />
      ) : null}

      {toastNode}
    </div>
  )
}
