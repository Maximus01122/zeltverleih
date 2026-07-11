package de.zeltverleih.dto.request;

import de.zeltverleih.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record StatusChangeRequest(@NotNull BookingStatus status) {}
