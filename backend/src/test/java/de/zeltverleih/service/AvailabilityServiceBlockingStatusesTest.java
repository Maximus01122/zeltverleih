package de.zeltverleih.service;

import de.zeltverleih.enums.BookingStatus;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AvailabilityServiceBlockingStatusesTest {

    @Test
    void unprocessedAndRejectedOffersDoNotBlockInventory() {
        assertTrue(AvailabilityService.NON_BLOCKING_STATUSES.contains(BookingStatus.UNPROCESSED));
        assertTrue(AvailabilityService.NON_BLOCKING_STATUSES.contains(BookingStatus.OFFER_REJECTED));
        assertFalse(AvailabilityService.BLOCKING_STATUSES.contains(BookingStatus.UNPROCESSED));
        assertFalse(AvailabilityService.BLOCKING_STATUSES.contains(BookingStatus.OFFER_REJECTED));
    }

    @Test
    void activePipelineStatusesBlockInventory() {
        List<BookingStatus> expectedBlocking = List.of(
                BookingStatus.OFFER_SENT,
                BookingStatus.OFFER_ACCEPTED,
                BookingStatus.PAYMENT_PENDING,
                BookingStatus.COMPLETED
        );
        assertEquals(expectedBlocking, AvailabilityService.BLOCKING_STATUSES);
    }
}
