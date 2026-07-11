package de.zeltverleih.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ItemLineRequest(
        @NotBlank String description,
        @NotNull @Positive BigDecimal quantity,
        @NotNull BigDecimal unitPrice
) {}
