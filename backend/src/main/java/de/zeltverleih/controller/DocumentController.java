package de.zeltverleih.controller;

import de.zeltverleih.dto.request.InvoiceCreateRequest;
import de.zeltverleih.dto.request.OfferConditionsRequest;
import de.zeltverleih.dto.request.OfferPdfRequest;
import de.zeltverleih.dto.response.DocumentPreviewResponse;
import de.zeltverleih.dto.response.InvoiceFormDefaultsResponse;
import de.zeltverleih.dto.response.InvoiceResponse;
import de.zeltverleih.service.InvoiceService;
import de.zeltverleih.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/bookings/{bookingId}")
public class DocumentController {

    private final OfferService offerService;
    private final InvoiceService invoiceService;

    public DocumentController(OfferService offerService, InvoiceService invoiceService) {
        this.offerService = offerService;
        this.invoiceService = invoiceService;
    }

    // --- Angebot ---

    @PostMapping("/offer/preview")
    public DocumentPreviewResponse offerPreview(@PathVariable Long bookingId,
                                                @Valid @RequestBody OfferConditionsRequest request) {
        return offerService.preview(bookingId, request);
    }

    @PostMapping("/offer/pdf")
    public ResponseEntity<byte[]> offerPdf(@PathVariable Long bookingId,
                                           @Valid @RequestBody OfferPdfRequest request) {
        var pdf = offerService.generatePdf(bookingId, request);
        return pdfResponse(pdf.filename(), pdf.content());
    }

    // --- Rechnung ---

    @GetMapping("/invoice/defaults")
    public InvoiceFormDefaultsResponse invoiceDefaults(@PathVariable Long bookingId) {
        return invoiceService.formDefaults(bookingId);
    }

    @GetMapping("/invoice/preview")
    public DocumentPreviewResponse invoicePreview(@PathVariable Long bookingId) {
        return invoiceService.preview(bookingId);
    }

    @PostMapping("/invoice")
    public ResponseEntity<InvoiceResponse> createInvoice(@PathVariable Long bookingId,
                                                         @Valid @RequestBody InvoiceCreateRequest request) {
        InvoiceResponse response = invoiceService.create(bookingId, request);
        return ResponseEntity
                .created(URI.create("/api/bookings/%d/invoice".formatted(bookingId)))
                .body(response);
    }

    @GetMapping("/invoice")
    public InvoiceResponse getInvoice(@PathVariable Long bookingId) {
        return invoiceService.getByBooking(bookingId);
    }

    @GetMapping("/invoice/pdf")
    public ResponseEntity<byte[]> invoicePdf(@PathVariable Long bookingId) {
        InvoiceService.PdfDocument pdf = invoiceService.pdf(bookingId);
        return pdfResponse(pdf.filename(), pdf.content());
    }

    private ResponseEntity<byte[]> pdfResponse(String filename, byte[] content) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(filename, StandardCharsets.UTF_8).build());
        return ResponseEntity.ok().headers(headers).body(content);
    }
}
