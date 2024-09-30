package de.zeltverleih.controller;

import de.zeltverleih.model.InvoiceDetails;
import de.zeltverleih.model.OfferInfos;
import de.zeltverleih.model.datenbank.*;
import de.zeltverleih.service.BookingService;
import de.zeltverleih.service.ClientService;
import de.zeltverleih.service.CreatePDF;
import de.zeltverleih.service.MaterialService;
import de.zeltverleih.service.excel.DataImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.*;

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
    private DataImportService importDataService;

    @Autowired
    private ClientService clientService;

    @PostMapping("/add")
    public Booking createBooking(@RequestBody Booking booking) throws Exception {
        return bookingService.saveBooking(booking);
    }

    @GetMapping("/setup")
    public String fillDatabase() throws Exception {
        importDataService.importData();
        return "Datenbank geladen";
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

    @GetMapping("count/{status}")
    public Integer countBuchungByStatusEquals(@PathVariable String status) {
        return bookingService.countBuchungByStatusEquals(status, LocalDate.now().getYear());
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



    @PostMapping("createOffer/{id}")
    public void createOffer(@PathVariable Long id, @RequestBody OfferInfos offerInfos) throws Exception {
        bookingService.createOffer(id, offerInfos);
    }

    @PostMapping("createInvoice/{id}")
    public void createInvoice(@PathVariable Long id, @RequestBody InvoiceDetails invoiceDetails) throws Exception {
        bookingService.createInvoice(id, invoiceDetails);
    }



    /*@PostMapping("createInvoice/{id}")
    public void createInvoice(@PathVariable int id, @RequestBody RechnungInfos rechnungInfos) {
        Booking b = getBuchung(id);
        MietAnzahlBody mietAnzahlBody = new MietAnzahlBody(b.getAnzahlTagesmiete(), b.getAnzahlWochenendmiete(), b.getLieferkosten());
        checkAnzahlUndKosten(mietAnzahlBody);
        //neuer Client => er braucht ClientNumber
        if (b.getKunde().getKundennummer() == 0) {
            Client k = b.getKunde();
            ClientNumber kNummer = kundennummerController.getKundennummer();
            kundennummerController.increase();
            k.setKundennummer(kNummer.getKundenummern());
            k = kundenController.update(k);
            b.setKunde(k);
        }
        BillNumber rechnungsnummer = rechnungnummerController.getRechnungsnummer();
        boolean ersteRechnung = b.getRechnungsnummer() == 0;
        if (ersteRechnung)
            b.setRechnungsnummer(rechnungsnummer.getRechnungsnummer());
        rechnungInfos.setLieferkosten(b.getLieferkosten());
        rechnungInfos.setRechnungsnummer(b.getRechnungsnummer());

        TreeMap<BookingMaterial, Double> bestellung = getPreiseForMaterialien(id, mietAnzahlBody);
        TreeMap<String, Double> servicePreise = getServicePreise(id);

        new CreatePDF().createPDF(b.getKunde(), bestellung, servicePreise, rechnungInfos);
        // BillNumber um 1 erhöhen
        if (ersteRechnung)
            rechnungnummerController.increase();
        add(b);
    }

    @GetMapping("income")
    public Map<String, Double> getTotalIncome() {
        ExcelBuchungInTabelle e = new ExcelBuchungInTabelle(PATH_TO_EXCEL);
        double incomeNetto = 0.0d;
        double incomeBrutto = 0.0d;
        double tax = 0.0d;
        try {
            int lastRow = getLastRowWrittenOn(e.getSheet(), ExcelDateiService.getColumnNames());
            for (int i = 6; i < lastRow -1; i++) {
                Cell cNetto = e.getSheet().getRow(i).getCell(ExcelDateiService.getColumnNames().get("Nettosumme"));
                Cell cBrutto = e.getSheet().getRow(i).getCell(ExcelDateiService.getColumnNames().get("Bruttosumme"));
                Cell cTax = e.getSheet().getRow(i).getCell(ExcelDateiService.getColumnNames().get("Mehrwertsteuer"));
                incomeNetto += cNetto.getNumericCellValue();
                incomeBrutto += cBrutto.getNumericCellValue();
                tax += cTax.getNumericCellValue();
            }
        } finally {
            e.closeExcel();
        }

        String incomeNettoString = String.format("%.2f", incomeNetto).replace(",", ".");
        String incomeBruttoString = String.format("%.2f", incomeBrutto).replace(",", ".");
        String taxString = String.format("%.2f", tax).replace(",", ".");

        Map<String, Double> m = new HashMap<>();
        m.put("Netto",Double.parseDouble(incomeNettoString));
        m.put("Brutto",Double.parseDouble(incomeBruttoString));
        m.put("Mehrwertsteuer",Double.parseDouble(taxString));

        return m;
    }

    @GetMapping("incomePerMonth")
    public Map<Month, Double> getTotalIncomePerMonth(String path) {
        Map<Month, Double> incomeMonthMap = new TreeMap<>();
        path = Objects.requireNonNullElse(path, PATH_TO_EXCEL);
        ExcelBuchungInTabelle e = new ExcelBuchungInTabelle(path);
        try {
            for (Booking b : getAll()) {
                if (path.contains(String.valueOf(b.getStartDate().getYear()))){
                    Row r = e.findRow(b);
                    Cell bruttoCell = r.getCell(ExcelDateiService.getColumnNames().get("Nettosumme"));
                    double price = bruttoCell.getNumericCellValue();
                    Month m = b.getEndDate().getMonth();
                    Double d = incomeMonthMap.getOrDefault(m, 0d);
                    incomeMonthMap.put(m, d + price);
                }
            }
        } finally {
            e.closeExcel();
        }

        for (Month m: incomeMonthMap.keySet()){
            double d = incomeMonthMap.get(m);
            String incomeString = String.format("%.2f", d).replace(",", ".");
            incomeMonthMap.put(m,Double.valueOf(incomeString));
        }
        return incomeMonthMap;
    }

    @GetMapping("incomePerMonthPerYear")
    public Map<Month,Map<Year, Double>> getTotalIncomePerMonthPerYear() {
        Map<Month,Map<Year, Double>> solution = new TreeMap<>();
        Year twentytwenty = Year.of(2021);
        Year currentYear = Year.now();
        int yearsToCollect = currentYear.minusYears(twentytwenty.getValue()).getValue();
        for (int i = 0; i <= yearsToCollect; i++) {
            Year yearOfInterest = twentytwenty.plusYears(i);
            if (yearOfInterest.equals(Year.of(2022)))
                continue;
            String path = PATH_TO_EXCEL.replace(String.valueOf(currentYear.getValue()),yearOfInterest.toString());
            System.out.println(path);
            Map<Month, Double> solve = getTotalIncomePerMonth(path);
            doStuff(solution, yearOfInterest, solve);
        }
        System.out.println(solution);
        return solution;
    }

    @GetMapping("countBuchungPerMonthPerYear")
    private Map<Month,Map<Year, Long>> countBuchungPerMonthPerYear(){
        List<Object[]> output = buchungService.countBuchungPerMonthPerYear();
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


    @GetMapping("getByMonth")
    public Map<Month, Integer> countByMonth(){
        return buchungService.countByMonth();
    }*/
}

