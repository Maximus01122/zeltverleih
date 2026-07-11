package de.zeltverleih.dto.request;

import java.time.LocalDate;

/**
 * Payload of the public website contact form (POST /api/anfragen).
 * Deliberately without Bean Validation annotations: the website expects
 * validation errors as {"error": "<german message>"} — handled by
 * QuoteRequestValidator so visitors get readable messages.
 */
public record QuoteRequestSubmission(
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
        String message,
        Boolean dataProcessingConsent
) {}
