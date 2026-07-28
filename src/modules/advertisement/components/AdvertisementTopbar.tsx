import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Menu, Search, User } from 'lucide-react'
import { usePageTitle } from '../hooks/usePageTitle.ts'
import { getAdvertiserCompanyLabel } from '../data/tenant.ts'
import { useTenant } from '../tenant/TenantProvider.tsx'

type AdvertisementTopbarProps = {
  onMenuClick: () => void
  onSearchClick: () => void
}

export default function AdvertisementTopbar({
  onMenuClick,
  onSearchClick,
}: AdvertisementTopbarProps) {
  const pageTitle = usePageTitle()
  const {
    currentUser,
    selectedCompany,
    mockUsers,
    setMockUserId,
    isAdmin,
  } = useTenant()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Menüyü aç"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-slate-900">
          {pageTitle}
        </h2>
        {selectedCompany ? (
          <p className="truncate text-[10px] text-slate-500">
            {selectedCompany.shortName}
          </p>
        ) : null}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onSearchClick}
          className="hidden h-8 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500 transition-colors hover:border-slate-300 hover:bg-white sm:inline-flex md:w-56"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="flex-1 text-left">Ara...</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onSearchClick}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 sm:hidden"
          aria-label="Ara"
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setUserMenuOpen(false)
            }}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
            aria-label="Bildirimler"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </button>

          {notificationsOpen ? (
            <div className="absolute top-full right-0 z-30 mt-1.5 w-72 rounded-lg border border-slate-200 bg-white py-2 shadow-sm">
              <p className="px-3 pb-2 text-xs font-semibold text-slate-800">
                Bildirimler
              </p>
              <div className="border-t border-slate-100">
                <div className="px-3 py-2.5 hover:bg-slate-50">
                  <p className="text-xs font-medium text-slate-800">
                    Seçili şirket hesabınıza ait uyarılar
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Diğer şirketlere ait bildirimler gösterilmez.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((open) => !open)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentUser.userRoleLabel}
                {isAdmin ? ' · Admin' : ''}
              </p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
          </button>

          {userMenuOpen ? (
            <div className="absolute top-full right-0 z-30 mt-1.5 w-64 rounded-lg border border-slate-200 bg-white py-1 shadow-sm">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-800">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentUser.userRoleLabel}
                </p>
              </div>
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Mock oturum (test)
                </p>
                <div className="space-y-1">
                  {mockUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className={`w-full rounded-md px-2 py-1.5 text-left text-[11px] ${
                        user.id === currentUser.id
                          ? 'bg-emerald-50 font-semibold text-emerald-800'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      onClick={() => {
                        setMockUserId(user.id)
                        setUserMenuOpen(false)
                      }}
                    >
                      {user.name}
                      <span className="mt-0.5 block font-normal text-slate-400">
                        {getAdvertiserCompanyLabel(user)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                onClick={() => setUserMenuOpen(false)}
              >
                Hesap ayarları
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
