package de.zeltverleih.service;

import de.zeltverleih.model.InvoiceDetails;
import de.zeltverleih.model.OfferInfos;
import de.zeltverleih.model.datenbank.*;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MaterialService materialService;

    @Transactional
    public Booking saveBooking(Booking booking) throws Exception {
        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
        bookingRepository.deleteById(bookingId);
    }

    public List<Booking> findByClient(Client client) {
        return bookingRepository.findByClient(client);
    }

    public List<Booking> findAll() {
        return bookingRepository.findAllOrderByStartDateAndEndDate();
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public List<Booking> findByStartDate(LocalDate startDate) {
        return bookingRepository.findByDateDetailsStartDate(startDate);
    }

    public List<Booking> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findBookingsByDateRange(startDate, endDate);
    }

    public Integer countBuchungByStatusEquals(String status, int year) {
            List<int[]> result = countBuchungByStatusEquals(status);
            int sum = 0;
            for (int[] array : result) {
                if (array[0] == year)
                    sum += array[1];
            }
            return sum;
    }

    public List<int[]> countBuchungByStatusEquals(String status) {
        return bookingRepository.countBuchungByStatusEquals(status);
    }

    public List<Object[]> countBuchungPerMonthPerYear(){
        return bookingRepository.countBuchungPerMonthPerYear();
    }


    private Map<BookingMaterial, Double> getPreiseForMaterialien(Long id, CostDetails costDetails) {
        Booking b = findById(id);
        Map<BookingMaterial, Double> bestellung = new HashMap<>();
        for (BookingMaterial bm : b.getBookingMaterials()) {
            MaterialPrice materialPrice = materialService.findClosestMaterialPrice(bm.getMaterial().getId());
            double preis = costDetails.getCountWeekendRent() * materialPrice.getWeekendPrice();
            preis += costDetails.getCountDailyRent() * materialPrice.getDayPrice();
            preis *= bm.getQuantity();
            bestellung.put(bm, preis);
        }
        return bestellung;
    }


    private TreeMap<String, Double> getServicePreise(Long buchungsId) {
        Booking b = findById(buchungsId);
        TreeMap<String, Double> servicePreise = new TreeMap<>();
        List<BookingMaterial> bestellung = b.getBookingMaterials().stream()
                .filter(bm -> materialService.findClosestMaterialPrice(bm.getMaterial().getId()).getBuildUpPrice() > 0).toList();
        List<SetupService> aufbauService = b.getSetupServices();
        List<SetupServiceName> aufbauServices = aufbauService.stream().map(SetupService::getName).toList();

        double[] aufbauPreise = new double[]{0, 0, 0, 0, 0};

        for (BookingMaterial bm : bestellung) {
            Material m = bm.getMaterial();
            double buildUpPrice = materialService.findClosestMaterialPrice(bm.getMaterial().getId()).getBuildUpPrice();

            if (m.isZelt() && aufbauServices.contains(SetupServiceName.AUFBAU_ZELT)) {
                aufbauPreise[0] += buildUpPrice * bm.getQuantity();
            } else if (m.isZeltboden() && aufbauServices.contains(SetupServiceName.AUFBAU_ZELTBODEN)) {
                aufbauPreise[1] += buildUpPrice * bm.getQuantity();
            } else if (m.isRegenrinne() && aufbauServices.contains(SetupServiceName.AUFBAU_REGENRINNE)) {
                aufbauPreise[2] += buildUpPrice * bm.getQuantity();
            } else if (m.isGarnitur() && aufbauServices.contains(SetupServiceName.AUFBAU_BESTUHLUNG)) {
                aufbauPreise[3] += buildUpPrice * bm.getQuantity();
            } else if (m.isHufeisenwerfen() && aufbauServices.contains(SetupServiceName.AUFBAU_AKTIVITÄT)) {
                aufbauPreise[4] += buildUpPrice * bm.getQuantity();
            }
        }

        if (aufbauPreise[0] > 0)
            servicePreise.put("Aufbau Zelte", aufbauPreise[0] - b.getCostDetails().getDeliveryCosts());
        if (aufbauPreise[1] > 0)
            servicePreise.put("Aufbau Zeltboden", aufbauPreise[1]);
        if (aufbauPreise[2] > 0)
            servicePreise.put("Aufbau Regenrinne", aufbauPreise[2]);
        if (aufbauPreise[3] > 0)
            servicePreise.put("Aufbau Garnituren", aufbauPreise[3]);
        if (aufbauPreise[4] > 0)
            servicePreise.put("Aufbau Hufeisenwerfen", aufbauPreise[4]);
        return servicePreise;
    }

    public void createOffer(Long id, OfferInfos offerInfos) throws Exception {
        //getPrice for every Material
        Booking b = findById(id);
        Map<BookingMaterial, Double> materialPrices = getPreiseForMaterialien(id, offerInfos);
        TreeMap<String, Double> servicePreise = getServicePreise(id);
        b.getCostDetails().setCountWeekendRent(offerInfos.getCountWeekendRent());
        b.getCostDetails().setCountDailyRent(offerInfos.getCountDailyRent());
        b.getCostDetails().setDeliveryCosts(offerInfos.getDeliveryCosts());

        b.getDateDetails().setValidUntil(offerInfos.getValidUntil());

        new CreatePDF().createPDF(
                b.getClient(),
                materialPrices,
                servicePreise,
                b.getDateDetails(),
                offerInfos);

        double summe = 0;
        for (BookingMaterial bm : materialPrices.keySet()) {
            summe += materialPrices.get(bm);
        }
        for (String as : servicePreise.keySet()) {
            summe += servicePreise.get(as);
        }
        //new ExcelBuchungInTabelle(PATH_TO_EXCEL).insertAngebotInExcel(b, summe, angebotInfos);
        b.setStatus(BookingStatus.OFFER_SENT);
        saveBooking(b);
    }

    public void createInvoice(Long id, InvoiceDetails invoiceInfos) throws Exception {
        Booking b = findById(id);

        /*if (b.getClient().getCustomerNumber() == 0) {
                Client k = b.getClient();
                ClientNumber kNummer = kundennummerController.getKundennummer();
                kundennummerController.increase();
                k.setKundennummer(kNummer.getKundenummern());
                k = kundenController.update(k);
                b.setKunde(k);
            }
            BillNumber rechnungsnummer = rechnungnummerController.getRechnungsnummer();
            boolean ersteRechnung = b.getInvoiceNumber() == 0;
            if (ersteRechnung)
                b.setRechnungsnummer(rechnungsnummer.getRechnungsnummer());
            rechnungInfos.setLieferkosten(b.getLieferkosten());
            rechnungInfos.setRechnungsnummer(b.getRechnungsnummer());
        */

        Map<BookingMaterial, Double> bestellung = getPreiseForMaterialien(id, b.getCostDetails());
        TreeMap<String, Double> servicePreise = getServicePreise(id);

        new CreatePDF().createPDF(b.getClient(), bestellung, servicePreise, invoiceInfos);
        // BillNumber um 1 erhöhen
        /*if (ersteRechnung)
            rechnungnummerController.increase();*/
        b.setStatus(BookingStatus.PAYMENT_PENDING);
        saveBooking(b);
    }
}
