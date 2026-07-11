package de.zeltverleih.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MaterialLine(
        @NotNull Long materialId,
        @Min(1) int quantity
) {}
