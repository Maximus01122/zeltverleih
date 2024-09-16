package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.LoadingFee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoadingFeeRepository extends JpaRepository<LoadingFee, Long> {
}
