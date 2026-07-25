import type { Farmer, FarmerNotification } from '../types/farmer.ts'
import { getDocumentsForFarmer } from '../data/documents.ts'
import { isMeaningfulValue } from './calculateProfileCompleteness.ts'
import { daysUntilPolicyEnd } from './parseDemoDate.ts'

function buildInsuranceNotification(farmer: Farmer): FarmerNotification | null {
  const status = farmer.insurance.status.trim().toLocaleLowerCase('tr-TR')
  const statusMissing =
    !isMeaningfulValue(farmer.insurance.status) ||
    status === 'belirtilmedi' ||
    status.includes('belirsiz')

  if (statusMissing) {
    return {
      id: `${farmer.id}-n-insurance`,
      type: 'warning',
      title: 'Sigorta durumu profilde netleştirilmedi',
      description:
        'Poliçe kaydı eksik; risk ve yenileme takibi için durum bilgisi tamamlanmalı.',
      occurredAt: '2026-07-25T06:45:00',
      action: 'insurance',
    }
  }

  if (status === 'pasif') {
    return {
      id: `${farmer.id}-n-insurance`,
      type: 'warning',
      title: 'Sigorta poliçesi pasif — yenileme değerlendirmesi gerekli',
      description: isMeaningfulValue(farmer.insurance.policyEndDate)
        ? `Son poliçe bitiş tarihi ${farmer.insurance.policyEndDate}; yenileme ilgisi doğrulanmalı.`
        : 'Pasif poliçe kaydı var; yenileme ilgisi doğrulanmalı.',
      occurredAt: '2026-07-25T06:45:00',
      action: 'insurance',
    }
  }

  if (status === 'aktif') {
    const daysLeft = daysUntilPolicyEnd(farmer.insurance.policyEndDate)
    if (daysLeft === null) {
      return {
        id: `${farmer.id}-n-insurance`,
        type: 'warning',
        title: 'Aktif sigorta için poliçe bitiş tarihi eksik',
        description: 'Yenileme takvimi oluşturulabilmesi için bitiş tarihi girilmeli.',
        occurredAt: '2026-07-25T06:45:00',
        action: 'insurance',
      }
    }

    if (daysLeft <= 90) {
      const timing =
        daysLeft < 0
          ? `Poliçe süresi ${Math.abs(daysLeft)} gün önce dolmuş görünüyor.`
          : `Poliçe bitişine ${daysLeft} gün kaldı.`
      return {
        id: `${farmer.id}-n-insurance`,
        type: 'warning',
        title: 'Sigorta poliçesi 90 gün içinde yenileme gerektiriyor',
        description: `${timing} (${farmer.insurance.policyEndDate})`,
        occurredAt: '2026-07-25T06:45:00',
        action: 'insurance',
      }
    }
  }

  return null
}

export function getFarmerNotifications(farmer: Farmer): FarmerNotification[] {
  const notifications: FarmerNotification[] = []
  const docs = getDocumentsForFarmer(farmer.id, farmer.productionType)

  const insuranceNotification = buildInsuranceNotification(farmer)
  if (insuranceNotification) {
    notifications.push(insuranceNotification)
  }

  const aiEvent = farmer.timeline.find((event) => event.category === 'ai_inference')
  if (aiEvent) {
    notifications.push({
      id: `${farmer.id}-n-ai`,
      type: 'ai',
      title: `AI yeni bir sinyal tespit etti: ${aiEvent.title
        .replace(/^Görselden\s+/i, '')
        .replace(/\s*\(%\d+\)\s*$/, '')
        .toLocaleLowerCase('tr-TR')}`,
      description: aiEvent.description,
      occurredAt: aiEvent.occurredAt,
      action: 'operations_ai',
    })
  }

  const documentEvent = farmer.timeline.find((event) => event.category === 'document')
  if (documentEvent) {
    const linkedDocId = documentEvent.relatedSourceRefs?.documentId
    const linkedDoc = linkedDocId
      ? docs.find((document) => document.id === linkedDocId)
      : undefined

    notifications.push({
      id: `${farmer.id}-n-doc`,
      type: 'document',
      title: `Yeni belge yüklendi: ${
        linkedDoc?.name ??
        documentEvent.title
          .replace(/\s+belgesi?\s+(eklendi|yüklendi)/i, '')
          .trim()
      }`,
      description: documentEvent.description,
      occurredAt: documentEvent.occurredAt,
      action: 'documents',
    })
  }

  return notifications.sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}
