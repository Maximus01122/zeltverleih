package de.zeltverleih.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record InvoiceResponse(
        Long id,
        Long bookingId,
        String invoiceNumber,
        LocalDate invoiceDate,
        LocalDate serviceDate,
        LocalDate dueDate,
        List<DocumentItemView> items,
        BigDecimal netTotal,
        BigDecimal vatTotal,
        BigDecimal grossTotal
) {}
