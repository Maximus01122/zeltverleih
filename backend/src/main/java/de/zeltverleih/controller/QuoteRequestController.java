package de.zeltverleih.controller;

import de.zeltverleih.dto.request.QuoteRequestSubmission;
import de.zeltverleih.dto.response.QuoteRequestResponse;
import de.zeltverleih.service.QuoteRequestService;
import de.zeltverleih.service.QuoteRequestValidator;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/anfragen")
public class QuoteRequestController {

    private final QuoteRequestService quoteRequestService;
    private final QuoteRequestValidator validator;

    public QuoteRequestController(QuoteRequestService quoteRequestService, QuoteRequestValidator validator) {
        this.quoteRequestService = quoteRequestService;
        this.validator = validator;
    }

    /**
     * Public endpoint for the website contact form. The response format
     * ({message, id, clientId} / {"error": ...}) is the contract the live
     * website already implements — do not change it without changing the site.
     */
    @PostMapping
    public ResponseEntity<?> receive(@RequestBody QuoteRequestSubmission submission) {
        Optional<String> validationError = validator.validate(submission);
        if (validationError.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", validationError.get()));
        }

        QuoteRequestResponse saved = quoteRequestService.processIncoming(submission);
        return ResponseEntity.ok(Map.of(
                "message", "Anfrage erhalten",
                "id", saved.id(),
                "clientId", saved.clientId()));
    }

    // --- Admin (JWT required) ---

    @GetMapping
    public List<QuoteRequestResponse> list() {
        return quoteRequestService.list();
    }

    @GetMapping("/unprocessed/count")
    public Map<String, Long> unprocessedCount() {
        return Map.of("count", quoteRequestService.countUnprocessed());
    }

    public record ProcessedUpdateRequest(@NotNull Boolean processed) {}

    @PatchMapping("/{id}/processed")
    public QuoteRequestResponse setProcessed(@PathVariable Long id,
                                             @RequestBody ProcessedUpdateRequest request) {
        return quoteRequestService.setProcessed(id, Boolean.TRUE.equals(request.processed()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quoteRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
