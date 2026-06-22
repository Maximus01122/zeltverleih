package de.zeltverleih.controller;

import de.zeltverleih.model.datenbank.QuoteRequest;
import de.zeltverleih.repository.QuoteRequestRepository;
import de.zeltverleih.service.email.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anfragen")
@CrossOrigin(origins = "*")
public class QuoteRequestController {

    private final QuoteRequestRepository repository;
    private final EmailService emailService;

    public QuoteRequestController(QuoteRequestRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<String> receiveQuote(@RequestBody QuoteRequest request) {
        repository.save(request);
        emailService.sendQuoteNotification(request);
        return ResponseEntity.ok("Anfrage erhalten");
    }
}
