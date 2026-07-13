package de.zeltverleih.service;

import de.zeltverleih.entity.Address;
import de.zeltverleih.entity.Client;
import de.zeltverleih.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ZugferdInvoiceMapperTest {

    private ZugferdInvoiceMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new ZugferdInvoiceMapper(
                new de.zeltverleih.config.CompanyProperties(
                        "Zeltverleih Erfurt", "Ludwig Fuchs", "Lützewiesenweg 18",
                        "99098", "Erfurt", "0176", "info@example.de", "www.example.de",
                        "Bank", "10010010", "123", "Zeltverleih", "DE03100100100068248146",
                        "PBNKDEFF", "DE356901873"),
                new de.zeltverleih.config.EInvoiceProperties(
                        "EN16931", 2, "DE", "DE", "C62"));
    }

    @Test
    void validateBuyerForEInvoice_acceptsCompleteAddress() {
        Client client = completeClient();
        assertDoesNotThrow(() -> mapper.validateBuyerForEInvoice(client));
    }

    @Test
    void validateBuyerForEInvoice_rejectsMissingStreet() {
        Client client = completeClient();
        client.getAddress().setStreet("  ");
        BadRequestException ex = assertThrows(
                BadRequestException.class, () -> mapper.validateBuyerForEInvoice(client));
        assertTrue(ex.getMessage().contains("Straße"));
    }

    @Test
    void validateBuyerForEInvoice_rejectsMissingCity() {
        Client client = completeClient();
        client.getAddress().setCity(null);
        BadRequestException ex = assertThrows(
                BadRequestException.class, () -> mapper.validateBuyerForEInvoice(client));
        assertTrue(ex.getMessage().contains("Ort"));
    }

    private static Client completeClient() {
        Address address = new Address("Musterstraße", "12", "99084", "Erfurt");
        Client client = new Client(1001L, "Max Mustermann", "max@example.de", null, address);
        return client;
    }
}
