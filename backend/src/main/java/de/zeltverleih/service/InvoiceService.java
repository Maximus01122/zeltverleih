package de.zeltverleih.service;

import de.zeltverleih.dto.request.InvoiceCreateRequest;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.dto.response.DocumentPreviewResponse;
import de.zeltverleih.dto.response.InvoiceFormDefaultsResponse;
import de.zeltverleih.dto.response.InvoiceResponse;
import de.zeltverleih.dto.response.PdfDocument;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.Invoice;
import de.zeltverleih.entity.InvoiceItem;
import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.exception.BadRequestException;
import de.zeltverleih.exception.ConflictException;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.InvoiceRepository;
import de.zeltverleih.service.DocumentCalculationService.Totals;
import de.zeltverleih.util.DocumentFilenameUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class InvoiceService {

    /** "Rechnung erstellen" is only offered in these booking states. */
    private static final Set<BookingStatus> INVOICEABLE_STATUSES = Set.of(
            BookingStatus.OFFER_ACCEPTED,
            BookingStatus.PAYMENT_PENDING,
            BookingStatus.COMPLETED
    );

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final ClientService clientService;
    private final DocumentCalculationService calculationService;
    private final DocumentPdfGenerator pdfGenerator;
    private final SequenceService sequenceService;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          BookingRepository bookingRepository,
                          ClientService clientService,
                          DocumentCalculationService calculationService,
                          DocumentPdfGenerator pdfGenerator,
                          SequenceService sequenceService) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
        this.clientService = clientService;
        this.calculationService = calculationService;
        this.pdfGenerator = pdfGenerator;
        this.sequenceService = sequenceService;
    }

    @Transactional(readOnly = true)
    public InvoiceFormDefaultsResponse formDefaults(Long bookingId) {
        Booking booking = loadBooking(bookingId);
        return new InvoiceFormDefaultsResponse(
                clientService.suggestedCustomerNumberForInvoice(booking.getClient()));
    }

    @Transactional(readOnly = true)
    public DocumentPreviewResponse preview(Long bookingId) {
        Booking booking = loadBooking(bookingId);
        List<DocumentItemView> items = resolveItems(booking);
        Totals totals = calculationService.totals(items);
        return new DocumentPreviewResponse(items, totals.net(), totals.vat(), totals.gross());
    }

    /** Uses saved offer line items when available; otherwise falls back to calculated defaults. */
    private List<DocumentItemView> resolveItems(Booking booking) {
        if (!booking.getOfferItems().isEmpty()) {
            return booking.getOfferItems().stream()
                    .map(i -> calculationService.item(i.getDescription(), i.getQuantity(), i.getUnitPrice()))
                    .toList();
        }
        return calculationService.proposeItemsFromStoredConditions(booking);
    }

    @Transactional
    public InvoiceResponse create(Long bookingId, InvoiceCreateRequest request) {
        Booking booking = loadBooking(bookingId);

        if (!INVOICEABLE_STATUSES.contains(booking.getStatus())) {
            throw new BadRequestException(
                    "Invoices can only be created for bookings in status OFFER_ACCEPTED, PAYMENT_PENDING or COMPLETED");
        }
        if (invoiceRepository.findByBookingId(bookingId).isPresent()) {
            throw new ConflictException("Booking %d already has an invoice".formatted(bookingId));
        }

        clientService.updateCustomerNumber(booking.getClient(), request.customerNumber());

        String invoiceNumber = nextInvoiceNumber(request);
        Invoice invoice = new Invoice(booking, invoiceNumber,
                request.invoiceDate(), request.serviceDate(), request.dueDate());

        List<ItemWithPosition> items = withPositions(request);
        items.forEach(i -> invoice.addItem(new InvoiceItem(
                i.line().description(), i.line().quantity(), i.line().unitPrice(), i.position())));

        booking.setStatus(BookingStatus.PAYMENT_PENDING);

        return toResponse(invoiceRepository.save(invoice));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getByBooking(Long bookingId) {
        return toResponse(loadByBooking(bookingId));
    }

    @Transactional(readOnly = true)
    public PdfDocument pdf(Long bookingId) {
        Invoice invoice = loadByBooking(bookingId);
        Booking booking = invoice.getBooking();

        List<DocumentItemView> items = itemViews(invoice);
        Totals totals = calculationService.totals(items);

        byte[] content = pdfGenerator.invoice(booking.getClient(), invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(), invoice.getServiceDate(), invoice.getDueDate(),
                booking.getClient().getCustomerNumber(), items, totals);
        String filename = DocumentFilenameUtil.pdfFilename("Rechnung", booking.getClient().getName());
        return new PdfDocument(filename, content);
    }

    /** Format: year-month of the invoice date + globally incrementing counter, e.g. 2026-01-1003. */
    private String nextInvoiceNumber(InvoiceCreateRequest request) {
        long counter = sequenceService.nextInvoiceCounter();
        return "%d-%02d-%d".formatted(
                request.invoiceDate().getYear(), request.invoiceDate().getMonthValue(), counter);
    }

    private record ItemWithPosition(de.zeltverleih.dto.request.ItemLineRequest line, int position) {}

    private List<ItemWithPosition> withPositions(InvoiceCreateRequest request) {
        return java.util.stream.IntStream.range(0, request.items().size())
                .mapToObj(i -> new ItemWithPosition(request.items().get(i), i))
                .toList();
    }

    private List<DocumentItemView> itemViews(Invoice invoice) {
        return invoice.getItems().stream()
                .map(i -> calculationService.item(i.getDescription(), i.getQuantity(), i.getUnitPrice()))
                .toList();
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        List<DocumentItemView> items = itemViews(invoice);
        Totals totals = calculationService.totals(items);
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getBooking().getId(),
                invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(),
                invoice.getServiceDate(),
                invoice.getDueDate(),
                items,
                totals.net(), totals.vat(), totals.gross()
        );
    }

    private Booking loadBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking %d not found".formatted(id)));
    }

    private Invoice loadByBooking(Long bookingId) {
        return invoiceRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No invoice exists for booking %d".formatted(bookingId)));
    }
}
