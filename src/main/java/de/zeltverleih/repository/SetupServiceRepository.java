package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.SetupService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SetupServiceRepository extends JpaRepository<SetupService, Long> {
}
