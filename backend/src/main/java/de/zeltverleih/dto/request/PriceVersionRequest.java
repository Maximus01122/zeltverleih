package de.zeltverleih.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PriceVersionRequest(
        @NotNull @PositiveOrZero BigDecimal dailyPrice,
        @NotNull @PositiveOrZero BigDecimal weekendPrice,
        @NotNull @PositiveOrZero BigDecimal assemblyPrice,
        @NotNull LocalDate validFrom
) {}
