package de.zeltverleih.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "material_price", uniqueConstraints = @UniqueConstraint(
        name = "uq_material_price_valid_from", columnNames = {"material_id", "valid_from"}))
public class MaterialPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @NotNull
    private BigDecimal dailyPrice;

    @NotNull
    private BigDecimal weekendPrice;

    @NotNull
    private BigDecimal assemblyPrice;

    @NotNull
    private LocalDate validFrom;

    protected MaterialPrice() {}

    public MaterialPrice(BigDecimal dailyPrice, BigDecimal weekendPrice, BigDecimal assemblyPrice, LocalDate validFrom) {
        this.dailyPrice = dailyPrice;
        this.weekendPrice = weekendPrice;
        this.assemblyPrice = assemblyPrice;
        this.validFrom = validFrom;
    }

    public Long getId() { return id; }

    public Material getMaterial() { return material; }
    public void setMaterial(Material material) { this.material = material; }

    public BigDecimal getDailyPrice() { return dailyPrice; }
    public void setDailyPrice(BigDecimal dailyPrice) { this.dailyPrice = dailyPrice; }

    public BigDecimal getWeekendPrice() { return weekendPrice; }
    public void setWeekendPrice(BigDecimal weekendPrice) { this.weekendPrice = weekendPrice; }

    public BigDecimal getAssemblyPrice() { return assemblyPrice; }
    public void setAssemblyPrice(BigDecimal assemblyPrice) { this.assemblyPrice = assemblyPrice; }

    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
}
