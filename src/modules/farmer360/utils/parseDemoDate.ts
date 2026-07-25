const MONTHS: Record<string, number> = {
  ocak: 0,
  oca: 0,
  şubat: 1,
  subat: 1,
  şub: 1,
  sub: 1,
  mart: 2,
  mar: 2,
  nisan: 3,
  nis: 3,
  mayıs: 4,
  mayis: 4,
  may: 4,
  haziran: 5,
  haz: 5,
  temmuz: 6,
  tem: 6,
  ağustos: 7,
  agustos: 7,
  ağu: 7,
  agu: 7,
  eylül: 8,
  eylul: 8,
  eyl: 8,
  ekim: 9,
  eki: 9,
  kasım: 10,
  kasim: 10,
  kas: 10,
  aralık: 11,
  aralik: 11,
  ara: 11,
}

/** Parses demo dates like "14 Ağu 2026" or ISO strings. Returns null if unusable. */
export function parseDemoDate(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '—' || trimmed === '-' || trimmed === 'Belirtilmedi') {
    return null
  }

  const iso = Date.parse(trimmed)
  if (!Number.isNaN(iso) && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return new Date(iso)
  }

  const match = trimmed.match(/^(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})$/u)
  if (!match) {
    return null
  }

  const day = Number(match[1])
  const monthKey = match[2].toLocaleLowerCase('tr-TR')
  const year = Number(match[3])
  const month = MONTHS[monthKey]

  if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) {
    return null
  }

  return new Date(year, month, day)
}

/** Demo "today" for consistent walkthroughs (matches frozen interaction dates). */
export const DEMO_TODAY = new Date(2026, 6, 25)

export function daysUntilPolicyEnd(policyEndDate: string): number | null {
  const end = parseDemoDate(policyEndDate)
  if (!end) {
    return null
  }

  const msPerDay = 24 * 60 * 60 * 1000
  return Math.ceil((end.getTime() - DEMO_TODAY.getTime()) / msPerDay)
}
