export type TimezoneOption = {
  value: string
  label: string
}

export const timezoneOptions: TimezoneOption[] = [
  { value: 'Europe/Istanbul', label: 'İstanbul (UTC+3)' },
  { value: 'Europe/London', label: 'Londra' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'UTC', label: 'UTC' },
]

export function getTimezoneLabel(value: string | null | undefined): string {
  if (!value) return ''
  return timezoneOptions.find((option) => option.value === value)?.label ?? value
}
