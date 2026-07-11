import type { BookingStatus, MaterialCategory } from './types'

interface StatusMeta {
  label: string
  /** Tailwind classes for the status badge (light tint). */
  badge: string
  /** Tailwind classes for solid calendar bars. */
  bar: string
}

// Fixed colour coding per the app specification.
export const BOOKING_STATUS: Record<BookingStatus, StatusMeta> = {
  UNPROCESSED: {
    label: 'Unbearbeitet',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    bar: 'bg-blue-500 text-white hover:bg-blue-600',
  },
  OFFER_SENT: {
    label: 'Angebot gesendet',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    bar: 'bg-amber-400 text-amber-950 hover:bg-amber-500',
  },
  OFFER_REJECTED: {
    label: 'Angebot abgelehnt',
    badge: 'bg-red-100 text-red-800 border-red-200',
    bar: 'bg-red-500 text-white hover:bg-red-600',
  },
  OFFER_ACCEPTED: {
    label: 'Angebot akzeptiert',
    badge: 'bg-green-100 text-green-800 border-green-200',
    bar: 'bg-green-600 text-white hover:bg-green-700',
  },
  PAYMENT_PENDING: {
    label: 'Zahlung offen',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    bar: 'bg-orange-500 text-white hover:bg-orange-600',
  },
  COMPLETED: {
    label: 'Beendet',
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    bar: 'bg-gray-400 text-white hover:bg-gray-500',
  },
}

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  'UNPROCESSED',
  'OFFER_SENT',
  'OFFER_REJECTED',
  'OFFER_ACCEPTED',
  'PAYMENT_PENDING',
  'COMPLETED',
]

/** Bookings in these states may be invoiced (matches backend guard). */
export const INVOICEABLE: BookingStatus[] = [
  'OFFER_ACCEPTED',
  'PAYMENT_PENDING',
  'COMPLETED',
]

export const MATERIAL_CATEGORY: Record<MaterialCategory, string> = {
  ZELTE: 'Zelte',
  TISCHE_BAENKE_STUEHLE: 'Tische & Bänke',
  LICHT_SCHATTEN: 'Licht & Schatten',
  WAERME_KAELTE: 'Wärme & Kälte',
  AKTIVITAETEN: 'Aktivitäten',
}

export const MATERIAL_CATEGORY_ORDER: MaterialCategory[] = [
  'ZELTE',
  'TISCHE_BAENKE_STUEHLE',
  'LICHT_SCHATTEN',
  'WAERME_KAELTE',
  'AKTIVITAETEN',
]
