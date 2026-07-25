import type { Farmer, FarmerOperationItem, TimelineEvent } from '../types/farmer.ts'
import { getCriticalMissingFields } from './getCriticalMissingFields.ts'
import { formatRelativeTime, formatTimelineDate } from './formatTimelineDate.ts'
import { isMeaningfulValue } from './calculateProfileCompleteness.ts'

function inferConfidence(title: string): {
  confidence: 'high' | 'medium' | 'low'
  confidencePercent: number
} {
  const match = title.match(/%(\d+)/)
  if (match) {
    const percent = Number(match[1])
    if (percent >= 90) {
      return { confidence: 'high', confidencePercent: percent }
    }
    if (percent >= 65) {
      return { confidence: 'medium', confidencePercent: percent }
    }
    return { confidence: 'low', confidencePercent: percent }
  }

  return { confidence: 'medium', confidencePercent: 72 }
}

function findRelatedImage(farmer: Farmer, inference: TimelineEvent): TimelineEvent | undefined {
  const inferenceTime = new Date(inference.occurredAt).getTime()
  return farmer.timeline
    .filter((event) => event.category === 'image')
    .sort(
      (a, b) =>
        Math.abs(new Date(a.occurredAt).getTime() - inferenceTime) -
        Math.abs(new Date(b.occurredAt).getTime() - inferenceTime),
    )[0]
}

function buildInferenceDescription(
  confidence: 'high' | 'medium' | 'low',
  percent: number,
  title: string,
): string {
  const normalized = title.toLocaleLowerCase('tr-TR')

  if (
    normalized.includes('hastalık') ||
    normalized.includes('varroa') ||
    normalized.includes('stres') ||
    normalized.includes('risk') ||
    normalized.includes('sağlık')
  ) {
    return confidence === 'high'
      ? `Güçlü görsel kanıt (%${percent}); teşhis değil, saha doğrulaması bekleniyor.`
      : `AI çıkarım güveni %${percent}; teşhis değil, henüz doğrulanmadı.`
  }

  if (normalized.includes('ilgi') || normalized.includes('tercih')) {
    return 'İlgi ifadesi kaydedildi; üretim alanına işlenmedi.'
  }

  return `AI çıkarım güveni %${percent}; operasyonel kullanımdan önce inceleme gerekli.`
}

function buildSourceLabel(farmer: Farmer, event: TimelineEvent): string {
  const image = findRelatedImage(farmer, event)
  if (image) {
    return `Kaynak: ${formatTimelineDate(image.occurredAt)} — ${image.title}`
  }

  const conversation = farmer.timeline.find((item) => item.category === 'conversation')
  if (conversation) {
    return `Kaynak: Konuşma, ${formatRelativeTime(conversation.occurredAt)}`
  }

  return `Kaynak: ${formatRelativeTime(event.occurredAt)} kayıt`
}

export function getFarmerOperations(farmer: Farmer): FarmerOperationItem[] {
  const operations: FarmerOperationItem[] = []

  for (const event of farmer.timeline) {
    if (event.category !== 'ai_inference') {
      continue
    }

    const { confidence, confidencePercent: percent } = inferConfidence(event.title)

    operations.push({
      id: `ai-${event.id}`,
      kind: 'ai_review',
      title: `Riski gözden geçir — ${event.title.replace(/\s*\(%\d+\)\s*$/, '')}`,
      description: buildInferenceDescription(confidence, percent, event.title),
      sourceLabel: buildSourceLabel(farmer, event),
      confidence,
      confidencePercent: percent,
      detectedAt: event.occurredAt,
    })
  }

  const missingCritical = getCriticalMissingFields(farmer).filter(
    (field) => field.priority === 'critical',
  )

  if (missingCritical[0]) {
    operations.push({
      id: `manual-missing-${missingCritical[0].key}`,
      kind: 'manual',
      title: `${missingCritical[0].label} bilgisini tamamla`,
      description: 'Operasyonel kararlar için kritik alan eksik.',
      detectedAt: '2026-07-24T09:00:00',
      dueLabel: 'Bu hafta',
      priority: 'high',
      module: 'Profil',
    })
  }

  const insuranceStatus = farmer.insurance.status.trim().toLocaleLowerCase('tr-TR')
  if (
    !isMeaningfulValue(farmer.insurance.status) ||
    insuranceStatus === 'belirtilmedi' ||
    insuranceStatus === 'pasif'
  ) {
    operations.push({
      id: 'manual-insurance-review',
      kind: 'manual',
      title: 'Sigorta durumunu netleştir',
      description: 'Poliçe veya yenileme bilgisi henüz operasyonel kullanıma hazır değil.',
      detectedAt: '2026-07-20T09:00:00',
      dueLabel: '3 gün',
      priority: 'medium',
      module: 'Sigorta',
    })
  }

  if (
    farmer.finance.creditNeed === 'Var' &&
    !isMeaningfulValue(farmer.finance.creditAmount)
  ) {
    operations.push({
      id: 'manual-credit-amount',
      kind: 'manual',
      title: 'Kredi miktarını doğrula',
      description: 'Kredi ihtiyacı var ancak tutar alanı eksik.',
      detectedAt: '2026-07-18T12:00:00',
      dueLabel: '5 gün',
      priority: 'medium',
      module: 'Finans',
    })
  }

  return operations
}
