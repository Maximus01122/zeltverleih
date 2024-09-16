package de.zeltverleih.repository;

import de.zeltverleih.model.MaterialAvailability;
import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.model.datenbank.Material;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    /**
     * This method retrieves the number of booked materials within a specified date range.
     *
     * @param startDate The start date for the query period.
     * @param endDate   The end date for the query period.
     * @return A list of objects, where each object is an array with two elements:
     * - The name of the material (String)
     * - The total quantity (Integer)
     */

    @Query("SELECT m.id, COALESCE(SUM(b.quantity), 0) " +
            "FROM Material m " +
            "LEFT JOIN BookingMaterial b ON m.id = b.material.id " +
            "WHERE (b.booking.dateDetails.startDate >= ?1 AND b.booking.dateDetails.endDate <= ?2) " +
            "OR (b.booking.dateDetails.startDate <= ?2 AND b.booking.dateDetails.endDate >= ?1) " +
            "GROUP BY m.id " +
            "ORDER BY m.id")
    List<Object[]> getMaterialQuantity(LocalDate startDate, LocalDate endDate);


    /**
     * Retrieves the total quantity of booked materials within a specified date range
     * and returns them as a map where each key is the material name and the value
     * is the total quantity booked.
     *
     * @param startdatum The start date for the query period.
     * @param enddatum   The end date for the query period.
     * @return A map containing the names of materials as keys and the total quantity
     *         of booked materials as values. If a material has no bookings within the
     *         specified date range, it will have a value of 0L (Long).
     */
    default List<MaterialAvailability> getMaterialAvailability(LocalDate startdatum, LocalDate enddatum) {
        // Fetch all materials from the database
        List<Material> materials = findAll(Sort.by(Sort.Direction.ASC, "id"));

        // Initialize a list to hold the MaterialQuantity objects
        List<MaterialAvailability> materialQuantities = new ArrayList<>();

        // Retrieve the booked material quantities within the date range
        List<Object[]> results = getMaterialQuantity(startdatum, enddatum);

        // Create a map to hold the quantities from the query
        Map<Long, Long> resultMap = results.stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0], // Material ID
                        result -> (Long) result[1]  // Total quantity booked
                ));

        // Populate the list with MaterialQuantity objects
        for (Material material : materials) {
            Long bookedQuantity = resultMap.getOrDefault(material.getId(), 0L);
            Long finalQuantity = Math.min(material.getCount(), bookedQuantity);
            materialQuantities.add(new MaterialAvailability(material, material.getCount() - finalQuantity));
        }

        return materialQuantities;
    }


    Optional<Material> findByName(String name);
}
