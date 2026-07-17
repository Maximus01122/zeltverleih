package de.zeltverleih.service;

import de.zeltverleih.dto.request.MaterialCreateRequest;
import de.zeltverleih.dto.request.MaterialUpdateRequest;
import de.zeltverleih.dto.request.PriceVersionRequest;
import de.zeltverleih.dto.response.CatalogMaterialResponse;
import de.zeltverleih.dto.response.MaterialAvailabilityResponse;
import de.zeltverleih.dto.response.MaterialResponse;
import de.zeltverleih.entity.Material;
import de.zeltverleih.entity.MaterialPrice;
import de.zeltverleih.exception.BadRequestException;
import de.zeltverleih.exception.ConflictException;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.mapper.MaterialMapper;
import de.zeltverleih.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final AvailabilityService availabilityService;
    private final MaterialMapper mapper;

    public MaterialService(MaterialRepository materialRepository,
                           AvailabilityService availabilityService,
                           MaterialMapper mapper) {
        this.materialRepository = materialRepository;
        this.availabilityService = availabilityService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> list() {
        return materialRepository.findAllWithPrices().stream()
                .map(mapper::toResponse)
                .toList();
    }

    /** Slim public catalog for the website price list. */
    @Transactional(readOnly = true)
    public List<CatalogMaterialResponse> catalog() {
        return materialRepository.findAllWithPrices().stream()
                .map(material -> {
                    var price = material.priceValidOn(LocalDate.now());
                    return new CatalogMaterialResponse(
                            material.getId(),
                            material.getName(),
                            material.getCategory(),
                            price.map(MaterialPrice::getDailyPrice).orElse(BigDecimal.ZERO),
                            price.map(MaterialPrice::getWeekendPrice).orElse(BigDecimal.ZERO),
                            price.map(MaterialPrice::getAssemblyPrice).orElse(BigDecimal.ZERO)
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public MaterialResponse get(Long id) {
        return mapper.toResponse(load(id));
    }

    @Transactional
    public MaterialResponse create(MaterialCreateRequest request) {
        Material material = new Material(request.name(), request.category(), request.totalCount());
        LocalDate validFrom = request.validFrom() != null ? request.validFrom() : LocalDate.now();
        material.addPrice(new MaterialPrice(
                request.dailyPrice(), request.weekendPrice(), request.assemblyPrice(), validFrom));
        return mapper.toResponse(materialRepository.save(material));
    }

    @Transactional
    public MaterialResponse update(Long id, MaterialUpdateRequest request) {
        Material material = load(id);
        material.setName(request.name());
        material.setCategory(request.category());
        material.setTotalCount(request.totalCount());
        return mapper.toResponse(material);
    }

    /**
     * Adds a new price version. Existing versions are never modified so that
     * historical offers and invoices keep resolving to the price that was
     * valid at their booking date.
     */
    @Transactional
    public MaterialResponse addPriceVersion(Long id, PriceVersionRequest request) {
        Material material = load(id);
        if (material.hasPriceVersionFor(request.validFrom())) {
            throw new ConflictException(
                    "A price version starting %s already exists for material %d"
                            .formatted(request.validFrom(), id));
        }
        material.addPrice(new MaterialPrice(
                request.dailyPrice(), request.weekendPrice(), request.assemblyPrice(), request.validFrom()));
        return mapper.toResponse(material);
    }

    @Transactional
    public MaterialResponse updatePriceVersion(Long materialId, Long priceId, PriceVersionRequest request) {
        Material material = load(materialId);
        MaterialPrice price = findPrice(material, priceId);
        if (material.getPrices().stream()
                .anyMatch(p -> !p.getId().equals(priceId) && p.getValidFrom().equals(request.validFrom()))) {
            throw new ConflictException(
                    "A price version starting %s already exists for material %d"
                            .formatted(request.validFrom(), materialId));
        }
        price.setDailyPrice(request.dailyPrice());
        price.setWeekendPrice(request.weekendPrice());
        price.setAssemblyPrice(request.assemblyPrice());
        price.setValidFrom(request.validFrom());
        return mapper.toResponse(material);
    }

    @Transactional
    public MaterialResponse deletePriceVersion(Long materialId, Long priceId) {
        Material material = load(materialId);
        if (material.getPrices().size() <= 1) {
            throw new BadRequestException("At least one price version must remain");
        }
        material.getPrices().remove(findPrice(material, priceId));
        return mapper.toResponse(material);
    }

    @Transactional(readOnly = true)
    public List<MaterialAvailabilityResponse> availability(LocalDate from, LocalDate to) {
        Map<Long, Integer> available = availabilityService.availableByMaterial(from, to);
        return materialRepository.findAllWithPrices().stream()
                .map(m -> new MaterialAvailabilityResponse(
                        m.getId(), m.getName(), m.getCategory(), m.getTotalCount(),
                        available.getOrDefault(m.getId(), m.getTotalCount())))
                .toList();
    }

    private Material load(Long id) {
        return materialRepository.findByIdWithPrices(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material %d not found".formatted(id)));
    }

    private MaterialPrice findPrice(Material material, Long priceId) {
        return material.getPrices().stream()
                .filter(p -> p.getId().equals(priceId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Price %d not found for material %d".formatted(priceId, material.getId())));
    }
}
