const timelineDateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const dayGroupFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatTimelineDate(iso: string): string {
  return timelineDateFormatter.format(new Date(iso))
}

export function formatMemoryDate(iso: string): string {
  return formatTimelineDate(iso)
}

export function formatTimelineDayGroup(iso: string): string {
  return dayGroupFormatter.format(new Date(iso))
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatClock(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatRelativeTime(iso: string, now = new Date()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  if (isSameCalendarDay(date, now)) {
    return `Bugün, ${formatClock(date)}`
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfEvent = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfEvent.getTime()) / (24 * 60 * 60 * 1000),
  )

  if (dayDiff === 1) {
    return 'Dün'
  }

  if (dayDiff > 1 && dayDiff < 30) {
    return `${dayDiff} gün önce`
  }

  const months =
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())

  if (months >= 1 && months < 12) {
    return `${months} ay önce`
  }

  if (months >= 12) {
    const years = Math.floor(months / 12)
    return `${years} yıl önce`
  }

  return formatTimelineDate(iso)
}

export function formatTimelineStreamTime(iso: string, now = new Date()): string {
  return formatRelativeTime(iso, now)
}
