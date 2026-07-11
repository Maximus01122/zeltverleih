package de.zeltverleih.repository;

import de.zeltverleih.entity.Booking;
import de.zeltverleih.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT b FROM Booking b JOIN FETCH b.client
            WHERE b.endDate >= :from AND b.startDate <= :to
            ORDER BY b.startDate DESC
            """)
    List<Booking> findAllIntersecting(@Param("from") LocalDate from, @Param("to") LocalDate to);

    /** Completed bookings whose event falls in the given range (dashboard "Buchungen" tab). */
    long countByStatusAndStartDateBetween(BookingStatus status, LocalDate from, LocalDate to);

    boolean existsByLoadingFeeId(Long loadingFeeId);
}
