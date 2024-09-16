package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.Booking;
import de.zeltverleih.model.datenbank.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClient(Client client);

    List<Booking> findByDateDetailsStartDate(LocalDate startDate);

    @Query("SELECT b FROM Booking b " +
            "WHERE b.dateDetails.startDate <= :endDate AND b.dateDetails.endDate >= :startDate")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT Year(b.dateDetails.startDate), count (*) from Booking b where b.status =?1 group by Year(b.dateDetails.startDate)")
    List<int[]> countBuchungByStatusEquals(String status);

    @Query("SELECT year(b.dateDetails.startDate), monthname(b.dateDetails.startDate), count(*) from Booking b group by year(b.dateDetails.startDate), month(b.dateDetails.startDate)")
    List<Object[]> countBuchungPerMonthPerYear();

    @Query("SELECT b FROM Booking b ORDER BY b.dateDetails.startDate ASC, b.dateDetails.endDate ASC")
    List<Booking> findAllOrderByStartDateAndEndDate();
}
