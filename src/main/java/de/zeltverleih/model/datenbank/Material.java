package de.zeltverleih.model.datenbank;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.List;

@Entity
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    private int count;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MaterialPrice> materialPrices;

    @Enumerated(EnumType.STRING)
    private MaterialCategory category;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<MaterialPrice> getMaterialPrices() {
        return materialPrices;
    }

    public void setMaterialPrices(List<MaterialPrice> materialPrices) {
        this.materialPrices = materialPrices;
    }

    public MaterialCategory getCategory() {
        return category;
    }

    public void setCategory(MaterialCategory category) {
        this.category = category;
    }

    @JsonIgnore
    public boolean isGarnitur() {
        return this.getCategory().equals(MaterialCategory.Tische_Bänke_Stühle);
    }

    @JsonIgnore
    public boolean isRegenrinne() {
        return this.getName().equals("Regenrinne");
    }

    @JsonIgnore
    public boolean isZelt() {
        return this.getCategory().equals(MaterialCategory.Zelte);
    }

    @JsonIgnore
    public boolean isZeltboden() {
        return this.getName().equals("Zeltboden");
    }

    @JsonIgnore
    public boolean isHufeisenwerfen() {
        return this.getName().equals("Hufeisenwerfen");
    }

    @Override
    public String toString() {
        return "Material{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", count=" + count +
                ", materialPrices=" + materialPrices +
                ", category=" + category +
                '}';
    }
}

