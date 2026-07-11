package de.zeltverleih.dto.response;

import java.math.BigDecimal;

public record DocumentItemView(
        String description,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {}
