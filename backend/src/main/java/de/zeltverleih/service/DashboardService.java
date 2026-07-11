package de.zeltverleih.service;

import de.zeltverleih.dto.response.BookingDashboardResponse;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.dto.response.FinanceDashboardResponse;
import de.zeltverleih.dto.response.FinanceDashboardResponse.CategoryRevenue;
import de.zeltverleih.dto.response.FinanceDashboardResponse.MonthlyRevenue;
import de.zeltverleih.dto.response.FinanceDashboardResponse.ServiceRevenue;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.Invoice;
import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.enums.MaterialCategory;
import de.zeltverleih.enums.SetupService;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.InvoiceRepository;
import de.zeltverleih.service.DocumentCalculationService.Totals;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Aggregates dashboard figures. Financial totals and the monthly trend come
 * from persisted invoices (the real billed money). The category/service pie
 * charts are recomputed from each invoiced booking's structured data via
 * {@link DocumentCalculationService}, since invoice items are free text and
 * cannot be reliably attributed to a category — they are indicative of the
 * revenue composition and may differ slightly from manually edited invoices.
 */
@Service
public class DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final DocumentCalculationService calculationService;

    public DashboardService(InvoiceRepository invoiceRepository,
                            BookingRepository bookingRepository,
                            DocumentCalculationService calculationService) {
        this.invoiceRepository = invoiceRepository;
        this.bookingRepository = bookingRepository;
        this.calculationService = calculationService;
    }

    @Transactional(readOnly = true)
    public FinanceDashboardResponse finance() {
        List<Invoice> invoices = invoiceRepository.findAllWithBookingAndItems();

        Totals totals = calculationService.totals(invoices.stream()
                .flatMap(i -> i.getItems().stream())
                .map(it -> calculationService.item(it.getDescription(), it.getQuantity(), it.getUnitPrice()))
                .toList());

        return new FinanceDashboardResponse(
                totals.net(), totals.vat(), totals.gross(),
                monthlyRevenue(invoices),
                incomeByCategory(invoices),
                incomeByService(invoices)
        );
    }

    @Transactional(readOnly = true)
    public BookingDashboardResponse bookings() {
        int year = Year.now().getValue();
        long completed = bookingRepository.countByStatusAndStartDateBetween(
                BookingStatus.COMPLETED, LocalDate.of(year, 1, 1), LocalDate.of(year, 12, 31));
        return new BookingDashboardResponse(year, completed);
    }

    private List<MonthlyRevenue> monthlyRevenue(List<Invoice> invoices) {
        Map<YearMonth, BigDecimal> byMonth = new TreeMap<>();
        for (Invoice invoice : invoices) {
            YearMonth month = YearMonth.from(invoice.getInvoiceDate());
            byMonth.merge(month, invoiceNet(invoice), BigDecimal::add);
        }
        return byMonth.entrySet().stream()
                .map(e -> new MonthlyRevenue(
                        e.getKey().getYear(),
                        e.getKey().getMonthValue(),
                        e.getValue().setScale(2, RoundingMode.HALF_UP)))
                .toList();
    }

    private List<CategoryRevenue> incomeByCategory(List<Invoice> invoices) {
        Map<MaterialCategory, BigDecimal> byCategory = new EnumMap<>(MaterialCategory.class);
        for (Invoice invoice : invoices) {
            calculationService.materialNetByCategory(invoice.getBooking())
                    .forEach((category, net) -> byCategory.merge(category, net, BigDecimal::add));
        }
        return byCategory.entrySet().stream()
                .map(e -> new CategoryRevenue(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(CategoryRevenue::net).reversed())
                .toList();
    }

    private List<ServiceRevenue> incomeByService(List<Invoice> invoices) {
        Map<SetupService, BigDecimal> byService = new EnumMap<>(SetupService.class);
        for (Invoice invoice : invoices) {
            calculationService.serviceNet(invoice.getBooking())
                    .forEach((service, net) -> byService.merge(service, net, BigDecimal::add));
        }
        return byService.entrySet().stream()
                .map(e -> new ServiceRevenue(e.getKey().name(), e.getKey().getLabel(), e.getValue()))
                .sorted(Comparator.comparing(ServiceRevenue::net).reversed())
                .toList();
    }

    private BigDecimal invoiceNet(Invoice invoice) {
        return invoice.getItems().stream()
                .map(it -> it.getUnitPrice().multiply(it.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
