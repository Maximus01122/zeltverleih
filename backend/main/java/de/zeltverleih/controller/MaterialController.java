package de.zeltverleih.controller;

import de.zeltverleih.model.MaterialAvailability;
import de.zeltverleih.model.datenbank.*;
import de.zeltverleih.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/material")
@CrossOrigin
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping("/getOccupiedQuantity")
    public List<MaterialAvailability> getOccupiedQuantity(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate")@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate){
        return materialService.getMaterialAvailability(startDate, endDate);
    }


    @PostMapping("/add")
    public Material createMaterial(@RequestBody Material material) throws Exception {
        return materialService.saveMaterial(material);
    }

    @DeleteMapping("/{id}")
    public void deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }

    @GetMapping("/getAll")
    public List<Material> getAllMaterials() {
        return materialService.findAll();
    }

    @GetMapping("/{id}")
    public Material getMaterialById (@PathVariable Long id) {
        return materialService.findById(id);
    }

}

