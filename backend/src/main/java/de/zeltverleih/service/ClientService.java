package de.zeltverleih.service;

import de.zeltverleih.dto.request.BookingRequest;
import de.zeltverleih.dto.response.ClientSearchResponse;
import de.zeltverleih.entity.Address;
import de.zeltverleih.entity.Client;
import de.zeltverleih.exception.ConflictException;
import de.zeltverleih.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final SequenceService sequenceService;

    public ClientService(ClientRepository clientRepository, SequenceService sequenceService) {
        this.clientRepository = clientRepository;
        this.sequenceService = sequenceService;
    }

    /**
     * Matches clients by email: existing clients are updated in place,
     * unknown emails create a new client with a fresh customer number.
     * Without an email there is no reliable key, so a new client is created.
     */
    @Transactional
    public Client findOrCreate(BookingRequest.ClientData data) {
        return findExistingByEmail(data.email())
                .map(existing -> update(existing, data))
                .orElseGet(() -> create(data));
    }

    private Optional<Client> findExistingByEmail(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return clientRepository.findByEmail(email);
    }

    private Client update(Client client, BookingRequest.ClientData data) {
        client.setName(data.name());
        client.setPhoneNumber(data.phoneNumber());
        client.setAddress(toAddress(data));
        return client;
    }

    private Client create(BookingRequest.ClientData data) {
        // Empty string would collide on the unique email constraint — store null instead.
        String email = data.email() == null || data.email().isBlank() ? null : data.email();
        Client client = new Client(sequenceService.nextCustomerNumber(),
                data.name(), email, data.phoneNumber(), toAddress(data));
        return clientRepository.save(client);
    }

    /**
     * Client resolution for incoming website quote requests: existing clients
     * are returned untouched (form input is unverified and must not overwrite
     * booking data), unknown emails create a new client without an address —
     * it is completed when the client actually books.
     */
    @Transactional
    public Client findOrCreateForQuote(String name, String email, String phone) {
        return clientRepository.findByEmail(email)
                .orElseGet(() -> clientRepository.save(
                        new Client(sequenceService.nextCustomerNumber(), name, email, phone, null)));
    }

    private Address toAddress(BookingRequest.ClientData data) {
        return new Address(data.street(), data.houseNumber(), data.postalCode(), data.city());
    }

    @Transactional
    public void updateCustomerNumber(Client client, long newNumber) {
        if (client.getCustomerNumber() != null && client.getCustomerNumber() == newNumber) {
            return;
        }
        if (clientRepository.existsByCustomerNumberAndIdNot(newNumber, client.getId())) {
            throw new ConflictException("Kundennummer %d ist bereits vergeben".formatted(newNumber));
        }
        client.setCustomerNumber(newNumber);
        sequenceService.ensureCustomerSequenceAbove(newNumber);
    }

    /**
     * Default for the invoice form: existing number for known clients (matched by email),
     * otherwise the next free customer number.
     */
    @Transactional(readOnly = true)
    public long suggestedCustomerNumberForInvoice(Client client) {
        if (client.getEmail() != null && !client.getEmail().isBlank()
                && clientRepository.findByEmail(client.getEmail()).isPresent()) {
            return client.getCustomerNumber();
        }
        if (client.getCustomerNumber() != null) {
            return client.getCustomerNumber();
        }
        return sequenceService.peekNextCustomerNumber();
    }

    @Transactional(readOnly = true)
    public List<ClientSearchResponse> searchByName(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        return clientRepository.findTop10ByNameContainingIgnoreCaseOrderByNameAsc(query.trim())
                .stream()
                .map(this::toSearchResponse)
                .toList();
    }

    private ClientSearchResponse toSearchResponse(Client client) {
        Address address = client.getAddress();
        return new ClientSearchResponse(
                client.getId(),
                String.valueOf(client.getCustomerNumber()),
                client.getName(),
                client.getEmail(),
                client.getPhoneNumber(),
                address != null ? address.getStreet() : null,
                address != null ? address.getHouseNumber() : null,
                address != null ? address.getPostalCode() : null,
                address != null ? address.getCity() : null
        );
    }
}
