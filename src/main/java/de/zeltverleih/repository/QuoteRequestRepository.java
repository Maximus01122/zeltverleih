package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
}
