import {
  deliveryDayKeyFromJsDay,
  type DeliveryDays,
} from './campaignDeliveryDays.ts'
import type { ScheduleDraft } from './campaignDraft.ts'
import { toDateTime } from './scheduleDateHelpers.ts'
import type { WizardCampaignType } from './campaignTypes.ts'

/**
 * Deterministic active campaign day count based on schedule.
 * Returns null when an open-ended schedule cannot be counted.
 */
export function calculateActiveCampaignDays(
  schedule: ScheduleDraft,
  campaignType: WizardCampaignType | null,
): number | null {
  if (campaignType === 'bulk' && schedule.bulkSendMode === 'single-send') {
    return 1
  }

  if (schedule.endMode === 'no-end-date') {
    return null
  }

  const start =
    schedule.startMode === 'now'
      ? new Date()
      : toDateTime(schedule.startDate, schedule.startTime || '00:00')
  const end = toDateTime(schedule.endDate, schedule.endTime || '23:59')

  if (!start || !end || end.getTime() <= start.getTime()) {
    return null
  }

  return countMatchingDays(start, end, schedule.deliveryDays)
}

function countMatchingDays(
  start: Date,
  end: Date,
  days: DeliveryDays,
): number {
  let count = 0
  const cursor = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  )
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())

  while (cursor.getTime() <= last.getTime()) {
    const key = deliveryDayKeyFromJsDay(cursor.getDay())
    if (days[key]) count += 1
    cursor.setDate(cursor.getDate() + 1)
  }

  return count
}
