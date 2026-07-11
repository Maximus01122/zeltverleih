package de.zeltverleih.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record OfferConditionsRequest(
        @Min(0) int countDailyRent,
        @Min(0) int countWeekendRent,
        BigDecimal deliveryCosts,
        @NotNull LocalDate validUntil
) {}
