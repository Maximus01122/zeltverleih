package de.zeltverleih.dto.response;

import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.enums.SetupService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record BookingResponse(
        Long id,
        BookingStatus status,
        ClientView client,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate offerDate,
        LocalDate validUntil,
        Integer countDailyRent,
        Integer countWeekendRent,
        BigDecimal deliveryCosts,
        LoadingFeeView loadingFee,
        String comment,
        List<MaterialLineView> materials,
        Set<SetupService> services
) {
    public record ClientView(
            Long id,
            String customerNumber,
            String name,
            String email,
            String phoneNumber,
            String street,
            String houseNumber,
            String postalCode,
            String city
    ) {}

    public record MaterialLineView(Long materialId, String materialName, int quantity) {}

    public record LoadingFeeView(Long id, String name, BigDecimal price) {}
}
