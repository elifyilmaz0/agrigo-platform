import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adPaths } from '../paths.ts'
import { Search } from 'lucide-react'
import { getProductsForCompany } from '../data/products.ts'
import { useCampaignStore } from '../state/CampaignStore.tsx'
import { useTenant } from '../tenant/TenantProvider.tsx'

type GlobalSearchProps = {
  open: boolean
  onClose: () => void
}

type SearchItem = {
  id: string
  label: string
  meta: string
  to: string
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate()
  const { campaigns } = useCampaignStore()
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const tenantProducts = useMemo(
    () =>
      canAccessSelectedCompany
        ? getProductsForCompany(selectedCompanyId)
        : [],
    [canAccessSelectedCompany, selectedCompanyId],
  )

  useEffect(() => {
    if (!open) return
    setQuery('')
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const normalized = query.trim().toLowerCase()

  const productResults = useMemo(() => {
    const items: SearchItem[] = tenantProducts.map((product) => ({
      id: product.id,
      label: product.name,
      meta: product.category,
      to: adPaths.product(product.id),
    }))
    if (!normalized) return items.slice(0, 4)
    return items
      .filter(
        (item) =>
          item.label.toLowerCase().includes(normalized) ||
          item.meta.toLowerCase().includes(normalized),
      )
      .slice(0, 6)
  }, [normalized, tenantProducts])

  const campaignResults = useMemo(() => {
    const items: SearchItem[] = campaigns.map((campaign) => ({
      id: campaign.id,
      label: campaign.name,
      meta: campaign.status,
      to: adPaths.campaign(campaign.id),
    }))
    if (!normalized) return items.slice(0, 4)
    return items
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .slice(0, 6)
  }, [campaigns, normalized])

  const segmentResults = useMemo(() => {
    // Segments are derived from the selected company's campaigns only.
    const seen = new Set<string>()
    const items: SearchItem[] = []
    for (const campaign of campaigns) {
      for (const segment of campaign.segments) {
        if (seen.has(segment.id)) continue
        seen.add(segment.id)
        items.push({
          id: segment.id,
          label: segment.name,
          meta: segment.owner === 'brand' ? 'Marka segmenti' : 'AgriGO segmenti',
          to: adPaths.audience,
        })
      }
    }
    if (!normalized) return items.slice(0, 4)
    return items
      .filter((item) => item.label.toLowerCase().includes(normalized))
      .slice(0, 6)
  }, [campaigns, normalized])

  function goTo(to: string) {
    onClose()
    navigate(to)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/40 p-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Aramayı kapat"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global arama"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, kampanya veya segment ara..."
            className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <ResultGroup
            title="Ürünler"
            items={productResults}
            onSelect={goTo}
            empty="Ürün bulunamadı"
          />
          <ResultGroup
            title="Kampanyalar"
            items={campaignResults}
            onSelect={goTo}
            empty="Kampanya bulunamadı"
          />
          <ResultGroup
            title="Segmentler"
            items={segmentResults}
            onSelect={goTo}
            empty="Segment bulunamadı"
          />
        </div>

        <div className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-400">
          Şimdilik mock arama · Ctrl + K ile açılır
        </div>
      </div>
    </div>
  )
}

function ResultGroup({
  title,
  items,
  onSelect,
  empty,
}: {
  title: string
  items: SearchItem[]
  onSelect: (to: string) => void
  empty: string
}) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        {title}
      </p>
      {items.length === 0 ? (
        <p className="px-2 py-2 text-xs text-slate-400">{empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.to)}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left hover:bg-slate-50"
              >
                <span className="truncate text-sm font-medium text-slate-800">
                  {item.label}
                </span>
                <span className="shrink-0 text-[11px] text-slate-400">
                  {item.meta}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
