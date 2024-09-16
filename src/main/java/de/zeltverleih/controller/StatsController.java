package de.zeltverleih.controller;

import de.zeltverleih.model.datenbank.Booking;
import de.zeltverleih.repository.BookingMaterialRepository;
import de.zeltverleih.service.BookingMaterialService;
import de.zeltverleih.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

import static de.zeltverleih.Konstanten.PATH_TO_EXCEL;

@RestController
@RequestMapping("/statistik")
@CrossOrigin
public class StatsController {
    @Autowired
    private BookingService buchungService;

    @Autowired
    private BookingController buchungController;

    @Autowired
    private BookingMaterialService buchungMaterialService;


    /*@GetMapping("statsAnzahl")
    public List<TwoDatesOneNumber> getAnzahlStats(){
        return buchungService.getAnzahlStats();
    }

    @GetMapping("countBuchungPerMonth")
    public List<TwoDatesOneNumber> countBuchungPerMonth(){
        return buchungService.countBuchungPerMonth();
    }

    @GetMapping("distributionRevenue")
    public List<TwoDatesOneNumber> getUmsatzStats(){
        List<TwoDatesOneNumber> vorher = getAnzahlStats();
        vorher = vorher.stream().filter(dummy -> dummy.getJahr() == LocalDate.now().getYear()).toList();
        List<TwoDatesOneNumber> l = new ArrayList<>();
        for (TwoDatesOneNumber d: vorher) {
            ExcelBuchungInTabelle excelBuchungInTabelle= new ExcelBuchungInTabelle(PATH_TO_EXCEL);
            double summe = 0;
            LocalDate start = LocalDate.of(d.getJahr(), Month.of(d.getMonat()), 1);
            LocalDate ende = LocalDate.of(d.getJahr(), Month.of(Math.floorMod(d.getMonat()+1,12)), 1);
            List<Booking> bList = buchungService.getByDatum(start,ende);
            summe+= excelBuchungInTabelle.getPreisFromBuchungList(bList);
            double finalSumme = Double.parseDouble(String.format("%.2f",summe).replace(",","."));
            l.add(new TwoDatesOneNumber(d.getJahr(),d.getMonat(),finalSumme));
        }
        return l;
    }*/

    @GetMapping("topFiveItems")
    public List<BookingMaterialRepository.statistikMaterial> getAnzahlVonVermietungenInsgesamt(){
        return buchungMaterialService.getAnzahlVonVermietungenInsgesamt();
    }

    /**
     * Gibt Aufteilung der Einnahmen für aktuelles Jahr nach Kategorien der Materialien
     * Es werden nur Buchungen beachtet, die bereits eine Rechnung erhalten haben
    **/
    /*@GetMapping("distributionKategorie")
    public List<TupleStringDouble> revenue(){
        List<Booking> bestaetigteBestellung = getbestaetigteBuchung();
        bestaetigteBestellung = bestaetigteBestellung.stream()
                .filter(b -> b.getEnddatum().getYear() == LocalDate.now().getYear()).toList();

        Map<Category,Double> distribution = new HashMap<>();
        for (Booking b: bestaetigteBestellung) {
            TreeMap<BookingMaterial, Double> preise =  buchungController.getPreiseForMaterialien(b.getId(), new MietAnzahlBody(b.getAnzahlTagesmiete(), b.getAnzahlWochenendmiete(), b.getLieferkosten()));
            for (BookingMaterial bm : preise.keySet()) {
                Category k = bm.getMaterial().getKategorie();
                if (distribution.containsKey(k)){
                    distribution.put(k,distribution.get(k)+preise.get(bm));
                }
                else distribution.put(k,preise.get(bm));
            }
        }
        List<TupleStringDouble> list = new ArrayList<>();
        for (Category k: distribution.keySet()) {
            list.add(new TupleStringDouble(k.getName(),distribution.get(k)));
        }
        // nach Größe der Anteile sortieren
        list.sort((s,k)-> (int) (k.getaDouble() - s.getaDouble()));
        return list;
    }*/

    private List<Booking> getbestaetigteBuchung(){
        return buchungService.findAll().stream().filter(b -> !b.getInvoiceNumber().equals("0")).toList();
    }


    /*@GetMapping("distributionService")
    public List<TupleStringDouble> distService(){
        List<Booking> bestaetigteBestellung = getbestaetigteBuchung();
        Map<String,Double> distribution = new HashMap<>();
        for (Booking b: bestaetigteBestellung) {
            if(b.getLieferkosten()>0){
                if (distribution.containsKey("Lieferung")){
                    distribution.put("Lieferung",distribution.get("Lieferung")+ b.getLieferkosten());
                }
                else distribution.put("Lieferung", (double) b.getLieferkosten());
            };
            TreeMap<String, Double> preise =  buchungController.getServicePreise(b.getId());
            for (String bm : preise.keySet()) {
                if (distribution.containsKey(bm)){
                    distribution.put(bm,distribution.get(bm)+preise.get(bm));
                }
                else distribution.put(bm,preise.get(bm));
            }
        }
        List<TupleStringDouble> list = new ArrayList<>();
        for (String s: distribution.keySet()) {
            list.add(new TupleStringDouble(s,distribution.get(s)));
        }
        // nach Größe der Anteile sortieren
        list.sort((s,k)-> (int) (k.getaDouble() - s.getaDouble()));
        return list;
    }*/
}