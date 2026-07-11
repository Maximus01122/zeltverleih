package de.zeltverleih.repository;

import de.zeltverleih.entity.DeliveryFee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryFeeRepository extends JpaRepository<DeliveryFee, Long> {
}
