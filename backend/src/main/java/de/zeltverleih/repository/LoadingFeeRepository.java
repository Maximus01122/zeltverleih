package de.zeltverleih.repository;

import de.zeltverleih.entity.LoadingFee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoadingFeeRepository extends JpaRepository<LoadingFee, Long> {
}
