package de.zeltverleih.service;

import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.BookingMaterial;
import de.zeltverleih.entity.DeliveryFee;
import de.zeltverleih.entity.MaterialPrice;
import de.zeltverleih.enums.MaterialCategory;
import de.zeltverleih.enums.SetupService;
import de.zeltverleih.repository.DeliveryFeeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Computes proposed document positions (offer/invoice) from a booking and
 * exposes the same pricing logic as category/service breakdowns for the
 * dashboard. All proposed positions remain editable in the UI before the PDF
 * is generated — this service only provides the calculated default.
 */
@Service
public class DocumentCalculationService {

    /** Which setup service covers which material category's assembly prices. */
    private static final Map<SetupService, MaterialCategory> ASSEMBLY_CATEGORY = Map.of(
            SetupService.AUFBAU_ZELT, MaterialCategory.ZELTE,
            SetupService.AUFBAU_BESTUHLUNG, MaterialCategory.TISCHE_BAENKE_STUEHLE,
            SetupService.AUFBAU_AKTIVITAETEN, MaterialCategory.AKTIVITAETEN
    );

    private final BigDecimal vatRate;
    private final DeliveryFeeRepository deliveryFeeRepository;

    public DocumentCalculationService(@Value("${app.vat-rate}") BigDecimal vatRate,
                                      DeliveryFeeRepository deliveryFeeRepository) {
        this.vatRate = vatRate;
        this.deliveryFeeRepository = deliveryFeeRepository;
    }

    public record Totals(BigDecimal net, BigDecimal vat, BigDecimal gross) {}

    public List<DocumentItemView> proposeItems(Booking booking, int countDailyRent, int countWeekendRent,
                                               BigDecimal deliveryCosts) {
        List<DocumentItemView> items = new ArrayList<>();

        for (BookingMaterial bm : booking.getBookingMaterials()) {
            items.add(item(bm.getMaterial().getName(), BigDecimal.valueOf(bm.getQuantity()),
                    materialUnitPrice(booking, bm, countDailyRent, countWeekendRent)));
        }

        for (SetupService service : booking.getServices().stream().sorted().toList()) {
            if (service == SetupService.SELBSTABHOLUNG && booking.getLoadingFee() == null) {
                continue; // no loading fee selected → nothing to bill
            }
            items.add(item(serviceLabel(booking, service), BigDecimal.ONE,
                    serviceAmount(booking, service, deliveryCosts)));
        }
        return items;
    }

    /** Proposal based on the conditions already stored on the booking (used for invoice prefill). */
    public List<DocumentItemView> proposeItemsFromStoredConditions(Booking booking) {
        return proposeItems(booking,
                orZero(booking.getCountDailyRent()),
                orZero(booking.getCountWeekendRent()),
                booking.getDeliveryCosts());
    }

    public Totals totals(List<DocumentItemView> items) {
        BigDecimal net = items.stream()
                .map(DocumentItemView::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal vat = net.multiply(vatRate).setScale(2, RoundingMode.HALF_UP);
        return new Totals(net.setScale(2, RoundingMode.HALF_UP), vat, net.add(vat).setScale(2, RoundingMode.HALF_UP));
    }

    public DocumentItemView item(String description, BigDecimal quantity, BigDecimal unitPrice) {
        BigDecimal lineTotal = unitPrice.multiply(quantity).setScale(2, RoundingMode.HALF_UP);
        return new DocumentItemView(description, quantity, unitPrice.setScale(2, RoundingMode.HALF_UP), lineTotal);
    }

    /** Net material revenue grouped by category, using the booking's stored rent conditions. */
    public Map<MaterialCategory, BigDecimal> materialNetByCategory(Booking booking) {
        int daily = orZero(booking.getCountDailyRent());
        int weekend = orZero(booking.getCountWeekendRent());
        Map<MaterialCategory, BigDecimal> result = new EnumMap<>(MaterialCategory.class);
        for (BookingMaterial bm : booking.getBookingMaterials()) {
            BigDecimal net = materialUnitPrice(booking, bm, daily, weekend)
                    .multiply(BigDecimal.valueOf(bm.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            result.merge(bm.getMaterial().getCategory(), net, BigDecimal::add);
        }
        return result;
    }

    /** Net revenue per booked service, using the booking's stored delivery costs / loading fee. */
    public Map<SetupService, BigDecimal> serviceNet(Booking booking) {
        Map<SetupService, BigDecimal> result = new EnumMap<>(SetupService.class);
        for (SetupService service : booking.getServices()) {
            if (service == SetupService.SELBSTABHOLUNG && booking.getLoadingFee() == null) {
                continue;
            }
            result.merge(service,
                    serviceAmount(booking, service, booking.getDeliveryCosts()).setScale(2, RoundingMode.HALF_UP),
                    BigDecimal::add);
        }
        return result;
    }

    /** Unit price per material: dailyPrice × daily rents + weekendPrice × weekend rents. */
    private BigDecimal materialUnitPrice(Booking booking, BookingMaterial bm, int daily, int weekend) {
        return bm.getMaterial().priceValidOn(booking.getStartDate())
                .map(p -> p.getDailyPrice().multiply(BigDecimal.valueOf(daily))
                        .add(p.getWeekendPrice().multiply(BigDecimal.valueOf(weekend))))
                .orElse(BigDecimal.ZERO);
    }

    private BigDecimal serviceAmount(Booking booking, SetupService service, BigDecimal deliveryCosts) {
        return switch (service) {
            case LIEFERUNG -> orZero(deliveryCosts);
            case SELBSTABHOLUNG -> booking.getLoadingFee() != null ? booking.getLoadingFee().getPrice() : BigDecimal.ZERO;
            case AUFBAU_ZELT -> tentAssemblyAmount(booking);
            default -> assemblySum(booking, service);
        };
    }

    private String serviceLabel(Booking booking, SetupService service) {
        if (service == SetupService.SELBSTABHOLUNG && booking.getLoadingFee() != null) {
            return "Ladepauschale (%s)".formatted(booking.getLoadingFee().getName());
        }
        return service.getLabel();
    }

    /**
     * Tent assembly: Σ(assemblyPrice × qty) minus the standard delivery fee
     * from the Lieferpauschale table (historically 140 €). Floored at 0.
     */
    private BigDecimal tentAssemblyAmount(Booking booking) {
        BigDecimal sum = assemblySum(booking, SetupService.AUFBAU_ZELT);
        BigDecimal deducted = sum.subtract(standardDeliveryFee());
        return deducted.signum() < 0 ? BigDecimal.ZERO : deducted;
    }

    /** First Lieferpauschale row; 0 if the table is empty. */
    private BigDecimal standardDeliveryFee() {
        return deliveryFeeRepository.findAll().stream()
                .findFirst()
                .map(DeliveryFee::getPrice)
                .map(DocumentCalculationService::orZero)
                .orElse(BigDecimal.ZERO);
    }

    /**
     * Assembly price sum for the materials covered by the given service.
     * Services without a category mapping (Regenrinne, Zeltboden, Aufbauhilfe)
     * default to 0.00 and are priced manually in the editable preview.
     */
    private BigDecimal assemblySum(Booking booking, SetupService service) {
        MaterialCategory category = ASSEMBLY_CATEGORY.get(service);
        if (category == null) {
            return BigDecimal.ZERO;
        }
        return booking.getBookingMaterials().stream()
                .filter(bm -> bm.getMaterial().getCategory() == category)
                .map(bm -> bm.getMaterial().priceValidOn(booking.getStartDate())
                        .map(MaterialPrice::getAssemblyPrice)
                        .orElse(BigDecimal.ZERO)
                        .multiply(BigDecimal.valueOf(bm.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static int orZero(Integer value) {
        return value != null ? value : 0;
    }

    private static BigDecimal orZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
