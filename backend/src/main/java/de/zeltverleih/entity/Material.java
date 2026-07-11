package de.zeltverleih.entity;

import de.zeltverleih.enums.MaterialCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "material")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MaterialCategory category;

    @Min(0)
    private int totalCount;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("validFrom DESC")
    private List<MaterialPrice> prices = new ArrayList<>();

    protected Material() {}

    public Material(String name, MaterialCategory category, int totalCount) {
        this.name = name;
        this.category = category;
        this.totalCount = totalCount;
    }

    public void addPrice(MaterialPrice price) {
        price.setMaterial(this);
        prices.add(price);
    }

    /** Latest price version whose validFrom is on or before the given date. */
    public Optional<MaterialPrice> priceValidOn(LocalDate date) {
        return prices.stream()
                .filter(p -> !p.getValidFrom().isAfter(date))
                .max(Comparator.comparing(MaterialPrice::getValidFrom));
    }

    public boolean hasPriceVersionFor(LocalDate validFrom) {
        return prices.stream().anyMatch(p -> p.getValidFrom().equals(validFrom));
    }

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public MaterialCategory getCategory() { return category; }
    public void setCategory(MaterialCategory category) { this.category = category; }

    public int getTotalCount() { return totalCount; }
    public void setTotalCount(int totalCount) { this.totalCount = totalCount; }

    public List<MaterialPrice> getPrices() { return prices; }
}
