export type MemoryReviewStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'stale'
  | 'edited'

export type AiMemorySessionEntry = {
  extractedValue?: string
  status?: MemoryReviewStatus
}

const sessionStore: Record<string, AiMemorySessionEntry> = {}

function entryKey(farmerId: string, memoryId: string) {
  return `${farmerId}:${memoryId}`
}

export function getAiMemorySessionEntry(
  farmerId: string,
  memoryId: string,
): AiMemorySessionEntry | undefined {
  return sessionStore[entryKey(farmerId, memoryId)]
}

export function upsertAiMemorySessionEntry(
  farmerId: string,
  memoryId: string,
  patch: AiMemorySessionEntry,
): AiMemorySessionEntry {
  const key = entryKey(farmerId, memoryId)
  const nextEntry: AiMemorySessionEntry = {
    ...sessionStore[key],
    ...patch,
  }
  sessionStore[key] = nextEntry
  return nextEntry
}

export function readAiMemorySessionForItems(
  farmerId: string,
  memoryIds: string[],
): {
  extractedOverrides: Record<string, string>
  statusById: Record<string, MemoryReviewStatus>
} {
  const extractedOverrides: Record<string, string> = {}
  const statusById: Record<string, MemoryReviewStatus> = {}

  for (const memoryId of memoryIds) {
    const entry = getAiMemorySessionEntry(farmerId, memoryId)
    if (entry?.extractedValue !== undefined) {
      extractedOverrides[memoryId] = entry.extractedValue
    }
    if (entry?.status !== undefined) {
      statusById[memoryId] = entry.status
    }
  }

  return { extractedOverrides, statusById }
}
