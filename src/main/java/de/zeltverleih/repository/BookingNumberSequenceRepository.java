package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.BookingNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingNumberSequenceRepository extends JpaRepository<BookingNumberSequence, Long> {
}
