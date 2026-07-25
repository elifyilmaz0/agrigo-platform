import type { LucideIcon } from 'lucide-react'
import {
  ClipboardList,
  Cpu,
  FileText,
  Flower2,
  Landmark,
  MessageSquare,
  PawPrint,
  ShieldCheck,
  Sprout,
  Tag,
  UserRound,
  Wallet,
} from 'lucide-react'
import type { Farmer, ProductionType } from '../../types/farmer.ts'
import BeekeepingTab from './tabs/BeekeepingTab.tsx'
import ConsentTab from './tabs/ConsentTab.tsx'
import ConversationsTab from './tabs/ConversationsTab.tsx'
import DocumentsTab from './tabs/DocumentsTab.tsx'
import FinanceTab from './tabs/FinanceTab.tsx'
import InsuranceTab from './tabs/InsuranceTab.tsx'
import LandTab from './tabs/LandTab.tsx'
import LivestockTab from './tabs/LivestockTab.tsx'
import ProductionTab from './tabs/ProductionTab.tsx'
import ProfileTab from './tabs/ProfileTab.tsx'
import TechnologyEquipmentTab from './tabs/TechnologyEquipmentTab.tsx'

export type FarmerTab =
  | 'general'
  | 'conversations'
  | 'production'
  | 'finance'
  | 'land'
  | 'livestock'
  | 'beekeeping'
  | 'technology'
  | 'insurance'
  | 'consent'
  | 'documents'

type FarmerTabsProps = {
  farmer: Farmer
  activeTab: FarmerTab
  onTabChange: (tab: FarmerTab) => void
  highlightConversationId?: string | null
  openDocumentId?: string | null
  onOpenDocumentHandled?: () => void
}

type TabConfig = {
  id: FarmerTab
  label: string
  icon: LucideIcon
}

const tabs: TabConfig[] = [
  { id: 'general', label: 'Genel', icon: UserRound },
  { id: 'conversations', label: 'Konuşmalar', icon: MessageSquare },
  { id: 'production', label: 'Üretim', icon: Sprout },
  { id: 'finance', label: 'Finans', icon: Wallet },
  { id: 'land', label: 'Arazi', icon: Landmark },
  { id: 'livestock', label: 'Hayvancılık', icon: PawPrint },
  { id: 'beekeeping', label: 'Arıcılık', icon: Flower2 },
  { id: 'technology', label: 'Teknoloji ve Ekipman', icon: Cpu },
  { id: 'insurance', label: 'Sigorta', icon: ShieldCheck },
  { id: 'consent', label: 'İzinler', icon: ClipboardList },
  { id: 'documents', label: 'Belgeler', icon: FileText },
]

function isLivestockTabEnabled(productionType: ProductionType): boolean {
  return productionType === 'Hayvansal' || productionType === 'Karma'
}

function isBeekeepingTabEnabled(productionType: ProductionType): boolean {
  return productionType === 'Arıcılık' || productionType === 'Karma'
}

function isTabDisabled(tab: TabConfig, productionType: ProductionType): boolean {
  if (tab.id === 'livestock') {
    return !isLivestockTabEnabled(productionType)
  }

  if (tab.id === 'beekeeping') {
    return !isBeekeepingTabEnabled(productionType)
  }

  return false
}

function renderActiveTab(
  activeTab: FarmerTab,
  farmer: Farmer,
  options: {
    highlightConversationId?: string | null
    openDocumentId?: string | null
    onOpenDocumentHandled?: () => void
  },
) {
  switch (activeTab) {
    case 'general':
      return <ProfileTab farmer={farmer} />
    case 'conversations':
      return (
        <ConversationsTab
          farmer={farmer}
          highlightConversationId={options.highlightConversationId}
        />
      )
    case 'production':
      return <ProductionTab farmer={farmer} />
    case 'finance':
      return <FinanceTab farmer={farmer} />
    case 'land':
      return <LandTab farmer={farmer} />
    case 'livestock':
      return <LivestockTab farmer={farmer} />
    case 'beekeeping':
      return <BeekeepingTab farmer={farmer} />
    case 'technology':
      return <TechnologyEquipmentTab farmer={farmer} />
    case 'insurance':
      return <InsuranceTab farmer={farmer} />
    case 'consent':
      return <ConsentTab farmer={farmer} />
    case 'documents':
      return (
        <DocumentsTab
          farmer={farmer}
          openDocumentId={options.openDocumentId}
          onOpenDocumentHandled={options.onOpenDocumentHandled}
        />
      )
  }
}

export default function FarmerTabs({
  farmer,
  activeTab,
  onTabChange,
  highlightConversationId = null,
  openDocumentId = null,
  onOpenDocumentHandled,
}: FarmerTabsProps) {
  return (
    <section
      id="farmer-detail-tabs"
      className="mt-4 min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3 sm:px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
          <Tag className="h-4 w-4 text-emerald-800" aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold text-gray-900">Profil Detayları</h2>
      </div>

      <div
        role="tablist"
        aria-label="Çiftçi detay sekmeleri"
        className="flex gap-0.5 overflow-x-auto overscroll-x-contain border-b border-gray-200 px-2 sm:flex-wrap sm:overflow-visible sm:px-3"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isDisabled = isTabDisabled(tab, farmer.productionType)
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`farmer-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`farmer-tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onTabChange(tab.id)
                }
              }}
              className={`f360-focus relative inline-flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-3 ${
                isActive
                  ? 'text-emerald-800'
                  : 'text-gray-500 hover:text-emerald-700/80 disabled:hover:text-gray-500'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-800" />
              )}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`farmer-tabpanel-${activeTab}`}
        aria-labelledby={`farmer-tab-${activeTab}`}
        className="min-h-[120px] min-w-0 overflow-x-hidden bg-gray-50/40 p-4"
      >
        {renderActiveTab(activeTab, farmer, {
          highlightConversationId,
          openDocumentId,
          onOpenDocumentHandled,
        })}
      </div>
    </section>
  )
}
