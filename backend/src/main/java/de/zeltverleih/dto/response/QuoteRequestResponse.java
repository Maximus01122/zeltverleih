package de.zeltverleih.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record QuoteRequestResponse(
        Long id,
        LocalDateTime receivedAt,
        boolean processed,
        Long clientId,
        String name,
        String email,
        String phone,
        String eventType,
        LocalDate eventDate,
        String guestCount,
        String tentCount,
        String tentSize,
        String deliveryPostalCode,
        String deliveryCity,
        String servicePackage,
        String accessories,
        String cartJson,
        String ground,
        String message
) {}
