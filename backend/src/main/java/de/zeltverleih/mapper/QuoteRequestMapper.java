package de.zeltverleih.mapper;

import de.zeltverleih.dto.response.QuoteRequestResponse;
import de.zeltverleih.entity.QuoteRequest;
import org.springframework.stereotype.Component;

@Component
public class QuoteRequestMapper {

    public QuoteRequestResponse toResponse(QuoteRequest quote) {
        return new QuoteRequestResponse(
                quote.getId(),
                quote.getReceivedAt(),
                quote.isProcessed(),
                quote.getClient() != null ? quote.getClient().getId() : null,
                quote.getName(),
                quote.getEmail(),
                quote.getPhone(),
                quote.getEventType(),
                quote.getEventDate(),
                quote.getGuestCount(),
                quote.getTentCount(),
                quote.getTentSize(),
                quote.getDeliveryPostalCode(),
                quote.getDeliveryCity(),
                quote.getServicePackage(),
                quote.getAccessories(),
                quote.getCartJson(),
                quote.getGround(),
                quote.getMessage()
        );
    }
}
