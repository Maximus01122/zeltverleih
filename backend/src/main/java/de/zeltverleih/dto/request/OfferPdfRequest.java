package de.zeltverleih.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OfferPdfRequest(
        @Valid @NotNull OfferConditionsRequest conditions,
        @NotEmpty List<@Valid ItemLineRequest> items
) {}
