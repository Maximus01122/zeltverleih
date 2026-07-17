package de.zeltverleih.dto.response;

import de.zeltverleih.enums.MaterialCategory;

import java.math.BigDecimal;

/** Public website catalog entry — no stock counts or price history. */
public record CatalogMaterialResponse(
        Long id,
        String name,
        MaterialCategory category,
        BigDecimal dailyPrice,
        BigDecimal weekendPrice,
        BigDecimal assemblyPrice
) {}
