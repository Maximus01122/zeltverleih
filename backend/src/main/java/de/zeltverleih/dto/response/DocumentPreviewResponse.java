package de.zeltverleih.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DocumentPreviewResponse(
        List<DocumentItemView> items,
        BigDecimal netTotal,
        BigDecimal vatTotal,
        BigDecimal grossTotal
) {}
