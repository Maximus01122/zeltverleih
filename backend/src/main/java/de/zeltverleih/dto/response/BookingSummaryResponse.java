package de.zeltverleih.dto.response;

import de.zeltverleih.enums.BookingStatus;

import java.time.LocalDate;

public record BookingSummaryResponse(
        Long id,
        String clientName,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate offerDate,
        BookingStatus status
) {}
