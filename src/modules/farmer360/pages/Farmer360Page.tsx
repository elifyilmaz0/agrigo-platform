import { useCallback, useEffect, useMemo, useState } from 'react'
import AISummary from '../components/farmer-detail/AISummary.tsx'
import FarmerInsightsRow from '../components/farmer-detail/FarmerInsightsRow.tsx'
import MissingProfileSection from '../components/farmer-detail/MissingProfileSection.tsx'
import FarmerMemoryTimelineSection from '../components/farmer-detail/memory-timeline/FarmerMemoryTimelineSection.tsx'
import FarmerProfileHeader from '../components/farmer-detail/FarmerProfileHeader.tsx'
import FarmerTabs, { type FarmerTab } from '../components/farmer-detail/FarmerTabs.tsx'
import NotificationsDrawer from '../components/farmer-detail/drawers/NotificationsDrawer.tsx'
import OperationsCenterDrawer, {
  type OperationsFilter,
} from '../components/farmer-detail/drawers/OperationsCenterDrawer.tsx'
import FarmerPanel from '../components/farmer-list/FarmerPanel.tsx'
import { FarmerToastProvider } from '../components/shared/FarmerToast.tsx'
import { farmers as allFarmers } from '../data/farmers.ts'
import type {
  FarmerNotification,
  ProductionType,
  ProductionTypeFilterValue,
} from '../types/farmer.ts'
import { getFarmerNotifications } from '../utils/getFarmerNotifications.ts'
import { getFarmerOperations } from '../utils/getFarmerOperations.ts'

type ActiveDrawer = 'notifications' | 'operations' | null

function filterFarmers(
  searchTerm: string,
  productionTypeFilter: ProductionTypeFilterValue,
) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return allFarmers.filter((farmer) => {
    const matchesProductionType =
      productionTypeFilter === 'Tümü' ||
      farmer.productionType === productionTypeFilter

    if (!normalizedSearch) {
      return matchesProductionType
    }

    const searchableValues = [
      farmer.fullName,
      farmer.farmerCode,
      farmer.phone,
      farmer.province,
      farmer.district,
      farmer.village,
    ]

    const matchesSearch = searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    )

    return matchesProductionType && matchesSearch
  })
}

function isTabAvailableForProductionType(
  tab: FarmerTab,
  productionType: ProductionType,
): boolean {
  if (tab === 'livestock') {
    return productionType === 'Hayvansal' || productionType === 'Karma'
  }

  if (tab === 'beekeeping') {
    return productionType === 'Arıcılık' || productionType === 'Karma'
  }

  return true
}

function scrollToId(elementId: string) {
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      document.getElementById(elementId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }, 120)
  })
}

function Farmer360PageContent() {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [productionTypeFilter, setProductionTypeFilter] =
    useState<ProductionTypeFilterValue>('Tümü')
  const [activeTab, setActiveTab] = useState<FarmerTab>('general')
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null)
  const [operationsFilter, setOperationsFilter] = useState<OperationsFilter>('all')
  const [highlightConversationId, setHighlightConversationId] = useState<string | null>(
    null,
  )
  const [highlightMemoryId, setHighlightMemoryId] = useState<string | null>(null)
  const [openDocumentId, setOpenDocumentId] = useState<string | null>(null)

  const filteredFarmers = useMemo(
    () => filterFarmers(searchTerm, productionTypeFilter),
    [searchTerm, productionTypeFilter],
  )

  const selectedFarmer = useMemo(
    () => allFarmers.find((farmer) => farmer.id === selectedFarmerId) ?? null,
    [selectedFarmerId],
  )

  const notificationCount = useMemo(
    () => (selectedFarmer ? getFarmerNotifications(selectedFarmer).length : 0),
    [selectedFarmer],
  )
  const operationCount = useMemo(
    () => (selectedFarmer ? getFarmerOperations(selectedFarmer).length : 0),
    [selectedFarmer],
  )

  useEffect(() => {
    setActiveTab('general')
    setActiveDrawer(null)
    setHighlightConversationId(null)
    setHighlightMemoryId(null)
    setOpenDocumentId(null)
  }, [selectedFarmerId])

  useEffect(() => {
    if (!selectedFarmer) {
      return
    }

    if (!isTabAvailableForProductionType(activeTab, selectedFarmer.productionType)) {
      setActiveTab('general')
    }
  }, [selectedFarmer, activeTab])

  useEffect(() => {
    if (!highlightConversationId) {
      return
    }

    scrollToId(`conversation-item-${highlightConversationId}`)
    const timer = window.setTimeout(() => setHighlightConversationId(null), 2200)
    return () => window.clearTimeout(timer)
  }, [highlightConversationId, activeTab])

  useEffect(() => {
    if (!highlightMemoryId) {
      return
    }

    scrollToId(`ai-memory-item-${highlightMemoryId}`)
    const timer = window.setTimeout(() => setHighlightMemoryId(null), 2200)
    return () => window.clearTimeout(timer)
  }, [highlightMemoryId])

  const openNotifications = useCallback(() => {
    setActiveDrawer('notifications')
  }, [])

  const openOperations = useCallback((filter: OperationsFilter = 'all') => {
    setOperationsFilter(filter)
    setActiveDrawer('operations')
  }, [])

  const openOperationsAll = useCallback(() => {
    openOperations('all')
  }, [openOperations])

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null)
  }, [])

  const handleOpenConversation = useCallback((conversationId?: string) => {
    setActiveDrawer(null)
    setActiveTab('conversations')
    setHighlightConversationId(conversationId ?? null)
    scrollToId('farmer-detail-tabs')
  }, [])

  const handleOpenDocument = useCallback((documentId?: string) => {
    setActiveDrawer(null)
    setActiveTab('documents')
    setOpenDocumentId(documentId ?? 'auto')
    scrollToId('farmer-detail-tabs')
  }, [])

  const handleOpenMemory = useCallback((memoryId?: string) => {
    setActiveDrawer(null)
    if (memoryId) {
      setHighlightMemoryId(memoryId)
      scrollToId(`ai-memory-item-${memoryId}`)
    } else {
      scrollToId('farmer-ai-memory')
    }
  }, [])

  const timelineNavigation = useMemo(
    () => ({
      onOpenConversation: handleOpenConversation,
      onOpenDocument: handleOpenDocument,
      onOpenMemory: handleOpenMemory,
    }),
    [handleOpenConversation, handleOpenDocument, handleOpenMemory],
  )

  const handleNotificationSelect = useCallback(
    (notification: FarmerNotification) => {
      if (notification.action === 'insurance') {
        setActiveDrawer(null)
        setActiveTab('insurance')
        scrollToId('farmer-detail-tabs')
        return
      }

      if (notification.action === 'operations_ai') {
        openOperations('ai_review')
        return
      }

      handleOpenDocument()
    },
    [handleOpenDocument, openOperations],
  )

  const handleOpenDocumentHandled = useCallback(() => {
    setOpenDocumentId(null)
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100 lg:flex-row">
      <FarmerPanel
        totalCount={allFarmers.length}
        farmers={filteredFarmers}
        selectedFarmerId={selectedFarmerId}
        searchTerm={searchTerm}
        productionTypeFilter={productionTypeFilter}
        onSearchChange={setSearchTerm}
        onProductionTypeFilterChange={setProductionTypeFilter}
        onSelectFarmer={setSelectedFarmerId}
      />

      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain scroll-smooth bg-gray-100 p-4 sm:p-6 xl:px-8">
        {selectedFarmer ? (
          <>
            <FarmerProfileHeader
              farmer={selectedFarmer}
              notificationCount={notificationCount}
              operationCount={operationCount}
              onOpenNotifications={openNotifications}
              onOpenOperations={openOperationsAll}
            />
            <AISummary farmer={selectedFarmer} />
            <FarmerInsightsRow farmer={selectedFarmer} />
            <MissingProfileSection key={selectedFarmer.id} farmer={selectedFarmer} />
            <FarmerTabs
              farmer={selectedFarmer}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              highlightConversationId={highlightConversationId}
              openDocumentId={openDocumentId === 'auto' ? 'auto' : openDocumentId}
              onOpenDocumentHandled={handleOpenDocumentHandled}
            />
            <FarmerMemoryTimelineSection
              key={selectedFarmer.id}
              farmer={selectedFarmer}
              highlightMemoryId={highlightMemoryId}
              navigation={timelineNavigation}
            />

            <NotificationsDrawer
              open={activeDrawer === 'notifications'}
              farmer={selectedFarmer}
              onClose={closeDrawer}
              onSelectNotification={handleNotificationSelect}
            />
            <OperationsCenterDrawer
              key={selectedFarmer.id}
              open={activeDrawer === 'operations'}
              farmer={selectedFarmer}
              initialFilter={operationsFilter}
              onClose={closeDrawer}
            />
          </>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Çiftçi seçilmedi</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Detayları görüntülemek için sol panelden bir çiftçi seçin.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function Farmer360Page() {
  return (
    <FarmerToastProvider>
      <Farmer360PageContent />
    </FarmerToastProvider>
  )
}
