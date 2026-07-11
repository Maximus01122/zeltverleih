package de.zeltverleih.dto.response;

import java.util.List;

public record AvailabilityCheckResponse(
        boolean available,
        List<MaterialAvailability> materials
) {
    public record MaterialAvailability(
            Long materialId,
            String materialName,
            int requested,
            int available,
            boolean sufficient
    ) {}
}
