package de.zeltverleih.model;

import de.zeltverleih.model.datenbank.Material;

public class MaterialAvailability {
    private Material material;
    private Long availableCount;

    public MaterialAvailability(Material material, Long availableCount) {
        this.material = material;
        this.availableCount = availableCount;
    }

    // Getter und Setter

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public Long getAvailableCount() {
        return availableCount;
    }

    public void setAvailableCount(Long availableCount) {
        this.availableCount = availableCount;
    }
}
