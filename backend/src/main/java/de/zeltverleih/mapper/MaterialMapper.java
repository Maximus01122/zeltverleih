package de.zeltverleih.mapper;

import de.zeltverleih.dto.response.MaterialResponse;
import de.zeltverleih.entity.Material;
import de.zeltverleih.entity.MaterialPrice;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Component
public class MaterialMapper {

    public MaterialResponse toResponse(Material material) {
        MaterialResponse.PriceView current = material.priceValidOn(LocalDate.now())
                .map(this::toPriceView)
                .orElse(null);

        List<MaterialResponse.PriceView> history = material.getPrices().stream()
                .sorted(Comparator.comparing(MaterialPrice::getValidFrom).reversed())
                .map(this::toPriceView)
                .toList();

        return new MaterialResponse(
                material.getId(),
                material.getName(),
                material.getCategory(),
                material.getTotalCount(),
                current,
                history
        );
    }

    private MaterialResponse.PriceView toPriceView(MaterialPrice price) {
        return new MaterialResponse.PriceView(
                price.getId(),
                price.getDailyPrice(),
                price.getWeekendPrice(),
                price.getAssemblyPrice(),
                price.getValidFrom()
        );
    }
}
