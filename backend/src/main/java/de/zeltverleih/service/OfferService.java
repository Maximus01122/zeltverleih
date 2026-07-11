package de.zeltverleih.service;

import de.zeltverleih.dto.request.OfferConditionsRequest;
import de.zeltverleih.dto.request.OfferPdfRequest;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.dto.response.DocumentPreviewResponse;
import de.zeltverleih.dto.response.PdfDocument;
import de.zeltverleih.dto.request.ItemLineRequest;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.OfferItem;
import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.enums.SetupService;
import de.zeltverleih.exception.BadRequestException;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.service.DocumentCalculationService.Totals;
import de.zeltverleih.util.DocumentFilenameUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OfferService {

    private final BookingRepository bookingRepository;
    private final DocumentCalculationService calculationService;
    private final DocumentPdfGenerator pdfGenerator;

    public OfferService(BookingRepository bookingRepository,
                        DocumentCalculationService calculationService,
                        DocumentPdfGenerator pdfGenerator) {
        this.bookingRepository = bookingRepository;
        this.calculationService = calculationService;
        this.pdfGenerator = pdfGenerator;
    }

    @Transactional(readOnly = true)
    public DocumentPreviewResponse preview(Long bookingId, OfferConditionsRequest conditions) {
        Booking booking = load(bookingId);
        validateConditions(booking, conditions);

        List<DocumentItemView> items = calculationService.proposeItems(
                booking, conditions.countDailyRent(), conditions.countWeekendRent(), conditions.deliveryCosts());
        Totals totals = calculationService.totals(items);
        return new DocumentPreviewResponse(items, totals.net(), totals.vat(), totals.gross());
    }

    /**
     * Persists offer conditions and the final line items on the booking, then renders the PDF.
     */
    @Transactional
    public PdfDocument generatePdf(Long bookingId, OfferPdfRequest request) {
        Booking booking = load(bookingId);
        OfferConditionsRequest conditions = request.conditions();
        validateConditions(booking, conditions);

        booking.setOfferDate(LocalDate.now());
        booking.setValidUntil(conditions.validUntil());
        booking.setCountDailyRent(conditions.countDailyRent());
        booking.setCountWeekendRent(conditions.countWeekendRent());
        booking.setDeliveryCosts(conditions.deliveryCosts());
        booking.replaceOfferItems(toOfferItems(request.items()));
        booking.setStatus(BookingStatus.OFFER_SENT);

        List<DocumentItemView> items = itemViews(booking);
        Totals totals = calculationService.totals(items);

        byte[] content = pdfGenerator.offer(booking.getClient(), booking.getOfferDate(), conditions.validUntil(),
                booking.getStartDate(), booking.getEndDate(),
                booking.getClient().getCustomerNumber(), items, totals);
        String filename = DocumentFilenameUtil.pdfFilename("Angebot", booking.getClient().getName());
        return new PdfDocument(filename, content);
    }

    private List<OfferItem> toOfferItems(List<ItemLineRequest> lines) {
        List<OfferItem> items = new ArrayList<>();
        for (int i = 0; i < lines.size(); i++) {
            ItemLineRequest line = lines.get(i);
            items.add(new OfferItem(line.description(), line.quantity(), line.unitPrice(), i));
        }
        return items;
    }

    private List<DocumentItemView> itemViews(Booking booking) {
        return booking.getOfferItems().stream()
                .map(i -> calculationService.item(i.getDescription(), i.getQuantity(), i.getUnitPrice()))
                .toList();
    }

    private void validateConditions(Booking booking, OfferConditionsRequest conditions) {
        boolean hasDelivery = booking.getServices().contains(SetupService.LIEFERUNG);
        if (conditions.deliveryCosts() != null && !hasDelivery) {
            throw new BadRequestException("Delivery costs require the LIEFERUNG service");
        }
    }

    private Booking load(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking %d not found".formatted(id)));
    }
}
