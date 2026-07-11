package de.zeltverleih.service;

import de.zeltverleih.dto.request.StandardFeeRequest;
import de.zeltverleih.entity.DeliveryFee;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.repository.DeliveryFeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DeliveryFeeService {

    private final DeliveryFeeRepository deliveryFeeRepository;

    public DeliveryFeeService(DeliveryFeeRepository deliveryFeeRepository) {
        this.deliveryFeeRepository = deliveryFeeRepository;
    }

    @Transactional(readOnly = true)
    public List<DeliveryFee> list() {
        return deliveryFeeRepository.findAll();
    }

    @Transactional
    public DeliveryFee create(StandardFeeRequest request) {
        return deliveryFeeRepository.save(new DeliveryFee(request.name(), request.price()));
    }

    @Transactional
    public DeliveryFee update(Long id, StandardFeeRequest request) {
        DeliveryFee fee = load(id);
        fee.setName(request.name());
        fee.setPrice(request.price());
        return fee;
    }

    @Transactional
    public void delete(Long id) {
        deliveryFeeRepository.delete(load(id));
    }

    private DeliveryFee load(Long id) {
        return deliveryFeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery fee %d not found".formatted(id)));
    }
}
