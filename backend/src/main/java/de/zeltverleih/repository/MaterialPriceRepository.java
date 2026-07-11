package de.zeltverleih.repository;

import de.zeltverleih.entity.MaterialPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface MaterialPriceRepository extends JpaRepository<MaterialPrice, Long> {

    @Query("""
            SELECT mp FROM MaterialPrice mp
            WHERE mp.material.id = :materialId AND mp.validFrom <= :date
            ORDER BY mp.validFrom DESC
            LIMIT 1
            """)
    Optional<MaterialPrice> findEffectivePrice(
            @Param("materialId") Long materialId,
            @Param("date") LocalDate date
    );
}
