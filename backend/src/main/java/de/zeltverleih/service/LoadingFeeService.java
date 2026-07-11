package de.zeltverleih.service;

import de.zeltverleih.dto.request.StandardFeeRequest;
import de.zeltverleih.entity.LoadingFee;
import de.zeltverleih.exception.ConflictException;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.LoadingFeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LoadingFeeService {

    private final LoadingFeeRepository loadingFeeRepository;
    private final BookingRepository bookingRepository;

    public LoadingFeeService(LoadingFeeRepository loadingFeeRepository,
                             BookingRepository bookingRepository) {
        this.loadingFeeRepository = loadingFeeRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<LoadingFee> list() {
        return loadingFeeRepository.findAll();
    }

    @Transactional
    public LoadingFee create(StandardFeeRequest request) {
        return loadingFeeRepository.save(new LoadingFee(request.name(), request.price()));
    }

    @Transactional
    public LoadingFee update(Long id, StandardFeeRequest request) {
        LoadingFee fee = load(id);
        fee.setName(request.name());
        fee.setPrice(request.price());
        return fee;
    }

    @Transactional
    public void delete(Long id) {
        if (bookingRepository.existsByLoadingFeeId(id)) {
            throw new ConflictException("Ladepauschale wird noch von Buchungen verwendet und kann nicht gelöscht werden.");
        }
        loadingFeeRepository.delete(load(id));
    }

    private LoadingFee load(Long id) {
        return loadingFeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loading fee %d not found".formatted(id)));
    }
}
