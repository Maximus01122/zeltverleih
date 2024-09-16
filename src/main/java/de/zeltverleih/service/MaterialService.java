package de.zeltverleih.service;

import de.zeltverleih.model.MaterialAvailability;
import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.model.datenbank.Material;
import de.zeltverleih.model.datenbank.MaterialPrice;
import de.zeltverleih.repository.MaterialPriceRepository;
import de.zeltverleih.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private MaterialPriceRepository materialPriceRepository;

    public List<MaterialAvailability> getMaterialAvailability(LocalDate startDate, LocalDate endDate) {
        return materialRepository.getMaterialAvailability(startDate, endDate);
    }

    public Material getMaterialByName(String name) {
        Optional<Material> material = materialRepository.findByName(name);
        return material.orElseThrow(() -> new RuntimeException("Material not found with name: " + name));
    }

    public MaterialPrice findClosestMaterialPrice(Long materialID) {
        return materialPriceRepository.findClosestMaterialPriceByMaterial(materialID)
                .orElseThrow(() -> new RuntimeException("No price found for material with ID: " + materialID));
    }

    public Material saveMaterial(Material material) {
        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }

    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    public Material findById(Long id) {
        Optional<Material> material =  materialRepository.findById(id);
        return material.orElseThrow(() -> new RuntimeException("Client not found with ID: " + id));

    }
}
