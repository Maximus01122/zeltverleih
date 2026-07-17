package de.zeltverleih.controller;

import de.zeltverleih.dto.response.CatalogMaterialResponse;
import de.zeltverleih.service.MaterialService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final MaterialService materialService;

    public CatalogController(MaterialService materialService) {
        this.materialService = materialService;
    }

    /** Public price list for the marketing website (no auth). */
    @GetMapping("/materials")
    public List<CatalogMaterialResponse> materials() {
        return materialService.catalog();
    }
}
