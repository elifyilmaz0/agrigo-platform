export function getCurrentLocalDateTime(): Date {
  return new Date()
}

export function toDateTime(date: string, time: string): Date | null {
  if (!date.trim() || !time.trim()) return null
  const normalizedTime = time.length === 5 ? `${time}:00` : time
  const value = new Date(`${date}T${normalizedTime}`)
  if (Number.isNaN(value.getTime())) return null
  return value
}

export function compareHHmm(a: string, b: string): number {
  const [ah, am] = a.split(':').map(Number)
  const [bh, bm] = b.split(':').map(Number)
  const aMin = (ah || 0) * 60 + (am || 0)
  const bMin = (bh || 0) * 60 + (bm || 0)
  return aMin - bMin
}

export function formatScheduleDateTime(
  date: string,
  time: string,
): string {
  const value = toDateTime(date, time)
  if (!value) return 'Henüz belirlenmedi'
  return value.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateOnly(date: string): string {
  if (!date.trim()) return 'Henüz belirlenmedi'
  const value = new Date(`${date}T12:00:00`)
  if (Number.isNaN(value.getTime())) return 'Henüz belirlenmedi'
  return value.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isPastDateTime(
  date: string,
  time: string,
  now: Date = getCurrentLocalDateTime(),
): boolean {
  const value = toDateTime(date, time)
  if (!value) return false
  return value.getTime() < now.getTime()
}

export function isDateBeforeToday(
  date: string,
  now: Date = getCurrentLocalDateTime(),
): boolean {
  if (!date.trim()) return false
  const value = startOfLocalDay(new Date(`${date}T12:00:00`))
  if (Number.isNaN(value.getTime())) return false
  return value.getTime() < startOfLocalDay(now).getTime()
}
