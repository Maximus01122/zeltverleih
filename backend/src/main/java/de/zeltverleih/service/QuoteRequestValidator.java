package de.zeltverleih.service;

import de.zeltverleih.dto.request.QuoteRequestSubmission;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Server-side re-validation of the public contact form. Messages are German
 * because the website displays them directly to visitors.
 */
@Component
public class QuoteRequestValidator {

    private static final Pattern EMAIL =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final int MAX_NAME_LENGTH = 200;
    private static final int MAX_PHONE_LENGTH = 50;
    private static final int MAX_FIELD_LENGTH = 255;
    private static final int MAX_SERVICE_LENGTH = 200;
    private static final int MAX_MESSAGE_LENGTH = 2000;
    private static final int MAX_ACCESSORIES_LENGTH = 4000;

    /** Returns the first validation error, or empty if the submission is valid. */
    public Optional<String> validate(QuoteRequestSubmission s) {
        if (isBlank(s.name())) {
            return Optional.of("Name ist erforderlich.");
        }
        if (s.name().length() > MAX_NAME_LENGTH) {
            return Optional.of("Name ist zu lang.");
        }
        if (isBlank(s.email())) {
            return Optional.of("E-Mail ist erforderlich.");
        }
        if (!EMAIL.matcher(s.email().trim()).matches()) {
            return Optional.of("Ungültige E-Mail-Adresse.");
        }
        if (isBlank(s.phone())) {
            return Optional.of("Telefonnummer ist erforderlich.");
        }
        if (s.phone().trim().length() < 6) {
            return Optional.of("Bitte geben Sie eine gültige Telefonnummer ein.");
        }
        if (s.phone().length() > MAX_PHONE_LENGTH) {
            return Optional.of("Telefonnummer ist zu lang.");
        }
        if (s.eventDate() == null) {
            return Optional.of("Datum der Veranstaltung ist erforderlich.");
        }
        if (s.eventDate().isBefore(LocalDate.now())) {
            return Optional.of("Das Datum darf nicht in der Vergangenheit liegen.");
        }
        if (isBlank(s.ground())) {
            return Optional.of("Untergrund ist erforderlich.");
        }
        if (isBlank(s.servicePackage())) {
            return Optional.of("Gewünschter Service ist erforderlich.");
        }
        if (s.servicePackage().length() > MAX_SERVICE_LENGTH) {
            return Optional.of("Service-Auswahl ist zu lang.");
        }
        if (!Boolean.TRUE.equals(s.dataProcessingConsent())) {
            return Optional.of("Bitte bestätigen Sie die Einwilligung zur Datenverarbeitung.");
        }
        if (tooLong(s.eventType()) || tooLong(s.tentSize())
                || tooLong(s.ground()) || tooLong(s.deliveryPostalCode()) || tooLong(s.deliveryCity())) {
            return Optional.of("Eingabe zu lang (max. %d Zeichen pro Feld)".formatted(MAX_FIELD_LENGTH));
        }
        if (s.message() != null && s.message().length() > MAX_MESSAGE_LENGTH) {
            return Optional.of("Nachricht ist zu lang.");
        }
        if (s.accessories() != null && s.accessories().length() > MAX_ACCESSORIES_LENGTH) {
            return Optional.of("Warenkorb / Zubehör ist zu lang.");
        }
        return Optional.empty();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean tooLong(String value) {
        return value != null && value.length() > MAX_FIELD_LENGTH;
    }
}
