package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.model.datenbank.ClientNumberSequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByName(String name);
}
