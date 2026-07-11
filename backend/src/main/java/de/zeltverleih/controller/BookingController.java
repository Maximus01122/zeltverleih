package de.zeltverleih.controller;

import de.zeltverleih.dto.request.AvailabilityCheckRequest;
import de.zeltverleih.dto.request.BookingRequest;
import de.zeltverleih.dto.request.StatusChangeRequest;
import de.zeltverleih.dto.response.AvailabilityCheckResponse;
import de.zeltverleih.dto.response.BookingResponse;
import de.zeltverleih.dto.response.BookingSummaryResponse;
import de.zeltverleih.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingSummaryResponse> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return bookingService.list(from, to);
    }

    @GetMapping("/{id}")
    public BookingResponse get(@PathVariable Long id) {
        return bookingService.get(id);
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.create(request);
        return ResponseEntity.created(URI.create("/api/bookings/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public BookingResponse update(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        return bookingService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public BookingResponse changeStatus(@PathVariable Long id, @Valid @RequestBody StatusChangeRequest request) {
        return bookingService.changeStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        bookingService.delete(id);
    }

    @PostMapping("/availability-check")
    public AvailabilityCheckResponse checkAvailability(@Valid @RequestBody AvailabilityCheckRequest request) {
        return bookingService.checkAvailability(request);
    }
}
