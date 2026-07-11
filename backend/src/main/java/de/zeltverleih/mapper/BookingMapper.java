package de.zeltverleih.mapper;

import de.zeltverleih.dto.response.BookingResponse;
import de.zeltverleih.dto.response.BookingSummaryResponse;
import de.zeltverleih.entity.Address;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.Client;
import de.zeltverleih.entity.LoadingFee;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getStatus(),
                toClientView(booking.getClient()),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getOfferDate(),
                booking.getValidUntil(),
                booking.getCountDailyRent(),
                booking.getCountWeekendRent(),
                booking.getDeliveryCosts(),
                toLoadingFeeView(booking.getLoadingFee()),
                booking.getComment(),
                toMaterialLines(booking),
                Set.copyOf(booking.getServices())
        );
    }

    public BookingSummaryResponse toSummary(Booking booking) {
        return new BookingSummaryResponse(
                booking.getId(),
                booking.getClient().getName(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getOfferDate(),
                booking.getStatus()
        );
    }

    private BookingResponse.ClientView toClientView(Client client) {
        Address address = client.getAddress();
        return new BookingResponse.ClientView(
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

    private BookingResponse.LoadingFeeView toLoadingFeeView(LoadingFee fee) {
        if (fee == null) {
            return null;
        }
        return new BookingResponse.LoadingFeeView(fee.getId(), fee.getName(), fee.getPrice());
    }

    private List<BookingResponse.MaterialLineView> toMaterialLines(Booking booking) {
        return booking.getBookingMaterials().stream()
                .map(bm -> new BookingResponse.MaterialLineView(
                        bm.getMaterial().getId(),
                        bm.getMaterial().getName(),
                        bm.getQuantity()
                ))
                .toList();
    }
}
