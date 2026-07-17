package de.zeltverleih.repository;

import de.zeltverleih.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);

    boolean existsByCustomerNumberAndIdNot(Long customerNumber, Long id);

    List<Client> findTop10ByNameContainingIgnoreCaseOrderByNameAsc(String name);
}
