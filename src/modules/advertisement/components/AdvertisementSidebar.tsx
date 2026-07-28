import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  Megaphone,
  Package,
  Target,
  Users,
} from 'lucide-react'
import { useTenant } from '../tenant/TenantProvider.tsx'
import { adPaths } from '../paths.ts'
import CompanySwitcher from './CompanySwitcher.tsx'

type NavItem = {
  label: string
  to: string
  icon: React.ReactNode
  end?: boolean
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: adPaths.dashboard,
    icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
    end: true,
  },
  {
    label: 'Ürünler',
    to: adPaths.products,
    icon: <Package className="h-4 w-4 shrink-0" />,
  },
  {
    label: 'Kampanyalar',
    to: adPaths.campaigns,
    icon: <Megaphone className="h-4 w-4 shrink-0" />,
  },
  {
    label: 'Hedef Kitle',
    to: adPaths.audience,
    icon: <Target className="h-4 w-4 shrink-0" />,
  },
  {
    label: 'Analytics',
    to: adPaths.analytics,
    icon: <BarChart3 className="h-4 w-4 shrink-0" />,
  },
  {
    label: 'Şirket Profili',
    to: adPaths.companyProfile,
    icon: <Building2 className="h-4 w-4 shrink-0" />,
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

type AdvertisementSidebarProps = {
  mobileOpen?: boolean
  onClose?: () => void
}

export default function AdvertisementSidebar({
  mobileOpen = false,
  onClose,
}: AdvertisementSidebarProps) {
  const { currentUser } = useTenant()

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-emerald-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-emerald-900 px-3 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-bold text-white">
              AG
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight text-white">
                AgriGO
              </p>
              <p className="truncate text-[10px] text-emerald-300/80">
                Reklam Platformu
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100/80 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-emerald-900 px-3 py-3">
          <CompanySwitcher />
          <div className="rounded-md bg-emerald-900/50 px-2.5 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-semibold text-white">
                {getInitials(currentUser.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-white">
                  {currentUser.name}
                </p>
                <p className="flex items-center gap-1 truncate text-[10px] text-emerald-100/70">
                  <Users className="h-3 w-3 shrink-0" />
                  {currentUser.userRoleLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
