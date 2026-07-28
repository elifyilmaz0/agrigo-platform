export type DeliveryDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type DeliveryDays = Record<DeliveryDayKey, boolean>

export const deliveryDayOptions: { key: DeliveryDayKey; label: string; shortLabel: string }[] =
  [
    { key: 'monday', label: 'Pazartesi', shortLabel: 'Pzt' },
    { key: 'tuesday', label: 'Salı', shortLabel: 'Sal' },
    { key: 'wednesday', label: 'Çarşamba', shortLabel: 'Çar' },
    { key: 'thursday', label: 'Perşembe', shortLabel: 'Per' },
    { key: 'friday', label: 'Cuma', shortLabel: 'Cum' },
    { key: 'saturday', label: 'Cumartesi', shortLabel: 'Cmt' },
    { key: 'sunday', label: 'Pazar', shortLabel: 'Paz' },
  ]

export function createAllDeliveryDays(selected = true): DeliveryDays {
  return {
    monday: selected,
    tuesday: selected,
    wednesday: selected,
    thursday: selected,
    friday: selected,
    saturday: selected,
    sunday: selected,
  }
}

export function createWeekdayDeliveryDays(): DeliveryDays {
  return {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  }
}

export function createWeekendDeliveryDays(): DeliveryDays {
  return {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: true,
    sunday: true,
  }
}

export function countSelectedDeliveryDays(days: DeliveryDays): number {
  return deliveryDayOptions.filter((day) => days[day.key]).length
}

export function formatSelectedDeliveryDays(days: DeliveryDays): string {
  const selected = deliveryDayOptions.filter((day) => days[day.key])
  if (selected.length === 0) return 'Henüz belirlenmedi'
  if (selected.length === 7) return 'Her gün'
  const weekdayOnly =
    days.monday &&
    days.tuesday &&
    days.wednesday &&
    days.thursday &&
    days.friday &&
    !days.saturday &&
    !days.sunday
  if (weekdayOnly) return 'Pazartesi–Cuma'
  const weekendOnly =
    !days.monday &&
    !days.tuesday &&
    !days.wednesday &&
    !days.thursday &&
    !days.friday &&
    days.saturday &&
    days.sunday
  if (weekendOnly) return 'Cumartesi–Pazar'
  return selected.map((day) => day.shortLabel).join(', ')
}

/** JS getDay(): 0=Sun ... 6=Sat */
export function deliveryDayKeyFromJsDay(jsDay: number): DeliveryDayKey {
  const map: DeliveryDayKey[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  return map[jsDay] ?? 'monday'
}
