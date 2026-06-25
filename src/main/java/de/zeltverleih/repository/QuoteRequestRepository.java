package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
    List<QuoteRequest> findAllByOrderByReceivedAtDesc();
    long countByProcessedFalse();
}
