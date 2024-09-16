package de.zeltverleih.controller;

import de.zeltverleih.model.DateRange;
import de.zeltverleih.model.HolderDates;
import de.zeltverleih.model.OfferInfos;
import de.zeltverleih.model.datenbank.*;
import de.zeltverleih.service.BookingService;
import de.zeltverleih.service.ClientService;
import de.zeltverleih.service.CreatePDF;
import de.zeltverleih.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/booking")
@CrossOrigin
public class BookingController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ClientService clientService;

    @PostMapping("/add")
    public Booking createBooking(@RequestBody Booking booking) throws Exception {
        return bookingService.saveBooking(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }

    @GetMapping("/client/{clientId}")
    public List<Booking> getBookingsByClient(@PathVariable Long clientId) {
        Client client = clientService.getClientById(clientId);
        return bookingService.findByClient(client);
    }



    @GetMapping("count/{status}/{year}")
    public Integer countBuchungByStatusEquals(@PathVariable String status, @PathVariable int year) {
        return bookingService.countBuchungByStatusEquals(status, year);
    }

    @GetMapping("countBuchungPerMonthPerYear")
    private Map<Month,Map<Year, Long>> countBuchungPerMonthPerYear(){
        List<Object[]> output = bookingService.countBuchungPerMonthPerYear();
        Map<Month, Map<Year, Long>> resultMap = new TreeMap<>();
        for (Object[] entry : output) {
            int year = (int) entry[0];
            String month = (String) entry[1];
            Month month1 = Month.valueOf(month.toUpperCase());
            long value = (long) entry[2];

            resultMap.computeIfAbsent(month1, k -> new TreeMap<>()).put(Year.of(year), value);
        }
        return resultMap;
    }

    @GetMapping("/getAll")
    public List<Booking> getAllBookings() {
        return bookingService.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.findById(id);
    }

    @GetMapping("/byStartDate")
    public List<Booking> getBookingsByStartDate(@RequestParam("startDate") LocalDate startDate) {
        return bookingService.findByStartDate(startDate);
    }

    // 2. Buchungen nach Zeitraum suchen
    @PostMapping("/byDateRange")
    public List<Booking> getBookingsByDateRange(@RequestParam("startDate") LocalDate startDate, @RequestParam("endDate") LocalDate endDate) {
        return bookingService.findByDateRange(startDate, endDate);
    }

    @GetMapping("getByDatum")
    public List<Booking> getAllFreePlaces(@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                          @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return bookingService.findByDateRange(startDate, endDate);
    }



    @PostMapping("createAngebot/{id}")
    public void createAngebot(@PathVariable Long id, @RequestBody OfferInfos offerInfos) throws Exception {
        bookingService.createAngebot(id, offerInfos);
    }
}

