package de.zeltverleih.dto.response;

import de.zeltverleih.enums.MaterialCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record MaterialResponse(
        Long id,
        String name,
        MaterialCategory category,
        int totalCount,
        PriceView currentPrice,
        List<PriceView> priceHistory
) {
    public record PriceView(
            Long id,
            BigDecimal dailyPrice,
            BigDecimal weekendPrice,
            BigDecimal assemblyPrice,
            LocalDate validFrom
    ) {}
}
