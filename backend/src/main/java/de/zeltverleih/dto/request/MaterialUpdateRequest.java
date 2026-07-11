package de.zeltverleih.dto.request;

import de.zeltverleih.enums.MaterialCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MaterialUpdateRequest(
        @NotBlank String name,
        @NotNull MaterialCategory category,
        @Min(0) int totalCount
) {}
