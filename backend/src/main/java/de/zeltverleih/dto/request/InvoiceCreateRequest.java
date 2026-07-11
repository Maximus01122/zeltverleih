package de.zeltverleih.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record InvoiceCreateRequest(
        @NotNull @Min(1) Long customerNumber,
        @NotNull LocalDate invoiceDate,
        @NotNull LocalDate serviceDate,
        @NotNull LocalDate dueDate,
        @NotEmpty List<@Valid ItemLineRequest> items
) {}
