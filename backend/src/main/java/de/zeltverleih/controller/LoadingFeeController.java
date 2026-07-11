package de.zeltverleih.controller;

import de.zeltverleih.dto.request.StandardFeeRequest;
import de.zeltverleih.entity.LoadingFee;
import de.zeltverleih.service.LoadingFeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/loading-fees")
public class LoadingFeeController {

    private final LoadingFeeService loadingFeeService;

    public LoadingFeeController(LoadingFeeService loadingFeeService) {
        this.loadingFeeService = loadingFeeService;
    }

    public record LoadingFeeResponse(Long id, String name, BigDecimal price) {}

    @GetMapping
    public List<LoadingFeeResponse> list() {
        return loadingFeeService.list().stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<LoadingFeeResponse> create(@Valid @RequestBody StandardFeeRequest request) {
        LoadingFee created = loadingFeeService.create(request);
        return ResponseEntity.created(URI.create("/api/loading-fees/" + created.getId()))
                .body(toResponse(created));
    }

    @PutMapping("/{id}")
    public LoadingFeeResponse update(@PathVariable Long id, @Valid @RequestBody StandardFeeRequest request) {
        return toResponse(loadingFeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loadingFeeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private LoadingFeeResponse toResponse(LoadingFee fee) {
        return new LoadingFeeResponse(fee.getId(), fee.getName(), fee.getPrice());
    }
}
