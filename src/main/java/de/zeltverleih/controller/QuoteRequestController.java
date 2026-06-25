package de.zeltverleih.controller;

import de.zeltverleih.model.datenbank.QuoteRequest;
import de.zeltverleih.repository.QuoteRequestRepository;
import de.zeltverleih.service.QuoteRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/anfragen")
public class QuoteRequestController {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final QuoteRequestRepository repository;
    private final QuoteRequestService quoteRequestService;

    public QuoteRequestController(
            QuoteRequestRepository repository,
            QuoteRequestService quoteRequestService) {
        this.repository = repository;
        this.quoteRequestService = quoteRequestService;
    }

    /** Öffentlich — Kontaktformular auf der Website */
    @PostMapping
    public ResponseEntity<?> receiveQuote(@RequestBody QuoteRequest request) {
        String validationError = validate(request);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(Map.of("error", validationError));
        }

        QuoteRequest saved = quoteRequestService.processIncomingRequest(request);
        return ResponseEntity.ok(Map.of(
                "message", "Anfrage erhalten",
                "id", saved.getId(),
                "clientId", saved.getClientId()));
    }

    /** Mitarbeiter — alle Anfragen, neueste zuerst */
    @GetMapping
    public List<QuoteRequest> getAll() {
        return repository.findAllByOrderByReceivedAtDesc();
    }

    /** Mitarbeiter — Anzahl unbearbeiteter Anfragen (Menü-Badge) */
    @GetMapping("/unprocessed/count")
    public Map<String, Long> countUnprocessed() {
        return Map.of("count", repository.countByProcessedFalse());
    }

    /** Mitarbeiter — einzelne Anfrage */
    @GetMapping("/{id}")
    public ResponseEntity<QuoteRequest> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Mitarbeiter — als bearbeitet markieren */
    @PatchMapping("/{id}/processed")
    public ResponseEntity<?> markProcessed(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return repository.findById(id)
                .map(req -> {
                    req.setProcessed(Boolean.TRUE.equals(body.get("processed")));
                    repository.save(req);
                    return ResponseEntity.ok(req);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String validate(QuoteRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            return "Name ist erforderlich.";
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return "E-Mail ist erforderlich.";
        }
        if (!EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            return "Ungültige E-Mail-Adresse.";
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            return "Telefonnummer ist erforderlich.";
        }
        if (request.getPhone().trim().length() < 6) {
            return "Bitte geben Sie eine gültige Telefonnummer ein.";
        }
        if (request.getEventDate() == null || request.getEventDate().isBlank()) {
            return "Datum der Veranstaltung ist erforderlich.";
        }
        try {
            LocalDate eventDate = LocalDate.parse(request.getEventDate().trim());
            if (eventDate.isBefore(LocalDate.now())) {
                return "Das Datum darf nicht in der Vergangenheit liegen.";
            }
        } catch (DateTimeParseException e) {
            return "Ungültiges Datum.";
        }
        if (request.getGround() == null || request.getGround().isBlank()) {
            return "Untergrund ist erforderlich.";
        }
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return "Nachricht ist erforderlich.";
        }
        if (request.getName().length() > 200) {
            return "Name ist zu lang.";
        }
        if (request.getPhone().length() > 50) {
            return "Telefonnummer ist zu lang.";
        }
        if (request.getMessage().length() > 2000) {
            return "Nachricht ist zu lang.";
        }
        return null;
    }
}
