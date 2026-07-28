import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  advertiserAccountStatusLabels,
} from '../data/advertiserProfile.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'

/**
 * Company switcher — Admin only.
 * Advertisers see a static company label (no dropdown).
 */
export default function CompanySwitcher() {
  const {
    accessibleCompanies,
    canSwitchCompany,
    selectedCompany,
    selectedCompanyId,
    setSelectedCompanyId,
    isAdmin,
  } = useTenant()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!selectedCompany) return null

  if (!canSwitchCompany || !isAdmin) {
    return (
      <div className="rounded-md bg-emerald-900/50 px-2.5 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
          Şirket
        </p>
        <p className="mt-0.5 truncate text-xs font-semibold text-white">
          {selectedCompany.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-emerald-300/80">
          {selectedCompany.sector}
        </p>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 rounded-md bg-emerald-900/50 px-2.5 py-2.5 text-left hover:bg-emerald-900"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-400">
            Şirket
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white">
            {selectedCompany.name}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-emerald-300/80">
            {selectedCompany.advertiserId}
          </p>
        </div>
        <ChevronsUpDown
          className="h-3.5 w-3.5 shrink-0 text-emerald-300"
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Tüm reklamveren şirketleri"
          className="absolute bottom-full left-0 z-20 mb-1 max-h-72 w-full overflow-y-auto rounded-md border border-emerald-800 bg-emerald-950 py-1 shadow-lg"
        >
          {accessibleCompanies.map((company) => {
            const selected = company.id === selectedCompanyId
            return (
              <li key={company.id} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full items-start justify-between gap-2 px-2.5 py-2 text-left ${
                    selected
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                  onClick={() => {
                    setSelectedCompanyId(company.id)
                    setOpen(false)
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">
                      {company.name}
                    </span>
                    <span
                      className={`mt-0.5 block truncate text-[10px] ${
                        selected ? 'text-emerald-100' : 'text-emerald-400/90'
                      }`}
                    >
                      {company.sector} · {company.advertiserId}
                    </span>
                    <span
                      className={`mt-0.5 block text-[10px] ${
                        selected ? 'text-emerald-50' : 'text-emerald-500'
                      }`}
                    >
                      {advertiserAccountStatusLabels[company.status]}
                    </span>
                  </span>
                  {selected ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
