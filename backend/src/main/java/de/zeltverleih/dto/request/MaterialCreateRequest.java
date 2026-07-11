package de.zeltverleih.dto.request;

import de.zeltverleih.enums.MaterialCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MaterialCreateRequest(
        @NotBlank String name,
        @NotNull MaterialCategory category,
        @Min(0) int totalCount,
        @NotNull @PositiveOrZero BigDecimal dailyPrice,
        @NotNull @PositiveOrZero BigDecimal weekendPrice,
        @NotNull @PositiveOrZero BigDecimal assemblyPrice,
        LocalDate validFrom
) {}
