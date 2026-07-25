export type FieldSource =
  | 'ai'
  | 'manual'
  | 'field'
  | 'phone'
  | 'whatsapp'
  | 'form'

export type FarmerFieldSourceKey =
  | 'phone'
  | 'province'
  | 'district'
  | 'village'
  | 'preferredChannel'
  | 'crmSource'
  | 'communication.lastCall'
  | 'communication.lastWhatsApp'
  | 'communication.lastVisit'
  | 'productionType'
  | 'production.product'
  | 'production.fieldSize'
  | 'production.irrigationSystem'
  | 'production.soilType'
  | 'production.salesChannel'
  | 'finance.incomeRange'
  | 'finance.inputBudget'
  | 'finance.creditNeed'
  | 'finance.creditAmount'
  | 'finance.supportStatus'
  | 'insurance.status'
  | 'insurance.type'
  | 'insurance.policyEndDate'
  | 'insurance.renewalInterest'

export type FarmerFieldSources = Record<FarmerFieldSourceKey, FieldSource>

export type ProductionType = 'Bitkisel' | 'Hayvansal' | 'Arıcılık' | 'Karma'

export type FarmerStatus = 'Aktif' | 'Pasif'

export type ConsentValue = boolean | null

export type FarmerConsent = {
  dataProcessing: ConsentValue
  marketing: ConsentValue
  thirdPartyOffer: ConsentValue
  analytics: ConsentValue
}

export type FarmerConsentDetails = {
  version: string | null
  channel: string | null
  consentedAt: string | null
  withdrawal: string | null
}

export type MissingProfileCategory =
  | 'always_critical'
  | 'conditional_critical'
  | 'complementary'

export type MissingProfileModule =
  | 'Profil'
  | 'Üretim'
  | 'Finans'
  | 'Sigorta'
  | 'Arazi'
  | 'Hayvancılık'
  | 'Arıcılık'

export type MissingProfileItem = {
  id: string
  farmerId: string
  category: MissingProfileCategory
  fieldKey: string
  title: string
  module: MissingProfileModule
  explanation: string
  requiredFor: string
  permissionRequirement: string
  lastAskedStatus: string
  recommendedMethod: string
}

export type FarmerCommunication = {
  lastCall: string
  lastWhatsApp: string
  lastVisit: string
  frequency: string
}

export type FarmerProduction = {
  product: string
  fieldSize: string
  irrigationSystem: string
  soilType: string
  salesChannel: string
  aiSummary: string
}

export type FarmerFinance = {
  incomeRange: string
  inputBudget: string
  creditNeed: string
  creditAmount: string
  supportStatus: string
  aiSummary: string
}

export type FarmerInsurance = {
  status: string
  type: string
  policyEndDate: string
  renewalInterest: string
  aiEvaluation: string
}

export type FarmerLivestock = {
  animalType: string
  productionPurpose: string
  breed: string
  animalCount: string
  housingType: string
  feedingMethod: string
  healthMonitoring: string
  milkYield: string
  salesChannel: string
}

export type FarmerBeekeeping = {
  beekeepingType: string
  hiveCount: string
  mainProduct: string
  flora: string
  migratoryRoute: string
  diseaseHistory: string
  feedingMethod: string
  packagingSales: string
}

export type FarmerTechnologyEquipment = {
  tractorStatus: string
  tractorBrand: string
  tractorModel: string
  tractorAgeRange: string
  ownedEquipment: string
  droneUsage: string
  sensorUsage: string
  satelliteNdviInterest: string
  machineryPurchaseInterest: string
  maintenanceSparePartNeed: string
}

export type FarmerNote = {
  id: string
  date: string
  title: string
  content: string
}

export type MemoryConfidence = 'high' | 'medium' | 'low'

export type MemoryCategory =
  | 'communication'
  | 'production'
  | 'finance'
  | 'insurance'

export type AIMemoryItem = {
  id: string
  title: string
  detail: string
  category: MemoryCategory
  confidence: MemoryConfidence
  updatedAt: string
}

export type TimelineActor = 'Çiftçi' | 'AI' | 'Sistem' | 'Çalışan'

export type TimelineCategory =
  | 'conversation'
  | 'image'
  | 'ai_inference'
  | 'review'
  | 'employee_verification'
  | 'consent'
  | 'document'
  | 'profile'
  | 'segment'

export type TimelineRelatedSource = 'conversation' | 'document' | 'ai_memory'

export type TimelineRelatedSourceRefs = {
  conversationId?: string
  documentId?: string
  memoryId?: string
}

/** @deprecated Prefer TimelineCategory — kept for transitional imports */
export type TimelineEventType = TimelineCategory

export type TimelineEvent = {
  id: string
  title: string
  description: string
  occurredAt: string
  category: TimelineCategory
  actor: TimelineActor
  relatedSources?: TimelineRelatedSource[]
  relatedSourceRefs?: TimelineRelatedSourceRefs
}

export type FarmerNotificationType = 'warning' | 'ai' | 'document'

export type FarmerNotificationAction =
  | 'insurance'
  | 'operations_ai'
  | 'documents'

export type FarmerNotification = {
  id: string
  type: FarmerNotificationType
  title: string
  description: string
  occurredAt: string
  action: FarmerNotificationAction
}

export type FarmerOperationKind = 'ai_review' | 'manual'

export type FarmerOperationItem = {
  id: string
  kind: FarmerOperationKind
  title: string
  description: string
  sourceLabel?: string
  confidence?: MemoryConfidence
  confidencePercent?: number
  detectedAt: string
  dueLabel?: string
  priority?: 'high' | 'medium' | 'low'
  module?: string
}

export type Farmer = {
  id: string
  fullName: string
  status: FarmerStatus
  productionType: ProductionType
  farmerCode: string
  phone: string
  country: string
  province: string
  district: string
  village: string
  userType: string
  preferredLanguage: string
  preferredChannel: string
  crmSource: string
  registrationDate: string
  lastUpdated: string
  lastInteraction: string
  communication: FarmerCommunication
  production: FarmerProduction
  finance: FarmerFinance
  consent: FarmerConsent
  consentDetails: FarmerConsentDetails
  insurance: FarmerInsurance
  livestock?: FarmerLivestock
  beekeeping?: FarmerBeekeeping
  technologyEquipment: FarmerTechnologyEquipment
  complementaryGaps?: MissingProfileItem[]
  notes: FarmerNote[]
  aiMemory: AIMemoryItem[]
  timeline: TimelineEvent[]
  fieldSources: FarmerFieldSources
}

export type ProductionTypeFilterValue = 'Tümü' | ProductionType
