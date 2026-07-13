// Mirrors the Spring Boot DTOs. Monetary BigDecimals serialize as JSON numbers.

export type BookingStatus =
  | 'UNPROCESSED'
  | 'OFFER_SENT'
  | 'OFFER_REJECTED'
  | 'OFFER_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'COMPLETED'

export type MaterialCategory =
  | 'ZELTE'
  | 'TISCHE_BAENKE_STUEHLE'
  | 'LICHT_SCHATTEN'
  | 'WAERME_KAELTE'
  | 'AKTIVITAETEN'

export interface ServiceOption {
  name: string
  label: string
}

export interface BookingSummary {
  id: number
  clientName: string
  startDate: string
  endDate: string
  offerDate: string | null
  status: BookingStatus
}

export interface ClientView {
  id: number
  customerNumber: string
  name: string
  email: string
  phoneNumber: string | null
  street: string | null
  houseNumber: string | null
  postalCode: string | null
  city: string | null
}

export interface MaterialLineView {
  materialId: number
  materialName: string
  quantity: number
}

export interface LoadingFeeView {
  id: number
  name: string
  price: number
}

export interface Booking {
  id: number
  status: BookingStatus
  client: ClientView
  startDate: string
  endDate: string
  offerDate: string | null
  validUntil: string | null
  countDailyRent: number | null
  countWeekendRent: number | null
  deliveryCosts: number | null
  loadingFee: LoadingFeeView | null
  comment: string | null
  materials: MaterialLineView[]
  services: string[]
}

export interface ClientData {
  name: string
  email: string
  phoneNumber?: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

export interface MaterialLine {
  materialId: number
  quantity: number
}

export interface BookingRequest {
  client: ClientData
  startDate: string
  endDate: string
  materials: MaterialLine[]
  services: string[]
  loadingFeeId?: number | null
  comment?: string | null
  ignoreAvailability?: boolean
}

export interface AvailabilityCheckRequest {
  startDate: string
  endDate: string
  materials: MaterialLine[]
  excludeBookingId?: number | null
}

export interface MaterialAvailabilityLine {
  materialId: number
  materialName: string
  requested: number
  available: number
  sufficient: boolean
}

export interface AvailabilityCheckResponse {
  available: boolean
  materials: MaterialAvailabilityLine[]
}

export interface PriceView {
  id: number
  dailyPrice: number
  weekendPrice: number
  assemblyPrice: number
  validFrom: string
}

export interface Material {
  id: number
  name: string
  category: MaterialCategory
  totalCount: number
  currentPrice: PriceView | null
  priceHistory: PriceView[]
}

export interface MaterialCreateRequest {
  name: string
  category: MaterialCategory
  totalCount: number
  dailyPrice: number
  weekendPrice: number
  assemblyPrice: number
  validFrom?: string | null
}

export interface MaterialUpdateRequest {
  name: string
  category: MaterialCategory
  totalCount: number
}

export interface PriceVersionRequest {
  dailyPrice: number
  weekendPrice: number
  assemblyPrice: number
  validFrom: string
}

export interface MaterialAvailability {
  materialId: number
  name: string
  category: MaterialCategory
  totalCount: number
  available: number
}

export interface LoadingFee {
  id: number
  name: string
  price: number
}

export interface DeliveryFee {
  id: number
  name: string
  price: number
}

export interface StandardFeeRequest {
  name: string
  price: number
}

export interface DocumentItem {
  description: string
  quantity: number
  unitPrice: number
  lineTotal?: number
}

export interface DocumentPreview {
  items: Required<DocumentItem>[]
  netTotal: number
  vatTotal: number
  grossTotal: number
}

export interface OfferConditions {
  countDailyRent: number
  countWeekendRent: number
  deliveryCosts?: number | null
  validUntil: string
}

export interface Invoice {
  id: number
  bookingId: number
  invoiceNumber: string
  invoiceDate: string
  serviceDate: string
  dueDate: string
  items: Required<DocumentItem>[]
  netTotal: number
  vatTotal: number
  grossTotal: number
  einvoice: boolean
}

export interface InvoiceCreateRequest {
  customerNumber: number
  invoiceDate: string
  serviceDate: string
  dueDate: string
  items: DocumentItem[]
  createEInvoice?: boolean
}

export interface InvoiceFormDefaults {
  customerNumber: number
}

export interface QuoteRequest {
  id: number
  receivedAt: string
  processed: boolean
  clientId: number | null
  name: string
  email: string | null
  phone: string | null
  eventType: string | null
  eventDate: string | null
  guestCount: string | null
  tentCount: string | null
  tentSize: string | null
  deliveryPostalCode: string | null
  deliveryCity: string | null
  servicePackage: string | null
  accessories: string | null
  cartJson: string | null
  ground: string | null
  message: string | null
}

export interface FinanceDashboard {
  netTotal: number
  vatTotal: number
  grossTotal: number
  monthlyRevenue: { year: number; month: number; net: number }[]
  incomeByCategory: { category: MaterialCategory; net: number }[]
  incomeByService: { service: string; label: string; net: number }[]
}

export interface BookingDashboard {
  year: number
  completedThisYear: number
}
