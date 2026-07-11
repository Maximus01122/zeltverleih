package de.zeltverleih.repository;

import de.zeltverleih.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("SELECT DISTINCT m FROM Material m LEFT JOIN FETCH m.prices ORDER BY m.id")
    List<Material> findAllWithPrices();

    @Query("SELECT m FROM Material m LEFT JOIN FETCH m.prices WHERE m.id = :id")
    Optional<Material> findByIdWithPrices(@Param("id") Long id);
}
