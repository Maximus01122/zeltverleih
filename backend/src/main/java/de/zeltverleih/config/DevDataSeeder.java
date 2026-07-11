package de.zeltverleih.config;

import de.zeltverleih.entity.DeliveryFee;
import de.zeltverleih.entity.LoadingFee;
import de.zeltverleih.entity.Material;
import de.zeltverleih.entity.MaterialPrice;
import de.zeltverleih.enums.MaterialCategory;
import de.zeltverleih.repository.DeliveryFeeRepository;
import de.zeltverleih.repository.LoadingFeeRepository;
import de.zeltverleih.repository.MaterialRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Profile("dev")
public class DevDataSeeder implements CommandLineRunner {

    private final MaterialRepository materialRepository;
    private final LoadingFeeRepository loadingFeeRepository;
    private final DeliveryFeeRepository deliveryFeeRepository;

    public DevDataSeeder(MaterialRepository materialRepository,
                          LoadingFeeRepository loadingFeeRepository,
                          DeliveryFeeRepository deliveryFeeRepository) {
        this.materialRepository = materialRepository;
        this.loadingFeeRepository = loadingFeeRepository;
        this.deliveryFeeRepository = deliveryFeeRepository;
    }

    @Override
    public void run(String... args) {
        if (materialRepository.count() == 0) {
            seedMaterial("Partyzelt 6x12m", MaterialCategory.ZELTE, 4, "250.00", "400.00", "150.00");
            seedMaterial("Partyzelt 4x8m", MaterialCategory.ZELTE, 6, "150.00", "250.00", "100.00");
            seedMaterial("Bierzeltgarnitur", MaterialCategory.TISCHE_BAENKE_STUEHLE, 40, "8.00", "12.00", "2.00");
            seedMaterial("Lichterkette 10m", MaterialCategory.LICHT_SCHATTEN, 20, "5.00", "8.00", "3.00");
            seedMaterial("Heizstrahler", MaterialCategory.WAERME_KAELTE, 8, "20.00", "35.00", "5.00");
        }

        if (loadingFeeRepository.count() == 0) {
            loadingFeeRepository.save(new LoadingFee("Klein", new BigDecimal("20.00")));
            loadingFeeRepository.save(new LoadingFee("Groß", new BigDecimal("40.00")));
        }

        if (deliveryFeeRepository.count() == 0) {
            deliveryFeeRepository.save(new DeliveryFee("Lieferpauschale", new BigDecimal("140.00")));
        }
    }

    private void seedMaterial(String name, MaterialCategory category, int count,
                              String daily, String weekend, String assembly) {
        Material material = new Material(name, category, count);
        material.addPrice(new MaterialPrice(
                new BigDecimal(daily), new BigDecimal(weekend), new BigDecimal(assembly),
                LocalDate.of(2024, 1, 1)));
        materialRepository.save(material);
    }
}
