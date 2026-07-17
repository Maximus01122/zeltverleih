package de.zeltverleih.service;

import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.entity.Address;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.Client;
import de.zeltverleih.entity.Invoice;
import org.junit.jupiter.api.Test;
import org.mustangproject.validator.ZUGFeRDValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("dev")
class EInvoiceServiceIntegrationTest {

    @Autowired
    private EInvoiceService eInvoiceService;

    @Autowired
    private DocumentPdfGenerator pdfGenerator;

    @Autowired
    private DocumentCalculationService calculationService;

    @Test
    void create_generatesValidZugferdPdfAndXml() {
        Client client = completeClient();
        Booking booking = new Booking(client, LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 12));

        Invoice invoice = new Invoice(booking, "2026-07-1001",
                LocalDate.of(2026, 7, 13), LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 20));

        List<DocumentItemView> items = List.of(
                calculationService.item("Zeltmiete 3x6m", BigDecimal.ONE, new BigDecimal("350.00")),
                calculationService.item("Lieferung", BigDecimal.ONE, new BigDecimal("140.00")));
        var totals = calculationService.totals(items);

        byte[] visualPdf = pdfGenerator.invoice(client, invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(), invoice.getServiceDate(), invoice.getDueDate(),
                client.getCustomerNumber(), items, totals);

        EInvoiceService.EInvoiceResult result = eInvoiceService.create(invoice, client, items, visualPdf);

        assertNotNull(result.pdf());
        assertNotNull(result.xml());
        assertTrue(result.pdf().length > visualPdf.length);
        assertTrue(result.xml().length > 100);

        ZUGFeRDValidator validator = new ZUGFeRDValidator();
        validator.disableNotices();
        validator.validate(result.pdf(), "pdf");
        assertTrue(validator.wasCompletelyValid(), validator.validate(result.pdf(), "pdf"));
    }

    @Test
    void create_acceptsNegativeLineItemAsAllowance() {
        Client client = completeClient();
        Booking booking = new Booking(client, LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 12));

        Invoice invoice = new Invoice(booking, "2026-07-1002",
                LocalDate.of(2026, 7, 13), LocalDate.of(2026, 7, 10), LocalDate.of(2026, 7, 20));

        List<DocumentItemView> items = List.of(
                calculationService.item("Zeltmiete 3x6m", BigDecimal.ONE, new BigDecimal("350.00")),
                calculationService.item("Lieferung", BigDecimal.ONE, new BigDecimal("140.00")),
                calculationService.item("Rabatt", BigDecimal.ONE, new BigDecimal("-50.00")));
        var totals = calculationService.totals(items);

        byte[] visualPdf = pdfGenerator.invoice(client, invoice.getInvoiceNumber(),
                invoice.getInvoiceDate(), invoice.getServiceDate(), invoice.getDueDate(),
                client.getCustomerNumber(), items, totals);

        EInvoiceService.EInvoiceResult result = eInvoiceService.create(invoice, client, items, visualPdf);

        assertNotNull(result.pdf());
        assertNotNull(result.xml());

        ZUGFeRDValidator validator = new ZUGFeRDValidator();
        validator.disableNotices();
        validator.validate(result.pdf(), "pdf");
        assertTrue(validator.wasCompletelyValid(), validator.validate(result.pdf(), "pdf"));
    }

    private static Client completeClient() {
        Address address = new Address("Anger", "1", "99084", "Erfurt");
        return new Client(1042L, "Karl Müller GmbH", "rechnung@mueller.example", null, address);
    }
}
