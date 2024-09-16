package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.Material;
import de.zeltverleih.model.datenbank.MaterialPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface MaterialPriceRepository extends JpaRepository<MaterialPrice, Long> {

    @Query(value = "SELECT * FROM material_price mp WHERE mp.material_id = ?1 AND mp.start_date <= CURRENT_DATE ORDER BY mp.start_date DESC LIMIT 1", nativeQuery = true)
    Optional<MaterialPrice> findClosestMaterialPriceByMaterial(Long materialID);
}
