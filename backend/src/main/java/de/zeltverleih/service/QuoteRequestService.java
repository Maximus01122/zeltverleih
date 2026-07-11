package de.zeltverleih.service;

import de.zeltverleih.dto.request.QuoteRequestSubmission;
import de.zeltverleih.dto.response.QuoteRequestResponse;
import de.zeltverleih.entity.Client;
import de.zeltverleih.entity.QuoteRequest;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.mapper.QuoteRequestMapper;
import de.zeltverleih.repository.QuoteRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuoteRequestService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final ClientService clientService;
    private final EmailService emailService;
    private final QuoteRequestMapper mapper;

    public QuoteRequestService(QuoteRequestRepository quoteRequestRepository,
                               ClientService clientService,
                               EmailService emailService,
                               QuoteRequestMapper mapper) {
        this.quoteRequestRepository = quoteRequestRepository;
        this.clientService = clientService;
        this.emailService = emailService;
        this.mapper = mapper;
    }

    @Transactional
    public QuoteRequestResponse processIncoming(QuoteRequestSubmission submission) {
        Client client = clientService.findOrCreateForQuote(
                submission.name(), submission.email(), submission.phone());

        QuoteRequest quote = new QuoteRequest();
        quote.setReceivedAt(LocalDateTime.now());
        quote.setProcessed(false);
        quote.setClient(client);
        quote.setName(submission.name());
        quote.setEmail(submission.email());
        quote.setPhone(submission.phone());
        quote.setEventType(submission.eventType());
        quote.setEventDate(submission.eventDate());
        quote.setGuestCount(submission.guestCount());
        quote.setTentCount(submission.tentCount());
        quote.setTentSize(submission.tentSize());
        quote.setDeliveryPostalCode(submission.deliveryPostalCode());
        quote.setDeliveryCity(submission.deliveryCity());
        quote.setServicePackage(submission.servicePackage());
        quote.setAccessories(submission.accessories());
        quote.setCartJson(submission.cartJson());
        quote.setGround(submission.ground());
        quote.setMessage(submission.message());
        quote.setDataProcessingConsent(Boolean.TRUE.equals(submission.dataProcessingConsent()));

        QuoteRequest saved = quoteRequestRepository.save(quote);

        // Mail failures are logged inside EmailService and never fail the request
        emailService.sendQuoteRequestNotification(saved);
        emailService.sendQuoteRequestConfirmation(saved);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<QuoteRequestResponse> list() {
        return quoteRequestRepository.findAllByOrderByReceivedAtDesc().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnprocessed() {
        return quoteRequestRepository.countByProcessedFalse();
    }

    @Transactional
    public QuoteRequestResponse setProcessed(Long id, boolean processed) {
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote request %d not found".formatted(id)));
        quote.setProcessed(processed);
        return mapper.toResponse(quote);
    }

    @Transactional
    public void delete(Long id) {
        if (!quoteRequestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quote request %d not found".formatted(id));
        }
        quoteRequestRepository.deleteById(id);
    }
}
