import { api } from './api'
import type {
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  Booking,
  BookingDashboard,
  BookingRequest,
  BookingStatus,
  BookingSummary,
  DocumentPreview,
  FinanceDashboard,
  Invoice,
  InvoiceCreateRequest,
  InvoiceFormDefaults,
  LoadingFee,
  DeliveryFee,
  StandardFeeRequest,
  Material,
  MaterialAvailability,
  MaterialCreateRequest,
  MaterialUpdateRequest,
  OfferConditions,
  PriceVersionRequest,
  QuoteRequest,
  ServiceOption,
  DocumentItem,
  ClientSuggestion,
} from './types'

// --- Clients ---
export const searchClients = (q: string) =>
  api.get<ClientSuggestion[]>(`/api/clients/search?q=${encodeURIComponent(q)}`)

// --- Bookings ---
export const listBookings = (from?: string, to?: string) => {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return api.get<BookingSummary[]>(`/api/bookings${qs ? `?${qs}` : ''}`)
}
export const getBooking = (id: number) => api.get<Booking>(`/api/bookings/${id}`)
export const createBooking = (body: BookingRequest) =>
  api.post<Booking>('/api/bookings', body)
export const updateBooking = (id: number, body: BookingRequest) =>
  api.put<Booking>(`/api/bookings/${id}`, body)
export const changeBookingStatus = (id: number, status: BookingStatus) =>
  api.patch<Booking>(`/api/bookings/${id}/status`, { status })
export const deleteBooking = (id: number) => api.del<void>(`/api/bookings/${id}`)
export const checkAvailability = (body: AvailabilityCheckRequest) =>
  api.post<AvailabilityCheckResponse>('/api/bookings/availability-check', body)

// --- Materials ---
export const listMaterials = () => api.get<Material[]>('/api/materials')
export const createMaterial = (body: MaterialCreateRequest) =>
  api.post<Material>('/api/materials', body)
export const updateMaterial = (id: number, body: MaterialUpdateRequest) =>
  api.put<Material>(`/api/materials/${id}`, body)
export const addPriceVersion = (id: number, body: PriceVersionRequest) =>
  api.post<Material>(`/api/materials/${id}/prices`, body)
export const updatePriceVersion = (materialId: number, priceId: number, body: PriceVersionRequest) =>
  api.put<Material>(`/api/materials/${materialId}/prices/${priceId}`, body)
export const deletePriceVersion = (materialId: number, priceId: number) =>
  api.del<Material>(`/api/materials/${materialId}/prices/${priceId}`)
export const materialAvailability = (from: string, to: string) =>
  api.get<MaterialAvailability[]>(
    `/api/materials/availability?from=${from}&to=${to}`,
  )

// --- Services & loading fees ---
export const listServices = () => api.get<ServiceOption[]>('/api/services')
export const listLoadingFees = () => api.get<LoadingFee[]>('/api/loading-fees')
export const createLoadingFee = (body: StandardFeeRequest) =>
  api.post<LoadingFee>('/api/loading-fees', body)
export const updateLoadingFee = (id: number, body: StandardFeeRequest) =>
  api.put<LoadingFee>(`/api/loading-fees/${id}`, body)
export const deleteLoadingFee = (id: number) => api.del<void>(`/api/loading-fees/${id}`)
export const listDeliveryFees = () => api.get<DeliveryFee[]>('/api/delivery-fees')
export const createDeliveryFee = (body: StandardFeeRequest) =>
  api.post<DeliveryFee>('/api/delivery-fees', body)
export const updateDeliveryFee = (id: number, body: StandardFeeRequest) =>
  api.put<DeliveryFee>(`/api/delivery-fees/${id}`, body)
export const deleteDeliveryFee = (id: number) => api.del<void>(`/api/delivery-fees/${id}`)

// --- Offer / Invoice ---
export const offerPreview = (bookingId: number, conditions: OfferConditions) =>
  api.post<DocumentPreview>(`/api/bookings/${bookingId}/offer/preview`, conditions)
export const invoiceFormDefaults = (bookingId: number) =>
  api.get<InvoiceFormDefaults>(`/api/bookings/${bookingId}/invoice/defaults`)
export const invoicePreview = (bookingId: number) =>
  api.get<DocumentPreview>(`/api/bookings/${bookingId}/invoice/preview`)
export const getInvoice = (bookingId: number) =>
  api.get<Invoice>(`/api/bookings/${bookingId}/invoice`)
export const createInvoice = (bookingId: number, body: InvoiceCreateRequest) =>
  api.post<Invoice>(`/api/bookings/${bookingId}/invoice`, body)

export interface OfferPdfBody {
  conditions: OfferConditions
  items: DocumentItem[]
}

// --- Quote requests (Anfragen) ---
export const listQuoteRequests = () => api.get<QuoteRequest[]>('/api/anfragen')
export const unprocessedCount = () =>
  api.get<{ count: number }>('/api/anfragen/unprocessed/count')
export const setQuoteProcessed = (id: number, processed: boolean) =>
  api.patch<QuoteRequest>(`/api/anfragen/${id}/processed`, { processed })
export const deleteQuoteRequest = (id: number) => api.del<void>(`/api/anfragen/${id}`)

// --- Dashboard ---
export const financeDashboard = () =>
  api.get<FinanceDashboard>('/api/dashboard/finance')
export const bookingDashboard = () =>
  api.get<BookingDashboard>('/api/dashboard/bookings')
