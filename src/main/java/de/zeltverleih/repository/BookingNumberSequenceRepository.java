package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.ClientNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientNumberSequenceRepository extends JpaRepository<ClientNumberSequence, Long> {
}
