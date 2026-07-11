package de.zeltverleih.dto.response;

import de.zeltverleih.enums.MaterialCategory;

public record MaterialAvailabilityResponse(
        Long materialId,
        String name,
        MaterialCategory category,
        int totalCount,
        int available
) {}
