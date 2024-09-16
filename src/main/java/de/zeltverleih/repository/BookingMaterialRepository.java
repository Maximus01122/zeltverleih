package de.zeltverleih.repository;

import de.zeltverleih.model.datenbank.BookingMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingMaterialRepository extends JpaRepository<BookingMaterial, Integer> {
    @Query("select COALESCE(sum(b.quantity),0) from BookingMaterial b " +
            "where b.material.id = ?1 " +
            "and (b.booking.dateDetails.startDate between ?2 and ?3 " +
            "or b.booking.dateDetails.endDate between ?2 and ?3 " +
            "or ?2 between b.booking.dateDetails.startDate and b.booking.dateDetails.endDate)")
    int getOccupiedNumbers(Long materialId, LocalDate startdatum, LocalDate enddatum);

    @Query("select distinct b from BookingMaterial b where b.booking.id = ?1 " +
            "order by b.material.category, b.material.id")
    List<BookingMaterial> findMaterialienByBuchung_Id(int id);

    @Query(value = "SELECT * FROM (SELECT `material`.`name` as `material`, `categtory`.`name` as `categtory`, SUM(`buchung_material`.`anzahl`) as `count` , " +
            "ROW_NUMBER() OVER (PARTITION BY `categtory_id` ORDER BY SUM(`booking_material`.`count`) DESC) AS `rang`" +
            "FROM `booking_material` JOIN material ON `material`.`id` = `booking_material`.`material_id` " +
            "JOIN `category` ON `material`.`category_id` = `category`.`id` " +
            "GROUP BY `material`.`name` ORDER BY `category_id`, SUM(`booking_material`.`count`) DESC) ranks " +
            "WHERE `ranks`.`rang` <= 5", nativeQuery = true)
    List<statistikMaterial> getAnzahlVonVermietungenInsgesamt();

    interface statistikMaterial {
        String getMaterial();

        String getKategorie();
        int getAnzahl();

        int getRang();
    }
}
