package de.zeltverleih.repository;

import de.zeltverleih.entity.BookingMaterial;
import de.zeltverleih.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingMaterialRepository extends JpaRepository<BookingMaterial, Long> {

    @Query("""
            SELECT new de.zeltverleih.repository.MaterialReservation(bm.material.id, SUM(bm.quantity))
            FROM BookingMaterial bm
            WHERE bm.booking.startDate <= :endDate AND bm.booking.endDate >= :startDate
            AND bm.booking.status IN :statuses
            GROUP BY bm.material.id
            """)
    List<MaterialReservation> sumReservedByMaterial(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<BookingStatus> statuses
    );

    @Query("""
            SELECT new de.zeltverleih.repository.MaterialReservation(bm.material.id, SUM(bm.quantity))
            FROM BookingMaterial bm
            WHERE bm.booking.startDate <= :endDate AND bm.booking.endDate >= :startDate
            AND bm.booking.status IN :statuses
            AND bm.booking.id <> :excludeBookingId
            GROUP BY bm.material.id
            """)
    List<MaterialReservation> sumReservedByMaterialExcluding(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("excludeBookingId") Long excludeBookingId
    );
}
