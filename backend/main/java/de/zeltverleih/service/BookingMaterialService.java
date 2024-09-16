package de.zeltverleih.service;

import de.zeltverleih.Konstanten;
import de.zeltverleih.model.datenbank.BookingMaterial;
import de.zeltverleih.model.datenbank.Material;
import de.zeltverleih.repository.BookingMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class BookingMaterialService {

    @Autowired
    private BookingMaterialRepository buchungMaterialRepository;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private BookingService buchungService;


    public BookingMaterial saveBuchungMaterial(BookingMaterial bm){
        return buchungMaterialRepository.save(bm);
    }
    public List<BookingMaterial> getAllBuchungMaterial(){
        return buchungMaterialRepository.findAll();
    }


    public void deleteBuchungMaterial(BookingMaterial bookingMaterial) {
        buchungMaterialRepository.delete(bookingMaterial);
    }

    /**Bestimmt für übergebenes Material den Anzahl an verfügbaren Stücken im angegebenen Zeitraum.
     * Dabei gibt es für Garnituren und das 4x6 und 4x10 Zelt eine gesonderte Berechnung.**/
    public int getFreeNumbers(Material material, LocalDate startdatum, LocalDate enddatum){
        boolean isBestuhlung = Konstanten.getBestuhlung().contains(material.getName());
        boolean isZelt = Konstanten.getConnectedZelte().contains(material.getName());
        if (isBestuhlung){
            return getFreePlacesOfBestuhlung(material, startdatum, enddatum);
        }
        else if (isZelt){
            return getFreeNumbersOf4x6And4x10(startdatum, enddatum);
        }
        else return getFreeNumbers(material.getId(), startdatum, enddatum);
    }

    public List<BookingMaterial> getMaterialienByBuchung_Id(int id){
        return buchungMaterialRepository.findMaterialienByBuchung_Id(id);
    }

    public int getFreeNumbersWithoutSelf(Material material, int buchungsId, LocalDate startdatum, LocalDate enddatum){
        List<BookingMaterial> bmList = getMaterialienByBuchung_Id(buchungsId);
        List<Material> mList = bmList.stream().map(BookingMaterial::getMaterial).toList();
        if (mList.contains(material)){
            List<BookingMaterial> bmGesucht = bmList.stream().filter(bm -> bm.getMaterial().equals(material)).toList();
            return getFreeNumbers(material, startdatum, enddatum) + bmGesucht.get(0).getQuantity();
        }
        else return getFreeNumbers(material, startdatum, enddatum);
    }

    private int getFreeNumbers(Long materialId, LocalDate startdatum, LocalDate enddatum){
        Material m = getElseThrow(materialId);
        int besetzt = getOccupiedNumbers(materialId,startdatum, enddatum);
        return m.getCount() - besetzt;
    }

    public int getFreeNumbersOf4x6And4x10 (LocalDate startdatum, LocalDate enddatum){
        Material Zelt4x6 = materialService.getMaterialByName(Konstanten.getZelt4x6Name());
        Material Zelt4x10 = materialService.getMaterialByName(Konstanten.getZelt4x10Name());
        int frei4x6 = getFreeNumbers(Zelt4x6.getId(), startdatum, enddatum);
        int frei4x10 = getFreeNumbers(Zelt4x10.getId(), startdatum, enddatum);

        return Math.min(frei4x6,frei4x10);
    }

    private Material getElseThrow(Long materialId){
        return materialService.findById(materialId);
    }

    public int getOccupiedNumbers(Long materialId, LocalDate startdatum, LocalDate enddatum){
        Material m = getElseThrow(materialId);
        return Math.min(buchungMaterialRepository.getOccupiedNumbers(materialId,startdatum, enddatum), m.getCount());
    }

    private int getFreePlacesOfBestuhlung(Material material, LocalDate startdatum, LocalDate enddatum) {

        List<Material> bestuhlungsList = new ArrayList<>();
        Konstanten.getBestuhlung().forEach(
                name -> bestuhlungsList.add(materialService.getMaterialByName(name))
        );

        Map<Material, Integer> freeMap = getFreeForMaterialList(bestuhlungsList, startdatum, enddatum);

        Material Garnituren = materialService.getMaterialByName(Konstanten.getGarniturName());
        int besetzeGarnituren = getOccupiedNumbers(Garnituren.getId(), startdatum, enddatum);
        int freiTische = 0;
        int freiBaenke = 0;

        for (Material m: bestuhlungsList){
            if(m.getName().equals(Konstanten.getTischName())){
                freiTische = freeMap.get(m) - besetzeGarnituren;

            }
            if(m.getName().equals(Konstanten.getBankName())){
                freiBaenke = freeMap.get(m) - besetzeGarnituren*2;
            }
        }

        int freiGarnituren = Math.min(freiTische, freiBaenke/2);



        if(material.getName().equals(Konstanten.getTischName())){
            return freiTische;
        }
        if(material.getName().equals(Konstanten.getBankName())){
            return freiBaenke;
        }
        else return freiGarnituren;
    }

    private Map<Material, Integer> getFreeForMaterialList(List<Material> materialList, LocalDate startdatum, LocalDate enddatum) {
        Map<Material, Integer> materialMap = new HashMap<>();
        for (Material m: materialList){
            int besetzt = getFreeNumbers(m.getId(), startdatum, enddatum);
            materialMap.put(m, besetzt);
        }
        return materialMap;
    }

    public Optional<BookingMaterial> getById(int id){
        return buchungMaterialRepository.findById(id);
    }

    public List<BookingMaterialRepository.statistikMaterial> getAnzahlVonVermietungenInsgesamt(){
        return buchungMaterialRepository.getAnzahlVonVermietungenInsgesamt();
    }
}
