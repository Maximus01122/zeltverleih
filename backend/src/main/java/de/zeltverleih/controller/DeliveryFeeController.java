package de.zeltverleih.controller;

import de.zeltverleih.dto.request.StandardFeeRequest;
import de.zeltverleih.entity.DeliveryFee;
import de.zeltverleih.service.DeliveryFeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/delivery-fees")
public class DeliveryFeeController {

    private final DeliveryFeeService deliveryFeeService;

    public DeliveryFeeController(DeliveryFeeService deliveryFeeService) {
        this.deliveryFeeService = deliveryFeeService;
    }

    public record DeliveryFeeResponse(Long id, String name, BigDecimal price) {}

    @GetMapping
    public List<DeliveryFeeResponse> list() {
        return deliveryFeeService.list().stream()
                .map(this::toResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<DeliveryFeeResponse> create(@Valid @RequestBody StandardFeeRequest request) {
        DeliveryFee created = deliveryFeeService.create(request);
        return ResponseEntity.created(URI.create("/api/delivery-fees/" + created.getId()))
                .body(toResponse(created));
    }

    @PutMapping("/{id}")
    public DeliveryFeeResponse update(@PathVariable Long id, @Valid @RequestBody StandardFeeRequest request) {
        return toResponse(deliveryFeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deliveryFeeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private DeliveryFeeResponse toResponse(DeliveryFee fee) {
        return new DeliveryFeeResponse(fee.getId(), fee.getName(), fee.getPrice());
    }
}
