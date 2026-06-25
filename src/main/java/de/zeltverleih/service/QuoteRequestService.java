package de.zeltverleih.service;

import de.zeltverleih.model.datenbank.Address;
import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.model.datenbank.QuoteRequest;
import de.zeltverleih.repository.ClientRepository;
import de.zeltverleih.repository.QuoteRequestRepository;
import de.zeltverleih.service.email.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class QuoteRequestService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final ClientRepository clientRepository;
    private final EmailService emailService;

    public QuoteRequestService(
            QuoteRequestRepository quoteRequestRepository,
            ClientRepository clientRepository,
            EmailService emailService) {
        this.quoteRequestRepository = quoteRequestRepository;
        this.clientRepository = clientRepository;
        this.emailService = emailService;
    }

    @Transactional
    public QuoteRequest processIncomingRequest(QuoteRequest request) {
        request.setReceivedAt(LocalDateTime.now());
        request.setProcessed(false);

        Client client = findOrCreateClient(request);
        request.setClientId(client.getId());

        QuoteRequest saved = quoteRequestRepository.save(request);
        emailService.sendQuoteNotification(saved, client.getId());
        return saved;
    }

    private Client findOrCreateClient(QuoteRequest request) {
        String email = request.getEmail().trim();
        Optional<Client> existing = clientRepository.findByEmailIgnoreCase(email);

        if (existing.isPresent()) {
            Client client = existing.get();
            client.setName(request.getName().trim());
            client.setPhoneNumber(trimOrEmpty(request.getPhone()));
            applyDeliveryAddress(client, request);
            return clientRepository.save(client);
        }

        Client client = new Client();
        client.setName(request.getName().trim());
        client.setEmail(email);
        client.setPhoneNumber(trimOrEmpty(request.getPhone()));
        client.setCustomerNumber(0L);

        Address address = new Address();
        address.setStreet("");
        address.setHouseNumber("");
        address.setPostalCode(trimOrEmpty(request.getDeliveryPostalCode()));
        address.setCity(trimOrEmpty(request.getDeliveryCity()));
        client.setAddress(address);

        return clientRepository.save(client);
    }

    private void applyDeliveryAddress(Client client, QuoteRequest request) {
        Address address = client.getAddress();
        if (address == null) {
            address = new Address();
            address.setStreet("");
            address.setHouseNumber("");
            client.setAddress(address);
        }
        if (request.getDeliveryPostalCode() != null && !request.getDeliveryPostalCode().isBlank()) {
            address.setPostalCode(request.getDeliveryPostalCode().trim());
        }
        if (request.getDeliveryCity() != null && !request.getDeliveryCity().isBlank()) {
            address.setCity(request.getDeliveryCity().trim());
        }
    }

    private String trimOrEmpty(String value) {
        return value != null ? value.trim() : "";
    }
}
