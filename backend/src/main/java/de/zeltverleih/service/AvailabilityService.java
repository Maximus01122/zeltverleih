package de.zeltverleih.service;

import de.zeltverleih.dto.request.AvailabilityCheckRequest;
import de.zeltverleih.dto.request.MaterialLine;
import de.zeltverleih.dto.response.AvailabilityCheckResponse;
import de.zeltverleih.entity.Material;
import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.repository.BookingMaterialRepository;
import de.zeltverleih.repository.MaterialRepository;
import de.zeltverleih.repository.MaterialReservation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    /** Bookings in these states do not reserve inventory (Lager / Verfügbarkeit). */
    public static final Set<BookingStatus> NON_BLOCKING_STATUSES = Set.of(
            BookingStatus.UNPROCESSED,
            BookingStatus.OFFER_REJECTED
    );

    /** All other statuses physically block overlapping stock in the warehouse view. */
    public static final List<BookingStatus> BLOCKING_STATUSES = Arrays.stream(BookingStatus.values())
            .filter(status -> !NON_BLOCKING_STATUSES.contains(status))
            .toList();

    private final BookingMaterialRepository bookingMaterialRepository;
    private final MaterialRepository materialRepository;

    public AvailabilityService(BookingMaterialRepository bookingMaterialRepository,
                               MaterialRepository materialRepository) {
        this.bookingMaterialRepository = bookingMaterialRepository;
        this.materialRepository = materialRepository;
    }

    @Transactional(readOnly = true)
    public AvailabilityCheckResponse check(AvailabilityCheckRequest request) {
        Map<Long, Long> reserved = reservedByMaterial(
                request.startDate(), request.endDate(), request.excludeBookingId());
        Map<Long, Integer> totalCounts = totalCountsByMaterial();

        Map<Long, Long> projected = new HashMap<>(reserved);
        for (MaterialLine line : request.materials()) {
            projected.merge(line.materialId(), (long) line.quantity(), Long::sum);
        }

        TentDemand tentDemand = tentDemandFrom(reserved);
        boolean tentFeasible = TentCompositionRules.isFeasible(
                projected.getOrDefault(TentCompositionRules.TENT_4X6, 0L),
                projected.getOrDefault(TentCompositionRules.TENT_4X8, 0L),
                projected.getOrDefault(TentCompositionRules.TENT_4X2, 0L),
                projected.getOrDefault(TentCompositionRules.TENT_4X10, 0L));
        boolean poolFeasible = SharedMaterialPoolRules.isFeasible(projected, totalCounts);

        List<AvailabilityCheckResponse.MaterialAvailability> results = request.materials().stream()
                .map(line -> toAvailability(line, reserved, tentDemand, totalCounts, tentFeasible, poolFeasible))
                .toList();

        boolean allSufficient = results.stream()
                .allMatch(AvailabilityCheckResponse.MaterialAvailability::sufficient);

        return new AvailabilityCheckResponse(allSufficient, results);
    }

    /** Available units per material for the given period: totalCount minus blocked reservations. */
    @Transactional(readOnly = true)
    public Map<Long, Integer> availableByMaterial(LocalDate startDate, LocalDate endDate) {
        Map<Long, Long> reserved = reservedByMaterial(startDate, endDate, null);
        TentDemand tentDemand = tentDemandFrom(reserved);
        Map<Long, Integer> totalCounts = totalCountsByMaterial();

        return materialRepository.findAll().stream()
                .collect(Collectors.toMap(
                        Material::getId,
                        m -> effectiveAvailable(m.getId(), m.getTotalCount(), tentDemand, totalCounts, reserved)
                ));
    }

    private Map<Long, Long> reservedByMaterial(LocalDate startDate, LocalDate endDate, Long excludeBookingId) {
        List<MaterialReservation> reservations = excludeBookingId == null
                ? bookingMaterialRepository.sumReservedByMaterial(startDate, endDate, BLOCKING_STATUSES)
                : bookingMaterialRepository.sumReservedByMaterialExcluding(startDate, endDate, BLOCKING_STATUSES, excludeBookingId);
        return reservations.stream()
                .collect(Collectors.toMap(MaterialReservation::materialId, MaterialReservation::reserved));
    }

    private Map<Long, Integer> totalCountsByMaterial() {
        return materialRepository.findAll().stream()
                .collect(Collectors.toMap(Material::getId, Material::getTotalCount));
    }

    private AvailabilityCheckResponse.MaterialAvailability toAvailability(
            MaterialLine line,
            Map<Long, Long> reserved,
            TentDemand existingTentDemand,
            Map<Long, Integer> totalCounts,
            boolean tentFeasible,
            boolean poolFeasible) {
        Material material = materialRepository.findById(line.materialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material %d not found".formatted(line.materialId())));

        if (TentCompositionRules.isCompositionMaterial(material.getId())) {
            int available = TentCompositionRules.availableFor(
                    material.getId(),
                    existingTentDemand.direct4x6(),
                    existingTentDemand.direct4x8(),
                    existingTentDemand.direct4x2(),
                    existingTentDemand.tents4x10());
            return new AvailabilityCheckResponse.MaterialAvailability(
                    material.getId(), material.getName(), line.quantity(), available, tentFeasible);
        }

        if (SharedMaterialPoolRules.isPoolMaterial(material.getId())) {
            int available = SharedMaterialPoolRules.availableFor(material.getId(), reserved, totalCounts);
            return new AvailabilityCheckResponse.MaterialAvailability(
                    material.getId(), material.getName(), line.quantity(), available, poolFeasible);
        }

        int available = material.getTotalCount() - reserved.getOrDefault(material.getId(), 0L).intValue();
        return new AvailabilityCheckResponse.MaterialAvailability(
                material.getId(), material.getName(), line.quantity(), available,
                line.quantity() <= available);
    }

    private int effectiveAvailable(
            long materialId,
            int totalCount,
            TentDemand tentDemand,
            Map<Long, Integer> totalCounts,
            Map<Long, Long> reserved) {
        if (TentCompositionRules.isCompositionMaterial(materialId)) {
            return TentCompositionRules.availableFor(
                    materialId,
                    tentDemand.direct4x6(),
                    tentDemand.direct4x8(),
                    tentDemand.direct4x2(),
                    tentDemand.tents4x10());
        }
        if (SharedMaterialPoolRules.isPoolMaterial(materialId)) {
            return SharedMaterialPoolRules.availableFor(materialId, reserved, totalCounts);
        }
        return (int) (totalCount - tentDemand.reservedOrZero(materialId));
    }

    private TentDemand tentDemandFrom(Map<Long, Long> reserved) {
        return new TentDemand(
                reserved.getOrDefault(TentCompositionRules.TENT_4X6, 0L),
                reserved.getOrDefault(TentCompositionRules.TENT_4X8, 0L),
                reserved.getOrDefault(TentCompositionRules.TENT_4X2, 0L),
                reserved.getOrDefault(TentCompositionRules.TENT_4X10, 0L),
                reserved
        );
    }

    private record TentDemand(
            long direct4x6,
            long direct4x8,
            long direct4x2,
            long tents4x10,
            Map<Long, Long> reserved
    ) {
        long reservedOrZero(long materialId) {
            return reserved.getOrDefault(materialId, 0L);
        }
    }
}
