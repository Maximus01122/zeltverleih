package de.zeltverleih.model.datenbank;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
public class MaterialPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double dayPrice;
    private double weekendPrice;
    private double buildUpPrice;

    @Column(nullable = false, columnDefinition = "date default current_date")
    private LocalDate startDate;

    @ManyToOne
    @JoinColumn(name = "material_id")
    @JsonBackReference
    private Material material;

    public MaterialPrice(Material material, LocalDate startDate) {
        this.material = material;
        this.startDate = startDate;
    }

    public MaterialPrice() {

    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getDayPrice() {
        return dayPrice;
    }

    public void setDayPrice(double dayPrice) {
        this.dayPrice = dayPrice;
    }

    public double getWeekendPrice() {
        return weekendPrice;
    }

    public void setWeekendPrice(double weekendPrice) {
        this.weekendPrice = weekendPrice;
    }

    public double getBuildUpPrice() {
        return buildUpPrice;
    }

    public void setBuildUpPrice(double buildUpPrice) {
        this.buildUpPrice = buildUpPrice;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
}

