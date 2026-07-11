package de.zeltverleih.repository;

import de.zeltverleih.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByBookingId(Long bookingId);
    boolean existsByInvoiceNumber(String invoiceNumber);

    /** All invoices with items + booking eagerly loaded for dashboard aggregation. */
    @Query("SELECT DISTINCT i FROM Invoice i JOIN FETCH i.booking JOIN FETCH i.items")
    List<Invoice> findAllWithBookingAndItems();
}
