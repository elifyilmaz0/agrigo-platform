import type { Farmer, TimelineEvent, TimelineRelatedSourceRefs } from '../types/farmer.ts'
import { getDocumentsForFarmer } from '../data/documents.ts'

export function resolveTimelineSourceRefs(
  event: TimelineEvent,
  farmer: Farmer,
): TimelineRelatedSourceRefs {
  const explicit = event.relatedSourceRefs ?? {}
  const sources = event.relatedSources ?? []
  const documents = getDocumentsForFarmer(farmer.id, farmer.productionType)

  const conversationId = sources.includes('conversation')
    ? (explicit.conversationId ??
      farmer.timeline.find((item) => item.category === 'conversation')?.id)
    : explicit.conversationId

  const documentId = sources.includes('document')
    ? (explicit.documentId ??
      farmer.timeline.find((item) => item.category === 'document')
        ?.relatedSourceRefs?.documentId ??
      documents[0]?.id)
    : explicit.documentId

  const memoryId = sources.includes('ai_memory')
    ? (explicit.memoryId ?? farmer.aiMemory[0]?.id)
    : explicit.memoryId

  return {
    conversationId,
    documentId,
    memoryId,
  }
}
