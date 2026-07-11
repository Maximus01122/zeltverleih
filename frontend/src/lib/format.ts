const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const numberFormatter = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number | null | undefined): string {
  return currencyFormatter.format(value ?? 0)
}

export function formatNumber(value: number | null | undefined): string {
  return numberFormatter.format(value ?? 0)
}

/** ISO date (yyyy-MM-dd) or date-time → dd.MM.yyyy. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '–'
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso)
  if (Number.isNaN(date.getTime())) return '–'
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '–'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '–'
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const MONTHS = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

export function formatMonth(year: number, month: number): string {
  return `${MONTHS[month - 1]} ${year}`
}

/** Local calendar date as yyyy-MM-dd (avoids UTC shifts from toISOString). */
export function isoLocalDate(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso)
  date.setDate(date.getDate() + days)
  return isoLocalDate(date)
}

/** Invoice due date: invoice date + 7 days; Sat/Sun → following Monday. */
export function computeInvoiceDueDate(invoiceDateIso: string): string {
  const due = parseIsoDate(addDaysIso(invoiceDateIso, 7))
  const weekday = due.getDay()
  if (weekday === 6) {
    due.setDate(due.getDate() + 2)
  } else if (weekday === 0) {
    due.setDate(due.getDate() + 1)
  }
  return isoLocalDate(due)
}
