import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTenant } from '../tenant/TenantProvider.tsx'
import AdvertisementSidebar from './AdvertisementSidebar.tsx'
import AdvertisementTopbar from './AdvertisementTopbar.tsx'
import GlobalSearch from './GlobalSearch.tsx'
import UnauthorizedCompanyAccess from './UnauthorizedCompanyAccess.tsx'

export default function AdvertisementLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { selectedCompanyId, canAccessSelectedCompany } = useTenant()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex h-full bg-slate-50">
      <AdvertisementSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdvertisementTopbar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 lg:px-6 lg:py-6">
            {!canAccessSelectedCompany || !selectedCompanyId ? (
              <UnauthorizedCompanyAccess />
            ) : (
              /*
               * Remount page tree on company switch so previous tenant UI
               * state cannot flash or leak into the next company view.
               */
              <Outlet key={selectedCompanyId} />
            )}
          </div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
