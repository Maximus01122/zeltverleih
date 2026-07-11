package de.zeltverleih.service;

import de.zeltverleih.dto.request.AvailabilityCheckRequest;
import de.zeltverleih.dto.request.BookingRequest;
import de.zeltverleih.dto.request.MaterialLine;
import de.zeltverleih.dto.response.AvailabilityCheckResponse;
import de.zeltverleih.dto.response.BookingResponse;
import de.zeltverleih.dto.response.BookingSummaryResponse;
import de.zeltverleih.entity.Booking;
import de.zeltverleih.entity.Client;
import de.zeltverleih.entity.LoadingFee;
import de.zeltverleih.entity.Material;
import de.zeltverleih.enums.BookingStatus;
import de.zeltverleih.enums.SetupService;
import de.zeltverleih.exception.BadRequestException;
import de.zeltverleih.exception.ConflictException;
import de.zeltverleih.exception.ResourceNotFoundException;
import de.zeltverleih.mapper.BookingMapper;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.LoadingFeeRepository;
import de.zeltverleih.repository.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final LocalDate MIN_DATE = LocalDate.of(1970, 1, 1);
    private static final LocalDate MAX_DATE = LocalDate.of(9999, 12, 31);

    private final BookingRepository bookingRepository;
    private final MaterialRepository materialRepository;
    private final LoadingFeeRepository loadingFeeRepository;
    private final ClientService clientService;
    private final AvailabilityService availabilityService;
    private final BookingMapper mapper;

    public BookingService(BookingRepository bookingRepository,
                          MaterialRepository materialRepository,
                          LoadingFeeRepository loadingFeeRepository,
                          ClientService clientService,
                          AvailabilityService availabilityService,
                          BookingMapper mapper) {
        this.bookingRepository = bookingRepository;
        this.materialRepository = materialRepository;
        this.loadingFeeRepository = loadingFeeRepository;
        this.clientService = clientService;
        this.availabilityService = availabilityService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<BookingSummaryResponse> list(LocalDate from, LocalDate to) {
        LocalDate effectiveFrom = from != null ? from : MIN_DATE;
        LocalDate effectiveTo = to != null ? to : MAX_DATE;
        return bookingRepository.findAllIntersecting(effectiveFrom, effectiveTo).stream()
                .map(mapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse get(Long id) {
        return mapper.toResponse(load(id));
    }

    @Transactional
    public BookingResponse create(BookingRequest request) {
        validate(request);
        ensureAvailable(request, null);

        Client client = clientService.findOrCreate(request.client());
        Booking booking = new Booking(client, request.startDate(), request.endDate());
        applyDetails(booking, request);

        return mapper.toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse update(Long id, BookingRequest request) {
        validate(request);
        ensureAvailable(request, id);

        Booking booking = load(id);
        booking.setClient(clientService.findOrCreate(request.client()));
        booking.setStartDate(request.startDate());
        booking.setEndDate(request.endDate());
        applyDetails(booking, request);

        return mapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse changeStatus(Long id, BookingStatus status) {
        Booking booking = load(id);
        booking.setStatus(status);
        return mapper.toResponse(booking);
    }

    @Transactional
    public void delete(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking %d not found".formatted(id));
        }
        bookingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public AvailabilityCheckResponse checkAvailability(AvailabilityCheckRequest request) {
        return availabilityService.check(request);
    }

    private Booking load(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking %d not found".formatted(id)));
    }

    private void validate(BookingRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new BadRequestException("End date must not be before start date");
        }
        boolean hasSelbstabholung = request.services() != null
                && request.services().contains(SetupService.SELBSTABHOLUNG);
        if (request.loadingFeeId() != null && !hasSelbstabholung) {
            throw new BadRequestException("A loading fee requires the SELBSTABHOLUNG service");
        }
    }

    private void ensureAvailable(BookingRequest request, Long excludeBookingId) {
        if (Boolean.TRUE.equals(request.ignoreAvailability())) {
            return;
        }
        AvailabilityCheckResponse result = availabilityService.check(new AvailabilityCheckRequest(
                request.startDate(), request.endDate(), request.materials(), excludeBookingId));

        if (!result.available()) {
            String insufficient = result.materials().stream()
                    .filter(m -> !m.sufficient())
                    .map(m -> "%s (requested %d, available %d)"
                            .formatted(m.materialName(), m.requested(), m.available()))
                    .collect(Collectors.joining(", "));
            throw new ConflictException("Insufficient availability: " + insufficient);
        }
    }

    private void applyDetails(Booking booking, BookingRequest request) {
        booking.setComment(request.comment());
        booking.replaceServices(request.services());
        booking.setLoadingFee(resolveLoadingFee(request.loadingFeeId()));

        booking.clearMaterials();
        for (MaterialLine line : request.materials()) {
            Material material = materialRepository.findById(line.materialId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Material %d not found".formatted(line.materialId())));
            booking.addMaterial(material, line.quantity());
        }
    }

    private LoadingFee resolveLoadingFee(Long loadingFeeId) {
        if (loadingFeeId == null) {
            return null;
        }
        return loadingFeeRepository.findById(loadingFeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Loading fee %d not found".formatted(loadingFeeId)));
    }
}
