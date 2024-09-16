package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}

