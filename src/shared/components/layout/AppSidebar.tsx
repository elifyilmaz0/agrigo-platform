import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: React.ReactNode
  active?: boolean
}

const mainNavItems: NavItem[] = [
  { label: 'Genel Bakış', icon: <LayoutDashboard className="h-4 w-4 shrink-0" /> },
  {
    label: 'Çiftçiler',
    icon: <Users className="h-4 w-4 shrink-0" />,
    active: true,
  },
  { label: 'AI İşlemleri', icon: <Sparkles className="h-4 w-4 shrink-0" /> },
  { label: 'Reklamlar', icon: <Megaphone className="h-4 w-4 shrink-0" /> },
  { label: 'Raporlar', icon: <BarChart3 className="h-4 w-4 shrink-0" /> },
]

const bottomNavItems: NavItem[] = [
  { label: 'Ayarlar', icon: <Settings className="h-4 w-4 shrink-0" /> },
  { label: 'Yardım', icon: <HelpCircle className="h-4 w-4 shrink-0" /> },
]

function NavButton({ label, icon, active = false }: NavItem) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors ${
        active
          ? 'bg-emerald-600 text-white'
          : 'text-emerald-100/80 hover:bg-emerald-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function AppSidebar() {
  return (
    <aside className="flex h-full w-[200px] shrink-0 flex-col bg-emerald-950">
      <div className="border-b border-emerald-900 px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-bold text-white">
            AG
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            AgriGO
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {mainNavItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </nav>

      <div className="border-t border-emerald-900 px-2 py-3">
        <div className="flex flex-col gap-0.5">
          {bottomNavItems.map((item) => (
            <NavButton key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-md px-2.5 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
            {getInitials('AgriGO Admin')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">AgriGO Admin</p>
            <p className="truncate text-[10px] text-emerald-200/70">Hesap</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
