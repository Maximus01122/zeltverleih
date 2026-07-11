package de.zeltverleih.controller;

import de.zeltverleih.dto.request.MaterialCreateRequest;
import de.zeltverleih.dto.request.MaterialUpdateRequest;
import de.zeltverleih.dto.request.PriceVersionRequest;
import de.zeltverleih.dto.response.MaterialAvailabilityResponse;
import de.zeltverleih.dto.response.MaterialResponse;
import de.zeltverleih.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<MaterialResponse> list() {
        return materialService.list();
    }

    @GetMapping("/{id}")
    public MaterialResponse get(@PathVariable Long id) {
        return materialService.get(id);
    }

    @PostMapping
    public ResponseEntity<MaterialResponse> create(@Valid @RequestBody MaterialCreateRequest request) {
        MaterialResponse response = materialService.create(request);
        return ResponseEntity.created(URI.create("/api/materials/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public MaterialResponse update(@PathVariable Long id, @Valid @RequestBody MaterialUpdateRequest request) {
        return materialService.update(id, request);
    }

    @PostMapping("/{id}/prices")
    public MaterialResponse addPriceVersion(@PathVariable Long id, @Valid @RequestBody PriceVersionRequest request) {
        return materialService.addPriceVersion(id, request);
    }

    @PutMapping("/{materialId}/prices/{priceId}")
    public MaterialResponse updatePriceVersion(
            @PathVariable Long materialId,
            @PathVariable Long priceId,
            @Valid @RequestBody PriceVersionRequest request) {
        return materialService.updatePriceVersion(materialId, priceId, request);
    }

    @DeleteMapping("/{materialId}/prices/{priceId}")
    public MaterialResponse deletePriceVersion(@PathVariable Long materialId, @PathVariable Long priceId) {
        return materialService.deletePriceVersion(materialId, priceId);
    }

    /** Lager view: available units per material for a chosen period. */
    @GetMapping("/availability")
    public List<MaterialAvailabilityResponse> availability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return materialService.availability(from, to);
    }
}
